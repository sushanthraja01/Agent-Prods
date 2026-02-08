import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import Loader from "./Loader";


const Product = ({ prod, cart, setCart }) => {
  const token = localStorage.getItem("token");
  const debounceRef = useRef(null);

  if (!prod || !prod.images) return null;

  const images = Array.isArray(prod.images)
    ? prod.images.map(img => img.imageUrl)
    : [prod.images];

  const [activeImage, setActiveImage] = useState(images[0]);

  const qty = cart.find(i => i.prod === prod.id)?.qty || 0;

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const syncToServer = (updatedCart, newQty) => {
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
          body: JSON.stringify({ prod: prod.id, qty: newQty }),
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
    if (!qty) return;

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

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col h-[420px]">

      {/* IMAGE SECTION */}
      <div className="flex gap-4 h-[300px]">

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 object-contain border rounded cursor-pointer
                  ${activeImage === img ? "border-blue-600" : "border-gray-300"}`}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={activeImage}
            alt={prod.name}
            className="max-h-full object-contain"
          />
        </div>
      </div>

      {/* CART BUTTON */}
      <div className="mt-4">
        {qty === 0 ? (
          <button
            onClick={addprod}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
          >
            ADD TO CART
          </button>
        ) : (
          <div className="flex justify-between items-center bg-green-600 text-white rounded-lg px-4 py-2 font-bold">
            <button onClick={removeprod}>
              {qty === 1 ? <IonIcon icon={trashOutline} /> : "−"}
            </button>
            <span>{qty}</span>
            <button onClick={addprod}>+</button>
          </div>
        )}
      </div>
    </div>
  );
};


const Productdetails = ({ currentvar, prod, setCurrentvar }) => {
  if (!prod || !prod.id) return null;

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8 space-y-6 w-full">
      
      {/* Product Title */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {prod.name}
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          {prod.description}
        </p>
      </div>

      <div>
        <p className="text-xl font-bold">₹{prod.discountPrice}</p>
        <small>
          <strike>₹{prod.basePrice}</strike>{" "}
          <b className="text-green-700">{prod.discountPercent}% Off</b>
        </small>
      </div>

      {/* Category */}
      <p className="text-sm text-gray-500">
        Category:{" "}
        <span className="capitalize text-gray-700">
          {prod.category}
        </span>
      </p>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">
          ⭐ {prod.rating}
        </span>
        <span className="text-sm text-gray-500">
          {prod.reviewCount} Reviews
        </span>
      </div>

      {/* Variants */}
      {prod.variants?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Available Variants
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {prod.variants.map((variant) => {
              const isActive = variant === currentvar;

              return (
                <div
                  key={variant.id}
                  onClick={() => setCurrentvar(variant)}
                  className={`
                    cursor-pointer rounded-xl p-4 border transition-all
                    ${isActive
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-md scale-[1.02]"
                      : "border-gray-300 hover:border-blue-400 hover:shadow"}
                  `}
                >
                  <p className="text-sm font-medium">
                    Colour: <span className="font-semibold">{variant.color}</span>
                  </p>
                  <p className="text-sm font-medium">
                    Size: <span className="font-semibold">{variant.size}</span>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="py-3">
            <p className=""><span className="text-gray-500">Specifications</span>&nbsp;&nbsp;&nbsp;&nbsp;Size:{currentvar.size}&nbsp;&nbsp;|&nbsp;&nbsp;Colour:{currentvar.color}</p>
          </div>

          {/* Product Meta Info */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
              <tbody>
                <tr className="border-collapse">
                  <td className="px-4 py-2 font-semibold bg-gray-50">Seller</td>
                  <td className="px-4 py-2">{prod.brand}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold bg-gray-50">Seller Rating</td>
                  <td className="px-4 py-2">{prod.brandRating?prod.brandRating:4.6}</td>
                </tr>
                <tr className="border-collapse">
                  <td className="px-4 py-2 font-semibold bg-gray-50">SKU</td>
                  <td className="px-4 py-2">{prod.slug}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold bg-gray-50">
                    Returnable
                  </td>
                  <td className="px-4 py-2">
                    {prod.returnable ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold bg-gray-50">
                    Return Policy
                  </td>
                  <td className="px-4 py-2">
                    Returnable before {prod.returnWindowDays} days from delivery
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


const SuggestedProducts = ({ cart, setCart }) => {
  const [sp, setSp] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setSp(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white shadow-xl p-6 rounded-2xl mt-20">
      <h2 className="text-2xl font-bold mb-5">Suggested Products</h2>

      <div className="flex gap-6 overflow-x-auto">
        {sp.map(item => (
          <div
            key={item.id}
            className="min-w-[220px] border p-4 rounded-2xl cursor-pointer"
            onClick={() => nav(`/product/${item.id}`)}
          >
            <img src={item.image} className="h-32 mx-auto" />
            <p className="font-semibold mt-2">{item.title}</p>
            <p className="font-bold text-green-700">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==================== Product Page ==================== */
const Productpage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentvar,setCurrentvar] = useState()

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(
        `https://ae-sprotsbackend.onrender.com/products/${id}`
      );
      const data = await res.json();
      setProduct(data);
      console.log(data.variants[0]);
      setCurrentvar(data.variants[0])
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Loader />;

  return (
  <div className="w-full px-6">

    {/* PRODUCT + DETAILS WRAPPER */}
    <div className="flex flex-col lg:flex-row gap-6">

      {/* LEFT: Sticky Product Image */}
      <div className="lg:w-1/3">
        <div className="sticky top-24">
          <Product prod={product} cart={cart} setCart={setCart} />
        </div>
      </div>

      {/* RIGHT: Scrollable Product Details */}
      <div className="lg:w-2/3">
        <Productdetails prod={product} currentvar={currentvar} setCurrentvar={setCurrentvar} />
      </div>

    </div>

    {/* SUGGESTED PRODUCTS (starts AFTER image sticky ends) */}
    <div className="mt-20">
      <SuggestedProducts cart={cart} setCart={setCart} />
    </div>

  </div>
);

};

export default Productpage;
