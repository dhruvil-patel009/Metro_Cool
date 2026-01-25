import Link from "next/link";

export function CTASection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-[80px] relative z-20">
      <div className="max-w-7xl mx-auto bg-blue-600 rounded-lg py-20 px-8 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to beat the heat?</h2>
          <p className="text-blue-50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your service today or browse our latest collection of energy-efficient air conditioners.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/user/service">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-md font-bold hover:bg-blue-50 transition-all cursor-pointer">
              Book a Service
            </button>
            </Link>
            <button className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-md font-bold hover:bg-white/10 transition-all">
              View Products
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
