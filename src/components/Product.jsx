import { useRef, useEffect } from "react";
import { trashOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

const Product = ({ prod, cart, setCart }) => {
  const token = localStorage.getItem("token");
  const debounceRef = useRef(null);

  // prevent crash if prod is undefined
  if (!prod) return null;

  // get quantity once
  const qty = cart.find(i => i.prod === prod.id)?.qty || 0;

  // cleanup debounce on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const syncToServer = (updatedCart, newQty) => {
    // guest user → localStorage
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await fetch("http://localhost:5000/api/cart/qty", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prod: prod.id,
            qty: newQty,
          }),
        });
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    }, 5000);
  };

  const addprod = () => {
    const updated =
      qty > 0
        ? cart.map(i =>
            i.prod === prod.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...cart, { prod: prod.id, qty: 1 }];

    setCart(updated);
    syncToServer(updated, qty + 1);
  };

  const removeprod = () => {
    if (qty === 0) return;

    const newQty = qty - 1;

    const updated =
      newQty === 0
        ? cart.filter(i => i.prod !== prod.id)
        : cart.map(i =>
            i.prod === prod.id ? { ...i, qty: newQty } : i
          );

    setCart(updated);
    syncToServer(updated, newQty);
  };

  const imageSrc = Array.isArray(prod.images)
    ? prod.images[0]?.imageUrl
    : prod.images;

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center text-center
                    hover:shadow-2xl transition duration-300
                    h-[420px] justify-between">

      <img
        src={imageSrc}
        alt={prod.name}
        className="w-[90%] h-[90%] object-contain"
      />

      <div className="w-full mt-4 space-y-3">
        {qty === 0 ? (
          <button
            onClick={addprod}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            ADD TO CART
          </button>
        ) : (
          <div className="flex justify-between items-center bg-green-600 text-white rounded-lg px-4 py-2 font-bold">
            <button onClick={removeprod} className="text-xl">
              {qty === 1 ? <IonIcon icon={trashOutline} /> : "−"}
            </button>

            <span className="text-lg">{qty}</span>

            <button onClick={addprod} className="text-xl">+</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
