import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Body from "./components/Body";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Productpage from "./components/Productpage";
import CheckoutForm from "./components/CheckOutForm";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Landingpage />}>
          <Route path="/" element={<Body />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Productpage />} />
          <Route path="/check" element={<CheckoutForm />} />
        </Route>
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
