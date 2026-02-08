const Productdetails = ({ prod }) => {

  if (!prod || !prod.id) return null;

  const specifications = {
    
  }; 


  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 text-gray-800 space-y-2 hover:shadow-2xl transition-all duration-300">
      
      <h2 className="text-2xl font-semibold"><b>{prod.name}</b></h2>
      <p>{prod.description}</p>
      <div>
        <p className="text-xl font-bold">₹{prod.discountPrice}</p>
        <small><strike>₹{prod.basePrice}</strike>&nbsp;&nbsp;<b className="text-green-700">{prod.discountPercent}%&nbsp;Off</b></small>
      </div>
      <p className="text-sm text-gray-500">
        Category: <span className="capitalize">{prod.category}</span>
      </p>

      <div className="flex items-center gap-4 mt-2">
        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
          ⭐ {prod.rating}
        </span>
        <span className="text-sm text-gray-500">
          {prod.reviewCount} Reviews
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="bg-gray-100 p-3 rounded-lg">
              <span className="font-semibold">{key}:</span> {value}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Productdetails;
