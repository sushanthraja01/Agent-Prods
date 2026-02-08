import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import CheckoutForm from "./CheckOutForm";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");
  const debounceMap = useRef({});

  const fetchCart = async () => {
    if (token) {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.items || []);
    } else {
      setCart(JSON.parse(localStorage.getItem("cart")) || []);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchAddress = async () => {
    if (!token) return;
    const res = await fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAddress(data.address || null);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCart(), fetchProducts(), fetchAddress()]);
      setLoading(false);
    };
    load();
    return () => {
      Object.values(debounceMap.current).forEach(clearTimeout);
    };
  }, []);

  const merge = (items) => {
    if (!products.length) return [];
    return products
      .filter((p) => items.some((i) => i.prod === p.id))
      .map((p) => {
        const c = items.find((i) => i.prod === p.id);
        return { ...p, quantity: c.qty };
      });
  };

  const cartItems = merge(cart);

  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map((i) =>
      i.prod === productId ? { ...i, qty: newQty } : i
    );
    setCart(updated);
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(updated));
      return;
    }
    if (debounceMap.current[productId]) {
      clearTimeout(debounceMap.current[productId]);
    }
    debounceMap.current[productId] = setTimeout(async () => {
      await fetch("http://localhost:5000/api/cart/qty", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prod: productId, qty: newQty }),
      });
    }, 500);
  };

  const removeItem = async (productId) => {
    const updated = cart.filter((i) => i.prod !== productId);
    setCart(updated);
    if (token) {
      await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prod: productId }),
      });
    } else {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const totalMRP = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = totalMRP * 0.25;
  const fee = 192;
  const totalAmount = totalMRP - discount + fee;

  const handleAddressSubmit = (data) => {
    setAddress(data);
    setShowForm(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <CheckoutForm onSubmit={handleAddressSubmit} />
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm">
                Deliver to:{" "}
                <span className="font-semibold">
                  {address ? `${address.name}, ${address.pincode}` : "No address added"}
                </span>
              </p>
              {address && (
                <p className="text-xs text-gray-600 mt-1">
                  {address.address}, {address.city}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 font-semibold text-sm"
            >
              {address ? "Change" : "Add"}
            </button>
          </div>

          <div className="bg-white rounded shadow">
            <div className="p-4 border-b font-semibold">Cart Items</div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border-b">
                <img src={item.image} className="w-28 h-28 object-contain" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-lg font-semibold mt-1">
                    ₹{(item.price * item.quantity).toFixed(1)}
                  </p>
                  <div className="px-3 py-1 bg-green-700 flex items-center justify-between text-white font-bold rounded-lg min-w-[7.5rem] max-w-[7.5rem]">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity === 1}>−</button>
                    {item.quantity?<span></span>:<span></span>}
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="mt-3 text-sm font-semibold hover:text-red-600">
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 h-fit sticky top-6">
          <h2 className="font-semibold border-b pb-2">Price details</h2>
          <div className="flex justify-between mt-4 text-sm">
            <span>MRP</span>
            <span>₹{totalMRP.toFixed(0)}</span>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Fee</span>
            <span>₹{fee}</span>
          </div>
          <div className="flex justify-between mt-2 text-sm text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-4">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(0)}</span>
          </div>
          <button className="w-full bg-orange-500 text-white py-3 mt-4 font-semibold rounded">
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
