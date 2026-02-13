import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { trashOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

const Products = () => {

  const nav = useNavigate();
  const inputRef = useRef(null);

  
  const [loading, setLoading] = useState(false);
  const [prods, setProds] = useState([]);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );


  const getqty = (productId) => {
    const item = cart.find((i) => i.prod === productId);
    return item ? item.qty : 0;
  };

  const getProduct = (productId) =>
    prods.find((p) => p.id === productId);

  const isSoldOut = (productId) => {
    const product = getProduct(productId);
    if (!product) return false;
    return product.stock===0;
  };

  const isOnlyOneLeft = (productId) => {
    const product = getProduct(productId);
    if (!product) return false;
    return getqty(productId) >= product.stock;
  };

  const getavailablestock = (productId) => {
    const product = getProduct(productId);
    if (!product) return 0;
    return product.stock;
  }


  const addprod = (productId) => {
    setCart((prev) => {
      const product = getProduct(productId);
      if (!product) return prev;

      const item = prev.find((i) => i.prod === productId);
      const currentQty = item ? item.qty : 0;

      if (currentQty === product.stock) return prev;

      if (item) {
        return prev.map((k) =>
          k.prod === productId ? { ...k, qty: k.qty + 1 } : k
        );
      }

      return [...prev, { prod: productId, qty: 1 }];
    });
  };

  const removeprod = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.prod === productId);
      if (!item) return prev;

      if (item.qty === 1) {
        return prev.filter((k) => k.prod !== productId);
      }

      return prev.map((k) =>
        k.prod === productId ? { ...k, qty: k.qty - 1 } : k
      );
    });
  };


  const getprods = async () => {
    try {
      const response = await fetch("https://ae-sprotsbackend.onrender.com/products");
      const res = await response.json();

      if (response.ok) {
        const withStock = res.map((p) => ({
          ...p,
          stock: 4,
        }));
        setProds(withStock);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
  if (prods.length === 0) return;

  setCart((prevCart) => {
    let changed = false;

    const updatedCart = prevCart
      .map((item) => {
        const product = prods.find(p => p.id === item.prod);
        if (!product) return item;

        if (item.qty > product.stock) {
          changed = true;
          return { ...item, qty: product.stock };
        }

        return item;
      })
      .filter(item => item.qty > 0);

    return changed ? updatedCart : prevCart;
  });
}, [prods]);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getprods();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full py-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {prods.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform"
            >

              <div className="h-56 w-full bg-gray-100 flex items-center justify-center p-4 cursor-pointer">
                {product.images.length>=1?<img onClick={()=>{nav(`/product/${product.id}`);window.scrollTo({top: 0,behavior: "smooth" });}}
                  src={product.images[1].imageUrl}
                  alt={product.name}
                  className="max-h-full object-contain"
                />:<img onClick={()=>{nav(`/product/${product.id}`);window.scrollTo({
    top: 0,
    behavior: "smooth" // optional (for smooth scrolling)
  });}} alt={product.name} />}
              </div>

              <div className="flex flex-col flex-grow p-4">
                <p className="text-sm text-gray-500">
                  {product.category}
                </p>

                <h2
                  className="font-semibold text-lg line-clamp-2 cursor-pointer hover:underline"
                  onClick={() => {nav(`/product/${product.id}`);window.scrollTo({
    top: 0,
    behavior: "smooth" // optional (for smooth scrolling)
  });}}
                >
                  {product.name}
                </h2>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold  ">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⭐ {product.rating}
                  </span>
                </div>

                <div>
                  <small><strike>₹{product.basePrice}</strike>&nbsp;&nbsp;<b className="text-green-700">{product.discountPercent}%&nbsp;Off</b></small>
                </div>

                <div className="flex-grow"></div>

                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;