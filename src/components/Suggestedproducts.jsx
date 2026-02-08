import { useEffect, useState, useRef } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { trashOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

const SuggestedProducts = ({ cart, setCart }) => {

  const [sp, setSp] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const debounceRef = useRef(null);

  const getqty = (id) => {
    const t = cart.find(i => i.prod === id);
    return t ? t.qty : 0;
  };

  const syncToServer = (updatedCart, id, newQty) => {
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await fetch("http://localhost:5000/api/cart/qty", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prod: id, qty: newQty }),
      });
    }, 5000);
  };

  const addprod = (id) => {
    let updated;
    const existing = cart.find(i => i.prod === id);

    if (existing) {
      updated = cart.map(i =>
        i.prod === id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...cart, { prod: id, qty: 1 }];
    }

    setCart(updated);
    syncToServer(updated, id, getqty(id) + 1);
  };

  const removeprod = (id) => {
    const existing = cart.find(i => i.prod === id);
    if (!existing) return;

    let updated;
    const newQty = existing.qty - 1;

    if (newQty === 0) {
      updated = cart.filter(i => i.prod !== id);
    } else {
      updated = cart.map(i =>
        i.prod === id ? { ...i, qty: newQty } : i
      );
    }

    setCart(updated);
    syncToServer(updated, id, newQty);
  };

  const getsuggestedprods = async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    if (response.ok) {
      const res = await response.json();
      setSp(res);
    }
  };

  useEffect(() => {
    const hl = async () => {
      setLoading(true);
      await getsuggestedprods();
      setLoading(false);
    };
    hl();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {sp.length === 0 ? (
        <div></div>
      ) : (
        <div className="bg-white shadow-xl p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-5 text-gray-800">Suggested Products</h2>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto select-none py-2"
          >
            {sp.map((item) => (
              <div
                key={item.id}
                className="min-w-[220px] bg-white border border-gray-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="h-36 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full object-contain"
                  />
                </div>

                <p
                  className="text-sm font-semibold mt-3 line-clamp-2 cursor-pointer hover:underline"
                  onClick={() => nav(`/product/${item.id}`)}
                >
                  {item.title}
                </p>

                <p className="text-base font-bold text-green-700 mt-1 mb-3">
                  ₹{item.price}
                </p>

                {getqty(item.id) === 0 ? (
                  <button
                    onClick={() => addprod(item.id)}
                    className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <div className="mt-auto flex justify-between items-center bg-green-600 text-white rounded-xl px-4 py-2 font-bold">
                    <button onClick={() => removeprod(item.id)} className="text-xl">{getqty(item.id) === 1 ? (<IonIcon icon={trashOutline} />):<p>−</p>}</button>
                    <span className="text-lg">{getqty(item.id)}</span>
                    <button onClick={() => addprod(item.id)} className="text-xl">+</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SuggestedProducts;
