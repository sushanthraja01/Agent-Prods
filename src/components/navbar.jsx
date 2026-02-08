import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { cartOutline, personCircleOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/10">
      
      <div className="flex items-center justify-between h-14 md:h-20 px-4 md:px-8">

        <div className="flex items-center gap-4 h-full">

          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setOpen(!open)}
          >
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>
          <img
            src="https://agentesports.in/img/logo/agent_logo.png"
            alt="logo"
            className="h-full object-contain"
          />
          <div className="hidden md:flex gap-6 text-sm font-semibold tracking-wide ">
            <button
              className="text-black hover:text-[#E10600] transition"
              onClick={() => nav("/")}
            >
              Home
            </button>
            <button className="text-black hover:text-[#E10600] transition cursor-pointer">
              About Us
            </button>
            <button className="text-black hover:text-[#E10600] transition cursor-pointer">
              Tournaments
            </button>
            <button
              className="text-black hover:text-[#E10600] transition cursor-pointer"
              onClick={() => nav("/products")}
            >
              Products
            </button>
            <button className="text-black hover:text-[#E10600] transition cursor-pointer">
              Blogs
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1 font-semibold text-black hover:text-[#E10600] transition">
            <IonIcon icon={personCircleOutline} className="text-2xl md:text-3xl" />
            <span className="hidden md:inline">Profile</span>
          </button>

          <button className="flex items-center gap-1 font-semibold text-black hover:text-[#E10600] transition" onClick={()=>{nav("/cart")}}>
            <IonIcon icon={cartOutline} className="text-xl md:text-2xl" />
            <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-3 px-6 py-5 bg-white border-t border-black/10">
          <button
            className="font-semibold text-left text-black hover:text-[#E10600]"
            onClick={() => {
              nav("/");
              setOpen(false);
            }}
          >
            Home
          </button>
          <button className="font-semibold text-left text-black hover:text-[#E10600]">
            About Us
          </button>
          <button className="font-semibold text-left text-black hover:text-[#E10600]">
            Tournaments
          </button>
          <button
            className="font-semibold text-left text-black hover:text-[#E10600]"
            onClick={() => {
              nav("/products");
              setOpen(false);
            }}
          >
            Products
          </button>
          <button className="font-semibold text-left text-black hover:text-[#E10600]">
            Blogs
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
