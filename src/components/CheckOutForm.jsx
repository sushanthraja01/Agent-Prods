import { useState } from "react";

const CheckoutForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "COD",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Full Address"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <select
          name="payment"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Debit / Credit Card</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-semibold"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
