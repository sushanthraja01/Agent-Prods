

const Body = () => {

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0B0F19] via-[#141820] to-black text-white px-4">
      
      <div className="text-center max-w-3xl">


        <span className="inline-block mb-4 px-4 py-1 text-xs font-semibold tracking-widest uppercase text-[#E10600] border border-[#E10600]/40 rounded-full">
          Competitive • Gaming • Esports
        </span>


        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Welcome to{" "}
          <span className="text-[#E10600]">Agent</span>
          Esports
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-10">
          Enter the battlefield of competitive gaming.  
          Compete in tournaments, follow top teams, and gear up like a pro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-[#E10600] text-white font-semibold rounded-md hover:bg-red-600 transition">
            Explore Tournaments
          </button>
          <button className="px-8 py-3 border border-white/30 text-white font-semibold rounded-md hover:border-[#E10600] hover:text-[#E10600] transition">
            Join the Community
          </button>
        </div>

      </div>
    </section>
  );
}

export default Body;
