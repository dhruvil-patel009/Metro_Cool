// "use client"

// import { useEffect, useState } from "react"

// import {
//   Wrench,
//   Settings,
//   CheckCircle2,
//   ArrowRight,
//   ShoppingBag,
//   Star,
//   Facebook,
//   Twitter,
//   Menu,
//   Snowflake,
//   History,
//   Sparkles,
//   Cpu,
// } from "lucide-react"
// import Link from "next/link"

// const heroSlides = [
//   {
//     bg: "/assets/Hero-Slider-AC-Repairing-1.jpg",
//     badge: "Certified Cooling Experts",
//     title: "Mastering the Art of",
//     highlight: "Cool Comfort",
//     desc:
//       "Experience premium HVAC services with our engineering-first approach. We ensure perfect climate control for your home.",
//   },
//   {
//     bg: "/assets/Hero-Slider-AC-Repairing-2.jpg",
//     badge: "Trusted AC Professionals",
//     title: "Precision Cooling for",
//     highlight: "Modern Homes",
//     desc:
//       "Smart, energy-efficient air conditioning solutions designed for maximum comfort and performance.",
//   },
//   {
//     bg: "/assets/Hero-Slider-AC-Repairing-4.jpg",
//     badge: "24/7 Service Support",
//     title: "Reliable Climate",
//     highlight: "Control Solutions",
//     desc:
//       "From installation to maintenance, we deliver hassle-free HVAC services you can depend on.",
//   },
// ]

// const testimonials = [
//     {
//       quote:
//         "The technician was on time and very professional. He explained the issue with my AC clearly and fixed it within an hour. Highly recommended!",
//       author: "Sarah Jenkins",
//       role: "Homeowner",
//       image: "/assets/testimonial-image.avif",
//     },
//     {
//       quote:
//         "I ordered a new AC unit and installation service. The process was seamless, and the price was very competitive compared to other local vendors.",
//       author: "Michael Ross",
//       role: "Business Owner",
//       image: "/assets/testimonial-image.avif",
//     },
//     {
//       quote:
//         "Quick response and excellent service quality. I will definitely recommend them to my friends.",
//       author: "Emily Watson",
//       role: "Apartment Owner",
//       image: "/assets/testimonial-image.avif",
//     },
//      {
//       quote:
//         "Quick response and excellent service quality. I will definitely recommend them to my friends.",
//       author: "Emily Watson",
//       role: "Apartment Owner",
//       image: "/assets/testimonial-image.avif",
//     },
//      {
//       quote:
//         "Quick response and excellent service quality. I will definitely recommend them to my friends.",
//       author: "Emily Watson",
//       role: "Apartment Owner",
//       image: "/assets/testimonial-image.avif",
//     },
//   ]


// export default function HomeServicePage() {

//   const [current, setCurrent] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % heroSlides.length)
//     }, 3000)

//     return () => clearInterval(interval)
//   }, [])

//   const slide = heroSlides[current]


//   return (
//     <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-20 items-center">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <Snowflake className="text-white w-5 h-5" />
//               </div>
//               <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//             </div>

//             <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
//               <Link href="#" className="text-blue-600">
//                 Home
//               </Link>
//               <Link href="#" className="hover:text-blue-600 transition-colors">
//                 Services
//               </Link>
//               <Link href="#" className="hover:text-blue-600 transition-colors">
//                 Products
//               </Link>
//               <Link href="#" className="hover:text-blue-600 transition-colors">
//                 About Us
//               </Link>
//               <Link href="#" className="hover:text-blue-600 transition-colors">
//                 Contact
//               </Link>
//             </div>

//             <div className="flex items-center gap-3">
//               <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
//                 Book Now
//               </button>
//               <button className="hidden sm:block text-gray-600 px-4 py-2 text-sm font-semibold hover:text-gray-900 transition-colors">
//                 Login
//               </button>
//               <button className="md:hidden">
//                 <Menu className="w-6 h-6 text-gray-600" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//      <section
//       className="relative min-h-[700px] flex items-center overflow-hidden transition-all duration-1000"
//       style={{
//         backgroundImage: `url(${slide.bg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/60" />

//       {/* Radial gradient (UNCHANGED) */}
//       <div
//         className="absolute inset-0 opacity-50"
//         style={{
//           background:
//             "radial-gradient(circle at 90% 50%, rgba(212, 212, 192, 0.4) 0%, transparent 60%)",
//         }}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
//         <div className="max-w-3xl transition-all duration-700">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
//             <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
//               <CheckCircle2 className="text-white w-2.5 h-2.5" />
//             </div>
//             {slide.badge}
//           </div>

//           <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-3 text-white">
//             {slide.title} <br />
//             <span className="text-blue-500">{slide.highlight}</span>
//           </h1>

//           <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-xl">
//             {slide.desc}
//           </p>

//           <div className="flex flex-wrap gap-4 mb-12">
//             <button className="bg-blue-600 text-white px-8 py-4 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
//               Book Service
//             </button>
//             <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-md font-bold hover:bg-white/20 transition-all border border-white/10">
//               Our Plans
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Slide Indicators */}
//       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
//   {heroSlides.map((_, i) => (
//     <span
//       key={i}
//       className={`w-3 h-3 rounded-full transition-all duration-300 ${
//         current === i
//           ? "bg-blue-600 scale-125"
//           : "bg-gray-500/60"
//       }`}
//     />
//   ))}
// </div>

//     </section>


//       {/* Services Section */}
//       <section className="py-24 bg-[#f9fafb]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">What We Do</p>
//             <h2 className="text-4xl font-bold">Our Professional Services</h2>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <ServiceCard
//               icon={<Wrench className="w-6 h-6 text-blue-600" />}
//               title="AC Repair"
//               description="Fast diagnostics and expert fixes for all AC brands. We restore your cooling comfort instantly."
//               linkText="Book Repair"
//             />
//             <ServiceCard
//               icon={<Settings className="w-6 h-6 text-blue-600" />}
//               title="Installation"
//               description="Professional uninstallation and installation services. Secure mounting and leakage checks included."
//               linkText="Book Install"
//             />
//             <ServiceCard
//               icon={<Settings className="w-6 h-6 text-blue-600" />}
//               title="Maintenance"
//               description="Regular servicing to improve efficiency and longevity. Deep cleaning and gas refilling services."
//               linkText="Book Service"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-8 bg-[#ff000]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
//               <p className="text-gray-500">Genuine parts and top-rated appliances</p>
//             </div>
//             <Link href="#" className="text-blue-600 font-bold text-sm flex items-center gap-1">
//               View All <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <ProductCard
//               image="/assets/Hero-Slider-AC-Repairing-1.jpg"
//               title="Inverter AC 1.5 Ton"
//               subtitle="Energy efficient, fast cooling"
//               price="450"
//               badge="New"
//             />
//             <ProductCard
//               image="/assets/Hero-Slider-AC-Repairing-2.jpg"
//               title="Copper Pipe Kit"
//               subtitle="High quality insulated pipes"
//               price="45"
//             />
//             <ProductCard
//               image="/assets/Hero-Slider-AC-Repairing-3.jpg"
//               title="Universal Remote"
//               subtitle="Compatible with all brands"
//               price="15"
//               oldPrice="19"
//               discount="-20%"
//             />
//             <ProductCard image="/assets/Hero-Slider-AC-Repairing-4.jpg" title="HEPA Air Filter" subtitle="Removes 99% of dust" price="25" />
//           </div>
//         </div>
//       </section>

//       {/* Story/About Section */}
//       <section className="py-24 bg-white overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
//             <div>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-12 h-[2px] bg-blue-600" />
//                 <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">About Us</span>
//               </div>

//               <h2 className="text-5xl font-bold mb-8 text-[#1d242d]">The MetroCool Story</h2>

//               <div className="space-y-6 text-gray-500 leading-relaxed mb-10">
//                 <p>
//                   Founded in 2016, <span className="font-bold text-[#1d242d]">Comfort HVAC Solutions</span> began with a
//                   mission to deliver precision cooling for residential, industrial, and IT environments. With over 9+
//                   years of experience handling commercial chillers, industrial HVAC systems, and server-room cooling, we
//                   noticed one major gap — the service booking experience was outdated.
//                 </p>
//                 <p>
//                   <span className="text-blue-600 font-bold">MetroCool</span> is the digital evolution of Comfort HVAC
//                   Solutions. We bring industrial-grade HVAC expertise into a seamless, 60-second online booking
//                   experience.
//                 </p>
//                 <p>
//                   When customers book with MetroCool, they receive technicians trained by HVAC engineers — not just
//                   general service workers.
//                 </p>
//               </div>

//               <button className="bg-[#1d242d] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-black transition-all">
//                 Read full story <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="mt-16 lg:mt-0 space-y-6">
//               <AboutCard
//                 icon={<History className="w-5 h-5 text-blue-600" />}
//                 title="Deep Roots"
//                 desc="Backed by nearly a decade of HVAC expertise."
//               />
//               <AboutCard
//                 icon={<Sparkles className="w-5 h-5 text-blue-600" />}
//                 title="Zero Mess Promise"
//                 desc='Signature "Service Jacket" protocol.'
//               />
//               <AboutCard
//                 icon={<Cpu className="w-5 h-5 text-blue-600" />}
//                 title="Engineering Mindset"
//                 desc="Optimized cooling, not just cleaning."
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           What Our Customers Say
//         </h2>

//         {/* SLIDER */}
//         <div className="overflow-hidden">
//           <div
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{ transform: `translateX(-${current * 100}%)` }}
//           >
//             {testimonials.map((item, index) => (
//               <div key={index} className="min-w-full md:min-w-[50%] px-2">
//                 <TestimonialCard {...item} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* DOTTED INDICATORS */}
//         <div className="flex justify-center gap-3 mt-8">
//   {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, i) => (
//     <button
//       key={i}
//       onClick={() => setCurrent(i * 2)}
//       className={`w-3 h-3 rounded-full transition-all duration-300 ${
//         current === i * 2
//           ? "bg-blue-600 scale-125"
//           : "bg-gray-400/60"
//       }`}
//     />
//   ))}
// </div>

//       </div>
//     </section>

//       {/* CTA Section */}
//       <section className="px-4 sm:px-6 lg:px-8 mb-[80px] relative z-20">
//         <div className="max-w-7xl mx-auto bg-blue-600 rounded-lg py-20 px-8 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
//           {/* Grid pattern background */}
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "24px 24px" }}
//           />

//           <div className="relative z-10">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to beat the heat?</h2>
//             <p className="text-blue-50 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
//               Book your service today or browse our latest collection of energy-efficient air conditioners.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <button className="bg-white text-blue-600 px-10 py-4 rounded-md font-bold hover:bg-blue-50 transition-all">
//                 Book a Service
//               </button>
//               <button className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-md font-bold hover:bg-white/10 transition-all">
//                 View Products
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-[#f9fafb] pt-40 pb-12 border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-12 mb-20">
//             <div className="col-span-1 md:col-span-1">
//               <div className="flex items-center gap-2 mb-6">
//                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                   <Snowflake className="text-white w-5 h-5" />
//                 </div>
//                 <span className="text-xl font-bold">Metro Cool</span>
//               </div>
//               <p className="text-sm text-gray-500 leading-relaxed mb-6">
//                 Your trusted partner for all cooling solutions. We bring comfort to your home with expert services.
//               </p>
//               <div className="flex gap-4">
//                 <Link
//                   href="#"
//                   className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"
//                 >
//                   <Facebook className="w-5 h-5" />
//                 </Link>
//                 <Link
//                   href="#"
//                   className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"
//                 >
//                   <Twitter className="w-5 h-5" />
//                 </Link>
//               </div>
//             </div>

//             <div>
//               <h4 className="font-bold mb-6">Services</h4>
//               <ul className="space-y-4 text-sm text-gray-500">
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     AC Repair
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     Installation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     Annual Maintenance
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     Gas Refill
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold mb-6">Quick Links</h4>
//               <ul className="space-y-4 text-sm text-gray-500">
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     About Us
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     Contact
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     Privacy Policy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-blue-600">
//                     Terms of Service
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold mb-6">Newsletter</h4>
//               <p className="text-sm text-gray-500 mb-6">Subscribe to get special offers and updates.</p>
//               <div className="space-y-3">
//                 <div className="relative">
//                   <input
//                     type="email"
//                     placeholder="Your email address"
//                     className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                   />
//                 </div>
//                 <button className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-all">
//                   Subscribe
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="text-center pt-12 border-t border-gray-200">
//             <p className="text-xs text-gray-400 font-medium tracking-wide">
//               &copy; 2026 Metro Cool Services. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// function ServiceCard({ icon, title, description, linkText }: any) {
//   return (
//     <div className="bg-white p-10 rounded-lg border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
//       <div className="w-16 h-16 bg-blue-50 rounded-md flex items-center justify-center mb-6 transition-colors duration-300">
//         <div className="group-hover:text-white">{icon}</div>
//       </div>
//       <h3 className="text-2xl font-bold mb-4">{title}</h3>
//       <p className="text-gray-500 leading-relaxed mb-8">{description}</p>
//       <Link href="#" className="text-blue-600 font-bold text-sm flex items-center gap-1">
//         {linkText} <ArrowRight className="w-4 h-4" />
//       </Link>
//     </div>
//   )
// }

// function AboutCard({ icon, title, desc }: any) {
//   return (
//     <div className="bg-[#f9fafb] p-8 rounded-md flex items-center gap-6 border border-gray-50 shadow-sm hover:shadow-md transition-all group">
//       <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
//         {icon}
//       </div>
//       <div>
//         <h3 className="font-bold text-lg text-[#1d242d] mb-1">{title}</h3>
//         <p className="text-sm text-gray-400 font-medium">{desc}</p>
//       </div>
//     </div>
//   )
// }

// function Step({ icon, number, title, desc }: any) {
//   return (
//     <div className="flex flex-col items-center max-w-[200px] relative z-10">
//       <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg mb-6">
//         {icon}
//       </div>
//       <h3 className="text-lg font-bold mb-2">
//         {number}. {title}
//       </h3>
//       <p className="text-sm text-gray-400 leading-relaxed text-center px-2">{desc}</p>
//     </div>
//   )
// }

// function ProductCard({ image, title, subtitle, price, badge, oldPrice, discount }: any) {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
//       <div className="relative aspect-square rounded-md overflow-hidden bg-gray-50 mb-4">
//         {badge && (
//           <span className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
//             {badge}
//           </span>
//         )}
//         {discount && (
//           <span className="absolute top-4 left-4 z-10 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
//             {discount}
//           </span>
//         )}
//         <img
//           src={image || "/placeholder.svg"}
//           alt={title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
//           <Star className="w-4 h-4 text-gray-400" />
//         </button>
//       </div>
//       <div className="px-4 py-3">
//         <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
//         <p className="text-xs text-gray-400 mb-4 font-medium">{subtitle}</p>
//         <div className="flex justify-between items-center">
//           <div className="flex items-baseline gap-2">
//             <span className="text-lg font-bold">${price}</span>
//             {oldPrice && <span className="text-xs text-gray-300 line-through">${oldPrice}</span>}
//           </div>
//           <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
//             <ShoppingBag className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// function TestimonialCard({ quote, author, role, image }: any) {
//   return (
//     <div className="bg-white p-10 rounded-lg border border-gray-100 shadow-sm">
//       <div className="flex gap-1 mb-6 text-blue-600">
//         {[...Array(5)].map((_, i) => (
//           <Star key={i} className="w-4 h-4 fill-current" />
//         ))}
//       </div>
//       <p className="text-lg text-gray-600 italic leading-relaxed mb-8">"{quote}"</p>
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
//           <img src={image || "/placeholder.svg"} alt={author} className="w-full h-full object-cover" />
//         </div>
//         <div>
//           <p className="font-bold text-gray-900">{author}</p>
//           <p className="text-xs text-gray-400 font-medium">{role}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// Service Page
// import Link from "next/link"
// import Image from "next/image"
// import { ChevronRight, ArrowUpRight } from "lucide-react"

// const services = [
//   {
//     title: "Room Air-Conditioner",
//     description: "Comprehensive service for standalone room units to ensure optimal performance.",
//     image: "/assets/Hero-Slider-AC-Repairing-1.jpg",
//   },
//   {
//     title: "Split AC + Window AC",
//     description: "Expert care for both split and window AC models, covering all technical aspects.",
//     image: "/assets/Hero-Slider-AC-Repairing-2.jpg",
//   },
//   {
//     title: "Installations",
//     description: "Professional mounting, unmounting, and setup services with safety protocols.",
//     image: "/assets/Hero-Slider-AC-Repairing-3.jpg",
//   },
//   {
//     title: "AC Services",
//     description: "Routine maintenance, filter cleaning, and master service checks for efficiency.",
//     image: "/assets/Hero-Slider-AC-Repairing-4.jpg",
//   },
//   {
//     title: "Repair + Gas Charging",
//     description: "Fixing cooling issues, leakages, component replacements, and gas charging.",
//     image: "/assets/Hero-Slider-AC-Repairing-1.jpg",
//   },
// ]

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:px-8 lg:px-12">
//       {/* Breadcrumbs */}
//       <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
//         <Link href="/" className="hover:text-blue-600">
//           Home
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <span className="font-medium text-slate-900">Services</span>
//       </nav>

//       {/* Header */}
//       <header className="mb-10 max-w-2xl">
//         <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">AC Services</h1>
//         <p className="text-base text-slate-600 leading-relaxed">
//           Premium cooling solutions for your home. Select a service below to view details and book an expert technician.
//         </p>
//       </header>

//       {/* Services Grid */}
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {services.map((service, index) => (
//           <div
//             key={index}
//             className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
//           >
//             {/* Image Container */}
//             <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
//               <Image
//                 src={service.image || "/placeholder.svg"}
//                 alt={service.title}
//                 fill
//                 className="object-cover transition-transform duration-300 group-hover:scale-105"
//               />
//               <button className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40">
//                 <ArrowUpRight className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               <h3 className="mb-2 text-lg font-bold text-slate-900">{service.title}</h3>
//               <p className="mb-6 text-sm leading-relaxed text-slate-600">{service.description}</p>
//               <Link
//                 href={`/services/${service.title.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
//               >
//                 View Details
//                 <ChevronRight className="h-4 w-4" />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// Service Details
// import Image from "next/image"
// import {
//   ChevronRight,
//   Search,
//   Bell,
//   Star,
//   Clock,
//   UserCheck,
//   ShieldCheck,
//   Calendar,
//   Users,
//   Truck,
//   Share2,
//   Heart,
//   SearchCheck,
//   Droplets,
//   Wind,
//   Trash2,
//   ChevronDown,
//   Headphones,
//   CheckCircle2,
//   ThumbsUp,
// } from "lucide-react"

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
//       {/* Navigation */}
//       <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-[#0060ff] rounded flex items-center justify-center">
//                 <Wind className="text-white w-5 h-5" />
//               </div>
//               <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//             </div>

//             <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
//               <a href="#" className="hover:text-[#0060ff]">
//                 Services
//               </a>
//               <a href="#" className="hover:text-[#0060ff]">
//                 Bookings
//               </a>
//               <a href="#" className="hover:text-[#0060ff]">
//                 Support
//               </a>
//             </div>

//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-400 hover:text-gray-600">
//                 <Search className="w-5 h-5" />
//               </button>
//               <button className="p-2 text-gray-400 hover:text-gray-600 relative">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
//               </button>
//               <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
//                 SignIn
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Breadcrumbs */}
//         <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-8">
//           <a href="#" className="hover:text-[#0060ff] flex items-center gap-1">
//             <Calendar className="w-3 h-3" /> Home
//           </a>
//           <ChevronRight className="w-3 h-3" />
//           <a href="#" className="hover:text-[#0060ff]">
//             Services
//           </a>
//           <ChevronRight className="w-3 h-3" />
//           <a href="#" className="hover:text-[#0060ff]">
//             Cooling
//           </a>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-gray-900 font-medium text-pretty">Split AC Power Jet</span>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//           {/* Main Content */}
//           <div className="lg:col-span-8">
//             {/* Header Section */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="bg-blue-50 text-[#0060ff] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-blue-100">
//                   Bestseller
//                 </span>
//                 <div className="flex items-center gap-1 text-sm">
//                   <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                   <span className="font-bold">4.9</span>
//                   <span className="text-gray-400 text-xs">1.2k+ reviews</span>
//                 </div>
//               </div>
//               <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
//                 Split AC Power Jet Service
//               </h1>
//               <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
//                 Advanced high-pressure cleaning for superior cooling performance and healthier air quality. Recommended
//                 every 6 months.
//               </p>
//             </div>

//             {/* Quick Info */}
//             <div className="flex flex-wrap gap-8 mb-10">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0060ff]">
//                   <Clock className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Duration</p>
//                   <p className="font-bold text-sm">60 Minutes</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
//                   <UserCheck className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Expertise</p>
//                   <p className="font-bold text-sm">Certified Pro</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
//                   <ShieldCheck className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Warranty</p>
//                   <p className="font-bold text-sm">30 Days</p>
//                 </div>
//               </div>
//             </div>

//             {/* Hero Image */}
//             <div className="relative rounded-md overflow-hidden mb-12 shadow-2xl group">
//               <Image
//                 src="/professional-technician-cleaning-split-ac-unit-wit.jpg"
//                 alt="AC Cleaning Service"
//                 width={800}
//                 height={450}
//                 className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
//               />
//               <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-xs font-bold">Available Today</span>
//               </div>
//               <div className="absolute top-6 right-6 flex gap-2">
//                 <button className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors">
//                   <Share2 className="w-4 h-4 text-gray-700" />
//                 </button>
//                 <button className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors">
//                   <Heart className="w-4 h-4 text-gray-700" />
//                 </button>
//               </div>
//             </div>

//             {/* What's Included */}
//             <div className="mb-16">
//               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
//                 <span className="w-1.5 h-8 bg-[#0060ff] rounded-full"></span>
//                 What&apos;s Included
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {[
//                   {
//                     title: "Pre-service Inspection",
//                     desc: "Detailed checks on gas pressure, cooling coil, and overall system health.",
//                     icon: SearchCheck,
//                     color: "bg-blue-50 text-blue-600",
//                   },
//                   {
//                     title: "Deep Jet Cleaning",
//                     desc: "High-pressure wash for condenser coils, drain trays, and blower fans.",
//                     icon: Droplets,
//                     color: "bg-indigo-50 text-indigo-600",
//                   },
//                   {
//                     title: "Anti-bacterial Wash",
//                     desc: "Chemical treatment for filters to eliminate mold, fungi, and bad odors.",
//                     icon: Wind,
//                     color: "bg-cyan-50 text-cyan-600",
//                   },
//                   {
//                     title: "Site Cleanup",
//                     desc: "Thorough post-service cleanup of the area and final performance test.",
//                     icon: Trash2,
//                     color: "bg-blue-50 text-blue-600",
//                   },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex gap-4 p-5 rounded-md bg-white border border-gray-100 hover:shadow-md transition-shadow"
//                   >
//                     <div className={`w-12 h-12 shrink-0 rounded-md flex items-center justify-center ${item.color}`}>
//                       <item.icon className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold mb-1">{item.title}</h3>
//                       <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Enhance Your Service */}
//             <div className="mb-16">
//               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
//                 <span className="w-1.5 h-8 bg-[#0060ff] rounded-full"></span>
//                 Enhance Your Service
//               </h2>
//               <div className="space-y-4">
//                 {[
//                   { title: "Gas Top-up", price: "+$20.00", badge: "Popular", img: "/refrigerant-gas-cylinder.jpg" },
//                   { title: "Anti-rust Coating", price: "+$12.00", badge: null, img: "/protective-spray-bottle-for-ac.jpg" },
//                 ].map((addon, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between p-4 rounded-md bg-white border border-gray-100 hover:border-blue-100 transition-colors"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="relative w-16 h-16 rounded-md overflow-hidden">
//                         <Image src={addon.img || "/placeholder.svg"} alt={addon.title} fill className="object-cover" />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <h3 className="font-bold">{addon.title}</h3>
//                           {addon.badge && (
//                             <span className="text-[8px] bg-blue-50 text-[#0060ff] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
//                               {addon.badge}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-[10px] text-gray-400 leading-tight max-w-[180px]">
//                           Refill refrigerant gas up to 10 PSI if levels are found low during inspection.
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <span className="font-bold text-gray-900">{addon.price}</span>
//                       <input
//                         type="checkbox"
//                         className="w-5 h-5 rounded border-gray-300 text-[#0060ff] focus:ring-[#0060ff]"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Common Questions */}
//             <div className="mb-16">
//               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
//                 <span className="w-1.5 h-8 bg-[#0060ff] rounded-full"></span>
//                 Common Questions
//               </h2>
//               <div className="space-y-3">
//                 {["Does this service include gas filling?", "What if a spare part is needed?"].map((q, i) => (
//                   <div
//                     key={i}
//                     className="group p-5 rounded-md bg-white border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                   >
//                     <span className="font-semibold text-gray-700">{q}</span>
//                     <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-y-0.5" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-4">
//             <div className="sticky top-24 space-y-6">
//               {/* Booking Card */}
//               <div className="bg-white rounded-md border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
//                 <div className="p-8 pb-0 flex justify-between items-start">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Total Estimate</p>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-5xl font-black tracking-tighter">
//                         $49<span className="text-2xl">.00</span>
//                       </span>
//                       <span className="text-gray-400 line-through text-lg">$65.00</span>
//                     </div>
//                     <p className="text-[10px] text-gray-400 mt-1">Taxes & fees included</p>
//                   </div>
//                   <div className="relative">
//                     <div className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
//                       SAVE 25%
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rotate-45 transform translate-x-3 translate-y-3"></div>
//                   </div>
//                 </div>

//                 <div className="p-8 space-y-6">
//                   <div className="space-y-4 py-6 border-y border-gray-50">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 text-gray-500">
//                         <Calendar className="w-5 h-5" />
//                         <span className="text-sm font-medium">Date</span>
//                       </div>
//                       <span className="text-sm font-bold">Tomorrow, 10:00 AM</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 text-gray-500">
//                         <Users className="w-5 h-5" />
//                         <span className="text-sm font-medium">Team Size</span>
//                       </div>
//                       <span className="text-sm font-bold">1 Technician</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 text-gray-500">
//                         <Truck className="w-5 h-5" />
//                         <span className="text-sm font-medium">Visit Fee</span>
//                       </div>
//                       <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
//                         Free
//                       </span>
//                     </div>
//                   </div>

//                   <button className="w-full bg-[#0060ff] text-white py-5 rounded-md font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-200">
//                     Book Appointment <ChevronRight className="w-5 h-5" />
//                   </button>

//                   <div className="flex gap-3">
//                     <div className="flex-1 bg-gray-50 p-4 rounded-md flex flex-col items-center gap-2 text-center">
//                       <CheckCircle2 className="w-5 h-5 text-blue-600" />
//                       <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
//                         Secure Payment
//                       </span>
//                     </div>
//                     <div className="flex-1 bg-gray-50 p-4 rounded-md flex flex-col items-center gap-2 text-center">
//                       <ThumbsUp className="w-5 h-5 text-blue-600" />
//                       <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
//                         Satisfaction Guarantee
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Assistance Card */}
//               <div className="bg-[#111827] rounded-md p-8 text-white relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
//                 <div className="flex items-start gap-4 relative z-10">
//                   <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center backdrop-blur-sm">
//                     <Headphones className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold mb-1">Need Assistance?</h3>
//                     <p className="text-gray-400 text-xs mb-4">Our experts are here 24/7.</p>
//                     <a
//                       href="tel:800METRO"
//                       className="inline-flex items-center gap-1 text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
//                     >
//                       Call 800-METRO <Share2 className="w-3 h-3 rotate-45" />
//                     </a>
//                   </div>
//                 </div>
//                 {/* Decorative dots pattern */}
//                 <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-1 opacity-20">
//                   {[...Array(4)].map((_, i) => (
//                     <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-100 mt-20 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
//             <div className="space-y-6">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-[#0060ff] rounded flex items-center justify-center">
//                   <Wind className="text-white w-5 h-5" />
//                 </div>
//                 <span className="text-xl font-bold">Metro Cool</span>
//               </div>
//               <p className="text-gray-400 text-sm leading-relaxed text-pretty">
//                 Premium HVAC services for modern homes. We bring comfort to your doorstep with certified experts.
//               </p>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Company</h4>
//               <ul className="space-y-3 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     About Us
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     Careers
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     Blog
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Services</h4>
//               <ul className="space-y-3 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     AC Repair
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     Installation
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     Annual Maintenance
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-[10px]">Legal</h4>
//               <ul className="space-y-3 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-[#0060ff]">
//                     Terms of Service
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-16 pt-8 border-t border-gray-50 text-center">
//             <p className="text-xs text-gray-400">© 2023 Metro Cool Services. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// Product Details
// import Image from "next/image"
// import { Search, ShoppingCart, User, Star, Check, Shield, Truck, ChevronRight, Heart, Menu } from "lucide-react"
// import { Suspense } from "react"

// export default function HomeServicePage() {
//   return (
//     <Suspense fallback={null}>
//       <ProductPageContent />
//     </Suspense>
//   )
// }

// function ProductPageContent() {
//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <div className="flex items-center gap-8">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0060ff] text-white">
//                 <div className="h-4 w-4 border-2 border-white rotate-45"></div>
//               </div>
//               <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//             </div>
//             <nav className="hidden md:flex items-center gap-6">
//               <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#0060ff]">
//                 Services
//               </a>
//               <a href="#" className="text-sm font-medium text-[#0060ff]">
//                 Products
//               </a>
//               <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#0060ff]">
//                 Bookings
//               </a>
//               <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#0060ff]">
//                 Support
//               </a>
//             </nav>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="relative hidden lg:block">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="h-10 w-64 rounded-lg border bg-slate-50 pl-10 pr-4 text-sm focus:border-[#0060ff] focus:outline-none focus:ring-1 focus:ring-[#0060ff]"
//               />
//             </div>
//             <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100">
//               <ShoppingCart className="h-5 w-5" />
//             </button>
//             <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100">
//               <User className="h-5 w-5" />
//             </button>
//             <div className="h-8 w-8 rounded-full bg-slate-200 lg:block hidden overflow-hidden border">
//               <Image src="/sarah-jenkins.jpg" alt="Profile" width={32} height={32} className="object-cover" />
//             </div>
//             <button className="md:hidden">
//               <Menu className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-[1320px] px-4 py-6">
//         {/* Breadcrumbs */}
//         <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
//           <a href="#" className="hover:text-[#0060ff]">
//             Home
//           </a>
//           <ChevronRight className="h-3 w-3" />
//           <a href="#" className="hover:text-[#0060ff]">
//             Cooling
//           </a>
//           <ChevronRight className="h-3 w-3" />
//           <span className="text-slate-900">Air Conditioners</span>
//         </nav>

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
//           {/* Product Gallery */}
//           <div className="lg:col-span-7 xl:col-span-8">
//             <div className="relative aspect-square w-full overflow-hidden rounded-md border bg-white shadow-sm">
//               <Image
//                 src="/air-conditioner-unit.jpg"
//                 alt="Metro Cool Inverter Split AC"
//                 fill
//                 className="object-contain p-8"
//               />
//             </div>
//             <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4">
//               {[
//                 "/air-conditioner-unit.jpg",
//                 "/ac-remote-control.jpg",
//                 "/air-conditioner-unit.jpg",
//                 "/ac-repair.jpg",
//               ].map((src, i) => (
//                 <button
//                   key={i}
//                   className={`relative aspect-square min-h-[64px] overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:border-[#0060ff] ${i === 0 ? "ring-2 ring-[#0060ff]" : ""}`}
//                 >
//                   <Image
//                     src={src || "/placeholder.svg"}
//                     alt={`Thumbnail ${i + 1}`}
//                     fill
//                     className="object-contain p-2"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Buy Box */}
//           <div className="lg:col-span-5 xl:col-span-4">
//             <div className="rounded-md border bg-white p-6 shadow-sm">
//               <div className="mb-4 flex gap-2">
//                 <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 tracking-wider">
//                   IN STOCK
//                 </span>
//                 <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0060ff] tracking-wider">
//                   BEST SELLER
//                 </span>
//               </div>

//               <h1 className="mb-2 text-2xl font-bold text-slate-900 lg:text-3xl">
//                 Metro Cool Inverter Split AC - 1.5 Ton
//               </h1>

//               <div className="mb-6 flex items-center gap-2">
//                 <div className="flex text-amber-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="h-4 w-4 fill-current" />
//                   ))}
//                 </div>
//                 <span className="text-xs text-slate-500">(124 reviews)</span>
//               </div>

//               <div className="mb-6 flex items-baseline gap-3">
//                 <span className="text-3xl font-bold text-[#0060ff]">$450.00</span>
//                 <span className="text-sm text-slate-400 line-through">$599.00</span>
//                 <span className="text-xs font-bold text-emerald-600">Save 25%</span>
//               </div>

//               <div className="mb-6">
//                 <span className="mb-3 block text-sm font-medium text-slate-700">Capacity</span>
//                 <div className="flex gap-3">
//                   {["1.0 Ton", "1.5 Ton", "2.0 Ton"].map((size) => (
//                     <button
//                       key={size}
//                       className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all ${size === "1.5 Ton" ? "border-[#0060ff] bg-blue-50 text-[#0060ff] ring-1 ring-[#0060ff]" : "bg-white text-slate-600 hover:bg-slate-50"}`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-8 rounded-md border bg-slate-50 p-4">
//                 <label className="flex items-start gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0060ff] focus:ring-[#0060ff]"
//                   />
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <span className="text-sm font-bold text-slate-900">Professional Installation</span>
//                       <span className="text-sm font-bold text-slate-900">+$50.00</span>
//                     </div>
//                     <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
//                       Includes unboxing, mounting, and demo by certified Metro Cool experts.
//                     </p>
//                   </div>
//                 </label>
//               </div>

//               <div className="space-y-3">
//                 <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0060ff] py-[18px] font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 active:scale-[0.98]">
//                   <ShoppingCart className="h-5 w-5" />
//                   Purchase Now
//                 </button>
//                 <button className="w-full rounded-md border border-slate-200 py-[18px] font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]">
//                   Add to Cart
//                 </button>
//               </div>

//               <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#0060ff]">
//                     <Shield className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
//                       WARRANTY
//                     </span>
//                     <span className="text-xs font-bold text-slate-700">5 Years Comp.</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#0060ff]">
//                     <Truck className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
//                       DELIVERY
//                     </span>
//                     <span className="text-xs font-bold text-slate-700">Free Express</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="mt-12">
//           <div className="mb-6 flex overflow-x-auto border-b scrollbar-hide">
//             {["Description", "Specifications", "Reviews (124)"].map((tab, i) => (
//               <button
//                 key={tab}
//                 className={`px-6 py-[18px] text-sm font-medium transition-all ${i === 0 ? "border-b-2 border-[#0060ff] text-[#0060ff]" : "text-slate-500 hover:text-slate-900"}`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="rounded-md border bg-white p-8 shadow-sm">
//             <h2 className="mb-4 text-xl font-bold text-slate-900">Efficient Cooling for Modern Homes</h2>
//             <p className="mb-6 leading-relaxed text-slate-500">
//               Experience superior comfort with the Metro Cool Inverter Split AC. Designed with advanced inverter
//               technology, it adjusts power consumption precisely to maintain your desired temperature, saving you up to
//               45% on energy bills. The sleek design blends seamlessly into any modern interior, while the whisper-quiet
//               operation ensures your sleep is never disturbed.
//             </p>
//             <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
//               {[
//                 { title: "Dual Inverter Compressor", desc: "Faster cooling and longer durability." },
//                 { title: "Smart Connectivity", desc: "Control from anywhere via the Metro Cool app." },
//                 { title: "Anti-Viral Filter", desc: "Ensures the air you breathe is clean and healthy." },
//               ].map((item, i) => (
//                 <li key={i} className="flex items-start gap-3">
//                   <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0060ff] text-white">
//                     <Check className="h-2 w-2" />
//                   </div>
//                   <span className="text-sm leading-relaxed text-slate-600">
//                     <strong className="text-slate-900">{item.title}:</strong> {item.desc}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Reviews Section */}
//         <div className="mt-12 rounded-md border bg-white p-8 shadow-sm">
//           <h2 className="mb-8 text-xl font-bold text-slate-900">Customer Reviews</h2>
//           <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12">
//             {/* Rating Summary */}
//             <div className="lg:col-span-3">
//               <div className="flex items-baseline gap-2">
//                 <span className="text-5xl font-bold text-slate-900">4.8</span>
//                 <span className="text-slate-400">out of 5</span>
//               </div>
//               <div className="my-3 flex text-amber-400">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} className="h-5 w-5 fill-current" />
//                 ))}
//               </div>
//               <p className="text-xs text-slate-500">Based on 124 reviews</p>

//               <div className="mt-6 space-y-2">
//                 {[
//                   { star: 5, pct: 70 },
//                   { star: 4, pct: 20 },
//                   { star: 3, pct: 5 },
//                   { star: 2, pct: 3 },
//                   { star: 1, pct: 2 },
//                 ].map((rating) => (
//                   <div key={rating.star} className="flex items-center gap-3">
//                     <span className="w-2 text-[10px] font-bold text-slate-500">{rating.star}</span>
//                     <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
//                       <div className="h-full bg-[#0060ff]" style={{ width: `${rating.pct}%` }}></div>
//                     </div>
//                     <span className="w-8 text-[10px] font-bold text-slate-400">{rating.pct}%</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Individual Reviews */}
//             <div className="lg:col-span-9">
//               <div className="space-y-8">
//                 {[
//                   {
//                     name: "Marcus Johnson",
//                     date: "2 days ago",
//                     text: "Absolutely love this AC unit. The installation service from Metro Cool was prompt and professional. The unit itself is incredibly quiet, I sometimes forget it's even on.",
//                     avatar: "/sarah-jenkins.jpg",
//                   },
//                   {
//                     name: "Sarah Jenkins",
//                     date: "1 week ago",
//                     text: "Great value for money. Cooling is fast. The only downside is the remote feels a bit plasticky, but the app works perfectly so I use that mostly.",
//                     avatar: "/sarah-jenkins.jpg",
//                   },
//                 ].map((review, i) => (
//                   <div key={i} className="flex gap-4">
//                     <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border bg-slate-100">
//                       <Image
//                         src={review.avatar || "/placeholder.svg"}
//                         alt={review.name}
//                         width={40}
//                         height={40}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-bold text-slate-900">{review.name}</span>
//                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                           {review.date}
//                         </span>
//                       </div>
//                       <div className="mb-2 flex text-amber-400">
//                         {[...Array(5)].map((_, j) => (
//                           <Star key={j} className="h-3 w-3 fill-current" />
//                         ))}
//                       </div>
//                       <p className="text-sm leading-relaxed text-slate-500">{review.text}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button className="mt-10 w-full rounded-md border py-[18px] text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
//                 Load more reviews
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* You might also like */}
//         <section className="mt-16">
//           <div className="mb-8 flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-slate-900">You might also like</h2>
//             <button className="text-sm font-bold text-[#0060ff] hover:underline">View all</button>
//           </div>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {[
//               {
//                 name: "Metro Frost Portable Cooler",
//                 price: 120.0,
//                 rating: 4.5,
//                 img: "/air-conditioner-unit.jpg",
//                 badge: null,
//               },
//               {
//                 name: "PureAir Smart Purifier",
//                 price: 199.0,
//                 oldPrice: 250.0,
//                 rating: 4.9,
//                 img: "/ac-repair.jpg",
//                 badge: "SALE",
//               },
//               {
//                 name: "AeroSilent Ceiling Fan",
//                 price: 89.0,
//                 rating: 4.2,
//                 img: "/split-ac-unit.jpg",
//                 badge: null,
//               },
//               { name: "Wall Heater Pro", price: 145.0, rating: 4.7, img: "/ac-installation.jpg", badge: null },
//             ].map((product, i) => (
//               <div
//                 key={i}
//                 className="group overflow-hidden rounded-md border bg-white shadow-sm transition-all hover:shadow-md"
//               >
//                 <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
//                   <Image
//                     src={product.img || "/placeholder.svg"}
//                     alt={product.name}
//                     fill
//                     className="object-contain p-6 transition-transform group-hover:scale-105"
//                   />
//                   {product.badge && (
//                     <span className="absolute left-3 top-3 rounded bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
//                       {product.badge}
//                     </span>
//                   )}
//                   <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 backdrop-blur-sm transition-all hover:bg-white hover:text-rose-500">
//                     <Heart className="h-4 w-4" />
//                   </button>
//                 </div>
//                 <div className="p-4">
//                   <div className="mb-2 flex items-center justify-between">
//                     <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h3>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
//                       <span className="text-[10px] font-bold text-slate-500">{product.rating}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-sm font-bold text-[#0060ff]">${product.price.toFixed(2)}</span>
//                     {product.oldPrice && (
//                       <span className="text-[10px] text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="mt-20 border-t bg-white py-8">
//         <div className="mx-auto max-w-[1320px] px-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center text-xs">
//           <div className="flex items-center gap-2 text-slate-900 font-bold">
//             <div className="h-5 w-5 rounded bg-[#0060ff] flex items-center justify-center text-white">
//               <div className="h-2 w-2 border-2 border-white rotate-45"></div>
//             </div>
//             <span>Metro Cool</span>
//           </div>
//           <div className="flex gap-6 uppercase tracking-widest">
//             <a href="#">Privacy Policy</a>
//             <a href="#">Terms of Service</a>
//             <a href="#">Support</a>
//           </div>
//           <span>© 2023 Metro Cool Inc.</span>
//         </div>
//       </footer>
//     </div>
//   )
// }

// Service Booking - Confirmation
// import {
//   Check,
//   Copy,
//   Printer,
//   FileText,
//   Calendar,
//   Clock,
//   MapPin,
//   ArrowRight,
//   Star,
//   User,
//   PenTool as Tool,
// } from "lucide-react"
// import Image from "next/image"

// export default function BookingConfirmation() {
//   return (
//     <div className="min-h-screen flex flex-col items-center pb-12">
//       {/* Navigation Header */}
//       <header className="w-full border-b bg-white px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-2">
//           <div className="text-brand-blue">
//             <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
//               <path d="M12,2L14.43,8.97H21.75L15.82,13.28L18.25,20.25L12,15.94L5.75,20.25L8.18,13.28L2.25,8.97H9.57L12,2Z" />
//             </svg>
//           </div>
//           <span className="font-bold text-xl tracking-tight">Metro Cool</span>
//         </div>

//         <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
//           <a href="#" className="hover:text-brand-blue transition-colors">
//             Home
//           </a>
//           <a href="#" className="hover:text-brand-blue transition-colors">
//             Services
//           </a>
//           <a href="#" className="text-brand-blue font-semibold">
//             Bookings
//           </a>
//           <a href="#" className="hover:text-brand-blue transition-colors">
//             Support
//           </a>
//         </nav>

//         <div className="flex items-center gap-2">
//           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-blue/20">
//             <Image src="/diverse-avatars.png" alt="User profile" width={40} height={40} />
//           </div>
//         </div>
//       </header>

//       <main className="w-full max-w-4xl px-4 mt-12 flex flex-col items-center">
//         {/* Success Icon */}
//         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
//           <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white">
//             <Check className="w-6 h-6 stroke-[3]" />
//           </div>
//         </div>

//         {/* Success Messaging */}
//         <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Your Service is Booked!</h1>
//         <p className="text-gray-500 text-center max-w-lg mb-6 leading-relaxed">
//           We have sent a confirmation email to <span className="font-semibold text-gray-900">user@example.com</span>{" "}
//           with all the details.
//         </p>

//         {/* Booking ID Badge */}
//         <div className="bg-blue-50 text-brand-blue px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold mb-12">
//           Booking ID: #MC-882910
//           <button className="hover:text-blue-700 transition-colors">
//             <Copy className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Main Summary Card */}
//         <div className="w-full bg-white rounded-md border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
//           {/* Card Header */}
//           <div className="px-6 py-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <h2 className="font-bold text-lg">Booking Summary</h2>
//             <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
//               <button className="flex items-center gap-1.5 hover:text-brand-blue transition-colors">
//                 <Printer className="w-4 h-4" /> Print
//               </button>
//               <button className="flex items-center gap-1.5 hover:text-brand-blue transition-colors">
//                 <FileText className="w-4 h-4" /> Receipt
//               </button>
//             </div>
//           </div>

//           <div className="p-6 md:p-8">
//             {/* Service Details Section */}
//             <div className="flex flex-col md:flex-row gap-8 mb-8">
//               <div className="relative w-full md:w-56 h-40 rounded-md overflow-hidden">
//                 <Image src="/ac-technician.jpg" alt="Technician working on AC" fill className="object-cover" />
//               </div>

//               <div className="flex-1 flex flex-col justify-center">
//                 <div className="inline-flex items-center text-[10px] font-bold tracking-wider text-brand-blue bg-blue-50 px-2 py-1 rounded mb-2 uppercase">
//                   Verified Professional
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3">Split AC Advanced Service</h3>

//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
//                   <User className="w-4 h-4 text-brand-blue" />
//                   <span className="font-medium">Provider:</span>
//                   <span className="text-gray-900 font-semibold">Metro Cool Experts</span>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   {[1, 2, 3, 4, 5].map((i) => (
//                     <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
//                   ))}
//                   <span className="text-sm text-gray-400 ml-1 font-medium">(4.8/5)</span>
//                 </div>
//               </div>
//             </div>

//             {/* Info Grid (Date/Time & Location) */}
//             <div className="grid md:grid-cols-2 gap-4 mb-8">
//               {/* Date & Time */}
//               <div className="bg-surface-grey p-5 rounded-md border border-gray-50">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Date & Time</p>
//                 <div className="flex items-start gap-4 mb-4">
//                   <div className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100">
//                     <Calendar className="w-5 h-5 text-brand-blue" />
//                   </div>
//                   <div>
//                     <p className="font-bold">Oct 24, 2023</p>
//                     <p className="text-sm text-gray-500">Thursday</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100">
//                     <Clock className="w-5 h-5 text-brand-blue" />
//                   </div>
//                   <div>
//                     <p className="font-bold">10:00 AM - 11:00 AM</p>
//                     <p className="text-sm text-brand-blue font-medium">1 Hour Duration</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Service Location */}
//               <div className="bg-surface-grey p-5 rounded-md border border-gray-50 relative overflow-hidden">
//                 {/* Simulated Map Background */}
//                 <div className="absolute inset-0 opacity-10">
//                   <div className="w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
//                 </div>

//                 <div className="relative z-10">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Service Location</p>
//                   <div className="flex items-start gap-4">
//                     <div className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100">
//                       <MapPin className="w-5 h-5 text-red-500" />
//                     </div>
//                     <div>
//                       <p className="font-bold">123 Metro Avenue, Apt 4B</p>
//                       <p className="text-sm text-gray-500 mb-3">New York, NY 10001</p>
//                       <button className="text-sm font-bold text-brand-blue hover:underline">Get Directions</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Summary */}
//             <div className="border-t border-dashed pt-8 mb-10">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gray-100 px-3 py-1.5 rounded-md text-[10px] font-bold border border-gray-200">
//                     VISA
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm">Visa ending in 4242</p>
//                     <p className="text-xs text-brand-green font-medium">Payment processed</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm text-gray-400 font-medium">Total Amount Paid</span>
//                   <span className="text-3xl font-bold">$85.00</span>
//                 </div>
//               </div>
//             </div>

//             {/* Process Timeline */}
//             <div className="bg-surface-grey/50 rounded-md p-6 border border-gray-50">
//               <h4 className="font-bold mb-8">What Happens Next?</h4>
//               <div className="relative flex justify-between items-start">
//                 {/* Timeline Line */}
//                 <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-gray-200 z-0" />
//                 <div className="absolute top-5 left-[10%] w-[40%] h-[2px] bg-brand-blue z-0" />

//                 {/* Step 1 */}
//                 <div className="relative z-10 flex flex-col items-center gap-3 w-24">
//                   <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white ring-8 ring-white">
//                     <Check className="w-5 h-5" />
//                   </div>
//                   <span className="text-xs font-bold text-brand-blue">Booked</span>
//                 </div>

//                 {/* Step 2 */}
//                 <div className="relative z-10 flex flex-col items-center gap-3 w-24">
//                   <div className="w-10 h-10 bg-white border-2 border-brand-blue rounded-full flex items-center justify-center text-brand-blue ring-8 ring-white">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <span className="text-xs font-bold text-gray-900 text-center">Assigning Pro</span>
//                 </div>

//                 {/* Step 3 */}
//                 <div className="relative z-10 flex flex-col items-center gap-3 w-24">
//                   <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 ring-8 ring-white">
//                     <Tool className="w-5 h-5" />
//                   </div>
//                   <span className="text-xs font-bold text-gray-400">Service</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Final Actions */}
//         <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
//           <button className="w-full sm:w-auto px-10 py-4 font-bold border-2 border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
//             Back to Home
//           </button>
//           <button className="w-full sm:w-auto px-10 py-4 font-bold bg-brand-blue text-white rounded-md shadow-[0_4px_14px_rgba(0,132,255,0.4)] hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
//             View My Bookings <ArrowRight className="w-4 h-4" />
//           </button>
//         </div>

//         <p className="mt-8 text-gray-400 text-sm font-medium">
//           Need to reschedule? <button className="text-brand-blue font-bold hover:underline">Contact Support</button>
//         </p>
//       </main>
//     </div>
//   )
// }

// Order History and Dashboard
// import type React from "react"
// import {
//   Bell,
//   User,
//   ShoppingBag,
//   MapPin,
//   CreditCard,
//   LogOut,
//   ChevronRight,
//   ChevronLeft,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   Truck,
//   Zap,
//   Wrench,
//   Thermometer,
// } from "lucide-react"

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-[#F4F7FA] font-sans text-[#1A1C1E]">
//       {/* Top Navigation */}
//       <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-gray-100 bg-white px-6 lg:px-12">
//         <div className="flex items-center gap-10">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066FF] text-white">
//               <Zap size={20} fill="currentColor" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold leading-tight">Metro Cool</h1>
//               <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Premium HVAC</p>
//             </div>
//           </div>
//           <div className="hidden items-center gap-8 text-sm font-medium text-[#64748B] md:flex">
//             <a href="#" className="hover:text-[#0066FF]">
//               Services
//             </a>
//             <a href="#" className="hover:text-[#0066FF]">
//               Shop
//             </a>
//             <a href="#" className="hover:text-[#0066FF]">
//               Support
//             </a>
//           </div>
//         </div>

//         <div className="flex items-center gap-6">
//           <button className="hidden rounded-full bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 md:block">
//             Book Service
//           </button>
//           <div className="flex items-center gap-3 border-l pl-6">
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-bold">Alex Johnson</p>
//               <p className="text-[11px] font-medium text-amber-500">Gold Member</p>
//             </div>
//             <div className="relative">
//               <img
//                 src="/images/screen.png"
//                 alt="Profile"
//                 className="h-10 w-10 rounded-full object-cover border-2 border-green-500"
//               />
//               <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
//         {/* Breadcrumbs */}
//         <div className="mb-8 flex items-center gap-2 text-sm text-[#64748B]">
//           <span>Home</span>
//           <ChevronRight size={14} />
//           <span className="font-medium text-[#1A1C1E]">My Account</span>
//         </div>

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
//           {/* Sidebar */}
//           <aside className="space-y-6">
//             {/* Profile Card */}
//             <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
//               <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[24px] bg-[#F1E4D8]">
//                 <User size={48} className="text-[#8B5E3C]" />
//               </div>
//               <h2 className="mb-1 text-xl font-bold">Alex Johnson</h2>
//               <p className="mb-6 text-sm text-[#64748B]">alex.johnson@example.com</p>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="rounded-md bg-[#F8FAFC] py-4">
//                   <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">Orders</p>
//                   <p className="text-lg font-bold">24</p>
//                 </div>
//                 <div className="rounded-md bg-[#F8FAFC] py-4">
//                   <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">Saved</p>
//                   <p className="text-lg font-bold">$1.2k</p>
//                 </div>
//               </div>
//             </div>

//             {/* Side Nav */}
//             <div className="rounded-[32px] bg-white py-4 shadow-sm">
//               <nav className="flex flex-col">
//                 <NavItem icon={<User size={18} />} label="Profile Information" />
//                 <NavItem icon={<ShoppingBag size={18} />} label="Order History" isActive badge="New" />
//                 <NavItem icon={<MapPin size={18} />} label="Saved Addresses" />
//                 <NavItem icon={<CreditCard size={18} />} label="Payment Methods" />
//                 <NavItem icon={<Bell size={18} />} label="Notifications" />
//                 <div className="my-4 mx-8 border-t border-gray-100"></div>
//                 <NavItem icon={<LogOut size={18} />} label="Sign Out" isDanger />
//               </nav>
//             </div>

//             {/* Promo Banner */}
//             <div className="relative overflow-hidden rounded-[32px] bg-[#0066FF] p-8 text-white">
//               <div className="relative z-10">
//                 <h3 className="mb-2 text-xl font-bold">Summer Sale!</h3>
//                 <p className="mb-6 text-sm leading-relaxed opacity-80">
//                   Get 20% off on all AC servicing packages this month.
//                 </p>
//                 <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#0066FF]">
//                   View Offers
//                 </button>
//               </div>
//               {/* Decorative Background Elements */}
//               <div className="absolute -right-4 -bottom-4 opacity-20">
//                 <Zap size={120} />
//               </div>
//             </div>
//           </aside>

//           {/* Content Area */}
//           <section className="space-y-6">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//               <div>
//                 <h1 className="text-3xl font-black tracking-tight">Order History</h1>
//                 <p className="text-[#64748B]">Manage your bookings, track status and download invoices.</p>
//               </div>
//               <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
//                 <FilterTab label="All" isActive />
//                 <FilterTab label="Services" />
//                 <FilterTab label="Products" />
//                 <FilterTab label="Cancelled" />
//               </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//               <StatCard
//                 icon={<ShoppingBag className="text-[#0066FF]" size={20} />}
//                 value="12"
//                 label="Total Orders"
//                 bgColor="bg-blue-50"
//               />
//               <StatCard
//                 icon={<CheckCircle2 className="text-[#10B981]" size={20} />}
//                 value="08"
//                 label="Completed"
//                 bgColor="bg-emerald-50"
//               />
//               <StatCard
//                 icon={<Clock className="text-[#8B5CF6]" size={20} />}
//                 value="01"
//                 label="Upcoming"
//                 bgColor="bg-purple-50"
//               />
//             </div>

//             {/* Orders List */}
//             <div className="space-y-4">
//               {/* Active/Upcoming Order */}
//               <div className="overflow-hidden rounded-[32px] border-2 border-[#D9E6FF] bg-white shadow-sm transition-all hover:shadow-md">
//                 <div className="flex flex-col md:flex-row">
//                   <div className="flex w-full flex-col items-center justify-center bg-[#F8FAFC] p-8 md:w-[140px]">
//                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Nov</span>
//                     <span className="text-3xl font-black">02</span>
//                     <span className="text-xs font-medium text-[#64748B]">2023</span>
//                   </div>
//                   <div className="flex-1 p-8">
//                     <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-2">
//                           <span className="rounded-md bg-[#0066FF] px-2 py-1 text-[10px] font-bold text-white uppercase">
//                             Upcoming Service
//                           </span>
//                           <span className="text-xs font-medium text-[#64748B]">Order #ORD-UPC-992</span>
//                         </div>
//                         <h3 className="text-2xl font-bold">Full Home Deep Clean</h3>
//                         <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B]">
//                           <div className="flex items-center gap-1.5">
//                             <Clock size={16} className="text-[#0066FF]" />
//                             <span>10:00 AM - 02:00 PM</span>
//                           </div>
//                           <span className="h-1 w-1 rounded-full bg-gray-300"></span>
//                           <span>Technician: Mike R.</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-3xl font-black text-[#0066FF]">$150.00</p>
//                         <p className="text-[10px] font-medium text-[#64748B]">Paid via Visa ending 4242</p>
//                       </div>
//                     </div>

//                     <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#0066FF]">
//                           <div className="h-1 w-1 rounded-full bg-white"></div>
//                         </div>
//                         <span className="text-sm font-bold text-[#0066FF]">Technician Assigned</span>
//                       </div>
//                       <div className="flex gap-4">
//                         <button className="text-sm font-bold text-[#64748B] hover:text-[#1A1C1E]">Reschedule</button>
//                         <button className="rounded-full bg-[#0066FF] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700">
//                           Track Arrival
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Completed Service */}
//               <OrderCard
//                 icon={
//                   <div className="rounded-md bg-blue-50 p-4">
//                     <Wrench className="text-[#0066FF]" />
//                   </div>
//                 }
//                 title="AC Repair & Service"
//                 subtitle="Professional deep cleaning and gas refill."
//                 orderId="#ORD-2839"
//                 date="Oct 24, 2023"
//                 price="$45.00"
//                 status="Service Completed"
//                 statusColor="text-[#10B981]"
//                 actions={[
//                   { label: "Invoice", type: "ghost" },
//                   { label: "Write Review", type: "outline" },
//                 ]}
//               />

//               {/* Product Purchase */}
//               <OrderCard
//                 icon={
//                   <div className="rounded-md bg-orange-50 p-4">
//                     <Thermometer className="text-orange-500" />
//                   </div>
//                 }
//                 title="Smart Thermostat (Gen 3)"
//                 subtitle="Product Purchase • Quantity: 1"
//                 orderId="#ORD-2810"
//                 date="Oct 10, 2023"
//                 price="$120.00"
//                 status="Delivered on Oct 12"
//                 statusColor="text-[#0066FF]"
//                 statusIcon={<Truck size={16} />}
//                 actions={[
//                   { label: "Buy Again", type: "ghost" },
//                   { label: "View Details", type: "outline" },
//                 ]}
//               />

//               {/* Cancelled Order */}
//               <OrderCard
//                 icon={
//                   <div className="rounded-md bg-gray-100 p-4">
//                     <Zap className="text-gray-400" />
//                   </div>
//                 }
//                 title="Annual Plumbing Checkup"
//                 subtitle="Routine maintenance check."
//                 orderId="#ORD-2755"
//                 date="Sep 15, 2023"
//                 price="$85.00"
//                 isCancelled
//                 status="Cancelled"
//                 statusColor="text-red-500"
//                 statusIcon={<XCircle size={16} />}
//                 actions={[{ label: "View Details", type: "ghost" }]}
//               />
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-center gap-2 pt-4">
//               <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 transition-colors hover:bg-gray-50">
//                 <ChevronLeft size={18} />
//               </button>
//               <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0066FF] text-sm font-bold text-white">
//                 1
//               </button>
//               <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-medium text-[#64748B] transition-colors hover:bg-gray-50">
//                 2
//               </button>
//               <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-medium text-[#64748B] transition-colors hover:bg-gray-50">
//                 3
//               </button>
//               <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 transition-colors hover:bg-gray-50">
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   )
// }

// // Helper Components
// function NavItem({
//   icon,
//   label,
//   isActive = false,
//   isDanger = false,
//   badge,
// }: { icon: React.ReactNode; label: string; isActive?: boolean; isDanger?: boolean; badge?: string }) {
//   return (
//     <a
//       href="#"
//       className={`flex items-center justify-between px-8 py-3.5 transition-colors ${
//         isActive
//           ? "border-l-4 border-[#0066FF] bg-[#F8FAFC] text-[#0066FF]"
//           : isDanger
//             ? "text-red-500 hover:bg-red-50"
//             : "text-[#64748B] hover:bg-gray-50 hover:text-[#1A1C1E]"
//       }`}
//     >
//       <div className="flex items-center gap-3">
//         <span className={isActive ? "text-[#0066FF]" : ""}>{icon}</span>
//         <span className="text-sm font-bold">{label}</span>
//       </div>
//       {badge && (
//         <span className="rounded-full bg-[#0066FF] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
//           {badge}
//         </span>
//       )}
//     </a>
//   )
// }

// function FilterTab({ label, isActive = false }: { label: string; isActive?: boolean }) {
//   return (
//     <button
//       className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
//         isActive ? "bg-[#1A1C1E] text-white shadow-lg" : "text-[#64748B] hover:text-[#1A1C1E]"
//       }`}
//     >
//       {label}
//     </button>
//   )
// }

// function StatCard({
//   icon,
//   value,
//   label,
//   bgColor,
// }: { icon: React.ReactNode; value: string; label: string; bgColor: string }) {
//   return (
//     <div className="flex items-center gap-4 rounded-md bg-white p-6 shadow-sm">
//       <div className={`flex h-12 w-12 items-center justify-center rounded-md ${bgColor}`}>{icon}</div>
//       <div>
//         <p className="text-xl font-black">{value}</p>
//         <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">{label}</p>
//       </div>
//     </div>
//   )
// }

// function OrderCard({
//   icon,
//   title,
//   subtitle,
//   orderId,
//   date,
//   price,
//   status,
//   statusColor,
//   statusIcon,
//   isCancelled = false,
//   actions,
// }: {
//   icon: React.ReactNode
//   title: string
//   subtitle: string
//   orderId: string
//   date: string
//   price: string
//   status: string
//   statusColor: string
//   statusIcon?: React.ReactNode
//   isCancelled?: boolean
//   actions: { label: string; type: "ghost" | "outline" | "solid" }[]
// }) {
//   return (
//     <div className="rounded-[32px] bg-white p-8 shadow-sm transition-all hover:shadow-md">
//       <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
//         <div className="flex h-full items-start">{icon}</div>
//         <div className="flex-1 space-y-4">
//           <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
//             <div>
//               <h3 className="text-xl font-bold">{title}</h3>
//               <p className="text-sm text-[#64748B]">{subtitle}</p>
//               <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
//                 <span>{orderId}</span>
//                 <span className="h-1 w-1 rounded-full bg-gray-300"></span>
//                 <span>{date}</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className={`text-2xl font-black ${isCancelled ? "text-gray-300 line-through" : ""}`}>{price}</p>
//             </div>
//           </div>

//           <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
//             <div className={`flex items-center gap-2 text-sm font-bold ${statusColor}`}>
//               {statusIcon || <CheckCircle2 size={16} />}
//               <span>{status}</span>
//             </div>
//             <div className="flex items-center gap-4">
//               {actions.map((action, i) => (
//                 <button
//                   key={i}
//                   className={`text-sm font-bold transition-all ${
//                     action.type === "outline"
//                       ? "rounded-full border border-gray-200 px-6 py-2.5 text-[#1A1C1E] hover:bg-gray-50"
//                       : action.type === "ghost"
//                         ? "text-[#64748B] hover:text-[#1A1C1E]"
//                         : "rounded-full bg-[#0066FF] px-6 py-2.5 text-white hover:bg-blue-700"
//                   }`}
//                 >
//                   {action.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// Product Page
// import { Search, ShoppingCart, User, ChevronDown, Star, Heart, ArrowRight, Menu } from "lucide-react"

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
//           {/* Logo */}
//           <div className="flex items-center gap-2 shrink-0">
//             <div className="w-8 h-8 bg-[#2563EB] rounded flex items-center justify-center">
//               <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
//                 <path d="M12,2L14.39,5.26C14.61,5.57 15,5.74 15.38,5.74H19.5V9.86C19.5,10.24 19.67,10.63 19.98,10.85L23.24,13.24L19.98,15.63C19.67,15.85 19.5,16.24 19.5,16.62V20.74H15.38C15,20.74 14.61,20.91 14.39,21.22L12,24.48L9.61,21.22C9.39,20.91 9,20.74 8.62,20.74H4.5V16.62C4.5,16.24 4.33,15.85 4.02,15.63L0.76,13.24L4.02,10.85C4.33,10.63 4.5,10.24 4.5,9.86V5.74H8.62C9,5.74 9.39,5.57 9.61,5.26L12,2M11,7V11H7V13H11V17H13V13H17V11H13V7H11Z" />
//               </svg>
//             </div>
//             <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden md:flex flex-1 max-w-xl relative">
//             <input
//               type="text"
//               placeholder="Search for ACs, services, or parts..."
//               className="w-full bg-[#F1F5F9] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
//             />
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           </div>

//           {/* Navigation & Icons */}
//           <div className="flex items-center gap-6">
//             <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
//               <a href="#" className="hover:text-blue-600">
//                 Services
//               </a>
//               <a href="#" className="text-blue-600">
//                 Products
//               </a>
//               <a href="#" className="hover:text-blue-600">
//                 Support
//               </a>
//             </nav>
//             <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
//             <div className="flex items-center gap-4">
//               <button className="relative p-2 hover:bg-slate-100 rounded-full">
//                 <ShoppingCart className="w-5 h-5 text-slate-600" />
//                 <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
//                   0
//                 </span>
//               </button>
//               <button className="p-2 hover:bg-slate-100 rounded-full">
//                 <User className="w-5 h-5 text-slate-600" />
//               </button>
//               <button className="md:hidden p-2">
//                 <Menu className="w-6 h-6" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         {/* Breadcrumbs */}
//         <nav className="text-xs text-slate-400 mb-6">
//           <span className="hover:text-slate-600 cursor-pointer">Home</span>
//           <span className="mx-2">/</span>
//           <span className="hover:text-slate-600 cursor-pointer">Products</span>
//           <span className="mx-2">/</span>
//           <span className="text-slate-900 font-medium">Air Conditioners</span>
//         </nav>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar Filters */}
//           <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
//             {/* Categories */}
//             <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
//                 <h3 className="font-bold text-sm">Categories</h3>
//               </div>
//               <ul className="space-y-3">
//                 {[
//                   { name: "Air Conditioners", count: 24, active: true },
//                   { name: "Refrigerators", count: 12 },
//                   { name: "Air Purifiers", count: 8 },
//                   { name: "Parts & Remotes", count: 45 },
//                 ].map((cat) => (
//                   <li
//                     key={cat.name}
//                     className={`flex items-center justify-between text-sm cursor-pointer ${cat.active ? "text-blue-600 font-semibold" : "text-slate-500 hover:text-slate-800"}`}
//                   >
//                     <span>{cat.name}</span>
//                     <span className="text-xs opacity-60">{cat.count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Price Range */}
//             <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
//               <h3 className="font-bold text-sm mb-4">Price Range</h3>
//               <div className="px-1 mb-6">
//                 <div className="h-1 bg-blue-100 rounded-full relative">
//                   <div className="absolute left-0 right-1/4 h-full bg-blue-600 rounded-full"></div>
//                   <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-pointer shadow-sm"></div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-[10px] text-slate-400 uppercase font-bold">Min</label>
//                   <div className="border border-slate-200 rounded-lg p-2 text-sm font-semibold">$0</div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] text-slate-400 uppercase font-bold">Max</label>
//                   <div className="border border-slate-200 rounded-lg p-2 text-sm font-semibold">$1200</div>
//                 </div>
//               </div>
//             </div>

//             {/* Brands */}
//             <div className="bg-white rounded-md border border-slate-100 p-5 shadow-sm">
//               <h3 className="font-bold text-sm mb-4">Brands</h3>
//               <div className="space-y-3">
//                 {["Samsung", "LG", "Daikin", "Voltas"].map((brand) => (
//                   <label key={brand} className="flex items-center gap-3 cursor-pointer group">
//                     <div
//                       className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${brand === "Samsung" ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"}`}
//                     >
//                       {brand === "Samsung" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
//                     </div>
//                     <span className="text-sm text-slate-600">{brand}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </aside>

//           {/* Main Content Area */}
//           <div className="flex-1">
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
//               <div>
//                 <h1 className="text-3xl font-bold mb-1">Air Conditioners</h1>
//                 <p className="text-sm text-slate-500">Showing 24 results for "Split AC"</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-slate-400">Sort by:</span>
//                 <button className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium">
//                   Recommended
//                   <ChevronDown className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Product Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {[
//                 {
//                   id: 1,
//                   badge: "In Stock",
//                   badgeColor: "bg-[#22C55E]",
//                   image: "/samsung-split-ac.jpg",
//                   title: "Samsung WindFree™ Spli...",
//                   desc: "1.5 Ton 5 Star, Inverter with Wi-Fi Connect, Antibacterial Filter.",
//                   rating: 4.8,
//                   price: 549.0,
//                   oldPrice: 699.0,
//                 },
//                 {
//                   id: 2,
//                   badge: "Best Seller",
//                   badgeColor: "bg-[#3B82F6]",
//                   image: "/lg-smart-ac.jpg",
//                   title: "LG Dual Inverter Smart AC",
//                   desc: "AI Convertible 6-in-1 Cooling, HD Filter with Anti-Virus Protection.",
//                   rating: 5.0,
//                   price: 720.0,
//                   oldPrice: 850.0,
//                 },
//                 {
//                   id: 3,
//                   image: "/voltas-window-ac.jpg",
//                   title: "Voltas Adjustable Window...",
//                   desc: "1.5 Ton 3 Star, High Ambient Cooling, Copper Condenser.",
//                   rating: 4.2,
//                   price: 399.0,
//                 },
//                 {
//                   id: 4,
//                   badge: "Sale -15%",
//                   badgeColor: "bg-[#F43F5E]",
//                   image: "/blue-star-portable-ac.jpg",
//                   title: "Blue Star Portable AC",
//                   desc: "1 Ton Portable AC, Silver Coating, Easy Mobility for small rooms.",
//                   rating: 3.8,
//                   price: 382.5,
//                   oldPrice: 450.0,
//                 },
//                 {
//                   id: 5,
//                   image: "/daikin-ac.jpg",
//                   title: "Daikin Standard Series",
//                   desc: "0.8 Ton 3 Star, Split AC, Copper Condenser, PM 2.5 Filter.",
//                   rating: 4.9,
//                   price: 320.0,
//                 },
//                 {
//                   id: 6,
//                   badge: "Service",
//                   badgeColor: "bg-[#A855F7]",
//                   image: "/ac-cleaning-service.jpg",
//                   title: "Premium AC Deep Clean",
//                   desc: "Complete indoor and outdoor unit cleaning with foam wash and gas...",
//                   rating: 4.9,
//                   price: 49.0,
//                   isService: true,
//                 },
//               ].map((product) => (
//                 <div
//                   key={product.id}
//                   className="group relative h-[450px] bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
//                 >
//                   <div className="absolute inset-0">
//                     <img
//                       src={product.image || "/placeholder.svg"}
//                       alt={product.title}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
//                   </div>

//                   {/* Badges & Actions */}
//                   <div className="relative h-full p-6 flex flex-col justify-between pointer-events-none">
//                     <div className="flex justify-between items-start pointer-events-auto">
//                       {product.badge && (
//                         <span
//                           className={`px-3 py-1.5 ${product.badgeColor} text-white text-[10px] font-bold rounded-full uppercase tracking-widest`}
//                         >
//                           {product.badge}
//                         </span>
//                       )}
//                       <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
//                         <Heart className="w-5 h-5" />
//                       </button>
//                     </div>

//                     <div className="pointer-events-auto">
//                       <div className="flex items-center gap-1 mb-2">
//                         {[1, 2, 3, 4, 5].map((s) => (
//                           <Star
//                             key={s}
//                             className={`w-3.5 h-3.5 ${s <= Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-white/30"}`}
//                           />
//                         ))}
//                         <span className="text-xs text-white/70 ml-1">({product.rating.toFixed(1)})</span>
//                       </div>

//                       <h3 className="font-bold text-xl text-white mb-2">{product.title}</h3>
//                       <p className="text-xs text-white/70 mb-6 line-clamp-2 leading-relaxed">{product.desc}</p>

//                       <div className="flex items-center justify-between">
//                         <div className="flex flex-col">
//                           {product.oldPrice && (
//                             <span className="text-xs text-white/40 line-through">${product.oldPrice.toFixed(2)}</span>
//                           )}
//                           <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
//                         </div>

//                         {product.isService ? (
//                           <button className="bg-white text-black text-xs font-bold px-6 py-3 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-lg">
//                             Book Now
//                           </button>
//                         ) : (
//                           <button className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
//                             <ShoppingCart className="w-6 h-6" />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Load More Button */}
//             <div className="flex justify-center mt-12 mb-8">
//               <button className="bg-white border border-slate-200 rounded-md px-12 py-3.5 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
//                 Load More Products
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
//             {/* Brand Section */}
//             <div className="space-y-6">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
//                   <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
//                     <path d="M12,2L14.39,5.26C14.61,5.57 15,5.74 15.38,5.74H19.5V9.86C19.5,10.24 19.67,10.63 19.98,10.85L23.24,13.24L19.98,15.63C19.67,15.85 19.5,16.24 19.5,16.62V20.74H15.38C15,20.74 14.61,20.91 14.39,21.22L12,24.48L9.61,21.22C9.39,20.91 9,20.74 8.62,20.74H4.5V16.62C4.5,16.24 4.33,15.85 4.02,15.63L0.76,13.24L4.02,10.85C4.33,10.63 4.5,10.24 4.5,9.86V5.74H8.62C9,5.74 9.39,5.57 9.61,5.26L12,2M11,7V11H7V13H11V17H13V13H17V11H13V7H11Z" />
//                   </svg>
//                 </div>
//                 <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//               </div>
//               <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
//                 Your trusted partner for home cooling solutions. Premium products and expert services at your doorstep.
//               </p>
//             </div>

//             {/* Shop Links */}
//             <div>
//               <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Shop</h4>
//               <ul className="space-y-3 text-sm text-slate-500">
//                 <li className="hover:text-blue-600 cursor-pointer">Air Conditioners</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Refrigerators</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Air Purifiers</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Parts</li>
//               </ul>
//             </div>

//             {/* Support Links */}
//             <div>
//               <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Support</h4>
//               <ul className="space-y-3 text-sm text-slate-500">
//                 <li className="hover:text-blue-600 cursor-pointer">Book Service</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Track Order</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Warranty Policy</li>
//               </ul>
//             </div>

//             {/* Newsletter */}
//             <div>
//               <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Stay Connected</h4>
//               <div className="relative group">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="w-full bg-slate-50 border border-slate-100 rounded-md py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                 />
//                 <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
//             <p>© 2026 Metro Cool Inc. All rights reserved.</p>
//             <div className="flex items-center gap-6">
//               <a href="#" className="hover:text-slate-600">
//                 Privacy Policy
//               </a>
//               <a href="#" className="hover:text-slate-600">
//                 Terms of Service
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// Profile Page
// import {
//   User,
//   ShoppingBag,
//   MapPin,
//   CreditCard,
//   Settings,
//   LogOut,
//   Camera,
//   Mail,
//   Phone,
//   Lock,
//   EyeOff,
//   Info,
//   UserCircle,
// } from "lucide-react"
// import Image from "next/image"

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
//       {/* Header */}
//       <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-4 md:px-12">
//         <div className="flex items-center gap-2">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0081FF]">
//             <div className="h-6 w-6 bg-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%,50%_50%)]"></div>
//           </div>
//           <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//         </div>

//         <nav className="hidden items-center gap-8 md:flex">
//           <a href="#" className="text-sm font-medium text-[#64748B] hover:text-[#0081FF]">
//             Services
//           </a>
//           <a href="#" className="text-sm font-medium text-[#64748B] hover:text-[#0081FF]">
//             Products
//           </a>
//           <a href="#" className="text-sm font-medium text-[#64748B] hover:text-[#0081FF]">
//             Book Now
//           </a>
//         </nav>

//         <div className="flex items-center gap-4">
//           <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#E2E8F0]">
//             <Image src="/diverse-user-avatars.png" alt="User" fill className="object-cover" />
//           </div>
//           <button className="rounded-lg bg-[#EBF5FF] px-4 py-2 text-sm font-semibold text-[#0081FF] transition-colors hover:bg-[#D1E9FF]">
//             Sign Out
//           </button>
//         </div>
//       </header>

//       <main className="mx-auto flex max-w-[1440px] flex-col gap-8 p-4 md:flex-row md:p-8 lg:p-12">
//         {/* Sidebar */}
//         <aside className="w-full shrink-0 md:w-[320px]">
//           <div className="overflow-hidden rounded-md border border-[#E2E8F0] bg-white shadow-sm">
//             {/* User Profile Summary */}
//             <div className="flex items-center gap-4 border-b border-[#E2E8F0] p-6">
//               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9] p-1 ring-1 ring-[#E2E8F0]">
//                 <div className="relative h-full w-full overflow-hidden rounded-full bg-[#E2E8F0]">
//                   <Image src="/alex-johnson-profile.jpg" alt="Alex Johnson" fill className="object-cover" />
//                 </div>
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold leading-tight">Alex Johnson</h2>
//                 <span className="text-[10px] font-bold uppercase tracking-wider text-[#0081FF]">Gold Member</span>
//               </div>
//             </div>

//             {/* Sidebar Nav */}
//             <nav className="p-4">
//               <ul className="space-y-1">
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center gap-3 rounded-md bg-[#F0F7FF] px-4 py-3 text-sm font-semibold text-[#0081FF]"
//                   >
//                     <User className="h-5 w-5" />
//                     Profile Information
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B]"
//                   >
//                     <ShoppingBag className="h-5 w-5" />
//                     My Orders
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B]"
//                   >
//                     <MapPin className="h-5 w-5" />
//                     Saved Addresses
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B]"
//                   >
//                     <CreditCard className="h-5 w-5" />
//                     Payment Methods
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B]"
//                   >
//                     <Settings className="h-5 w-5" />
//                     Settings
//                   </a>
//                 </li>
//               </ul>
//             </nav>

//             {/* Logout Footer */}
//             <div className="border-t border-[#E2E8F0] p-4">
//               <button className="flex w-full items-center justify-center gap-2 rounded-md py-4 text-sm font-semibold text-[#1E293B] hover:bg-[#F8FAFC]">
//                 <LogOut className="h-5 w-5" />
//                 Log Out
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content Area */}
//         <section className="flex-1 space-y-8">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Profile Information</h1>
//             <p className="mt-2 text-[#64748B]">Update your personal details and manage your account security.</p>
//           </div>

//           {/* Personal Details Card */}
//           <div className="rounded-md border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-6 py-4">
//               <UserCircle className="h-5 w-5 text-[#0081FF]" />
//               <h2 className="text-base font-bold">Personal Details</h2>
//             </div>

//             <div className="p-8">
//               {/* Profile Photo Section */}
//               <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row">
//                 <div className="relative">
//                   <div className="h-28 w-28 rounded-full bg-[#F1F5F9] p-1 ring-1 ring-[#E2E8F0]">
//                     <div className="relative h-full w-full overflow-hidden rounded-full bg-[#E2E8F0]">
//                       <Image src="/professional-headshot.png" alt="Profile Photo" fill className="object-cover" />
//                     </div>
//                   </div>
//                   <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#0081FF] text-white ring-4 ring-white transition-transform hover:scale-110">
//                     <Camera className="h-4 w-4" />
//                   </button>
//                 </div>

//                 <div className="max-w-xs text-center sm:text-left">
//                   <h3 className="font-bold">Profile Photo</h3>
//                   <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
//                     Upload a new avatar. Larger images will be resized automatically. Maximum upload size is 1 MB.
//                   </p>
//                   <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
//                     <button className="rounded-lg bg-[#0F172A] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-black">
//                       Change Photo
//                     </button>
//                     <button className="rounded-lg border border-[#E2E8F0] px-5 py-2 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-[#F8FAFC]">
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Details Form */}
//               <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label htmlFor="first-name" className="text-sm font-bold">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     id="first-name"
//                     defaultValue="Alex"
//                     className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="last-name" className="text-sm font-bold">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     id="last-name"
//                     defaultValue="Johnson"
//                     className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="email" className="text-sm font-bold">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
//                     <input
//                       type="email"
//                       id="email"
//                       defaultValue="alex.johnson@example.com"
//                       className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="phone" className="text-sm font-bold">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
//                     <input
//                       type="tel"
//                       id="phone"
//                       defaultValue="+1 (555) 012-3456"
//                       className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Password & Security Card */}
//           <div className="rounded-md border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
//             <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-6 py-4">
//               <Lock className="h-5 w-5 text-[#0081FF]" />
//               <h2 className="text-base font-bold">Password & Security</h2>
//             </div>

//             <div className="p-8">
//               <div className="grid gap-6">
//                 <div className="space-y-2">
//                   <label htmlFor="current-password" className="text-sm font-bold">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="password"
//                       id="current-password"
//                       defaultValue="password12345"
//                       className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                     />
//                     <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
//                       <EyeOff className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <label htmlFor="new-password" className="text-sm font-bold">
//                       New Password
//                     </label>
//                     <input
//                       type="password"
//                       id="new-password"
//                       placeholder="Minimum 8 characters"
//                       className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="confirm-password" className="text-sm font-bold">
//                       Confirm New Password
//                     </label>
//                     <input
//                       type="password"
//                       id="confirm-password"
//                       placeholder="Re-enter new password"
//                       className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm outline-none ring-[#0081FF]/20 focus:border-[#0081FF] focus:ring-4"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 rounded-md bg-[#F0F7FF] p-4 text-[#0081FF]">
//                   <Info className="h-5 w-5 shrink-0" />
//                   <p className="text-sm font-medium">
//                     Make sure your password is strong. We recommend using a mix of letters, numbers, and symbols.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Actions Footer */}
//             <div className="flex justify-end gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 px-8 py-6">
//               <button className="rounded-lg border border-[#E2E8F0] bg-white px-8 py-2.5 text-sm font-bold text-[#1E293B] transition-colors hover:bg-[#F1F5F9]">
//                 Cancel
//               </button>
//               <button className="rounded-lg bg-[#0081FF] px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-[0_4px_14px_0_rgba(0,129,255,0.39)]">
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// Saved Address
// import type React from "react"
// import {
//   User,
//   Package,
//   MapPin,
//   CreditCard,
//   Settings,
//   LogOut,
//   Plus,
//   Home,
//   Briefcase,
//   Phone,
//   Trash2,
//   Edit3,
// } from "lucide-react"

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
//       {/* Navigation Header */}
//       <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-4 md:px-8">
//         <div className="flex items-center gap-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#007AFF]">
//             <div className="h-4 w-2 bg-white/40 transform -skew-x-12 translate-x-1"></div>
//             <div className="h-4 w-2 bg-white transform -skew-x-12 -translate-x-1"></div>
//           </div>
//           <span className="text-xl font-bold tracking-tight text-[#0F172A]">Metro Cool</span>
//         </div>

//         <nav className="hidden items-center gap-8 md:flex">
//           <a href="#" className="text-sm font-medium text-[#64748B] hover:text-[#007AFF] transition-colors">
//             Services
//           </a>
//           <a href="#" className="text-sm font-medium text-[#64748B] hover:text-[#007AFF] transition-colors">
//             Products
//           </a>
//           <a href="#" className="text-sm font-medium text-[#64748B] hover:text-[#007AFF] transition-colors">
//             Book Now
//           </a>
//         </nav>

//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 overflow-hidden rounded-full border border-[#E2E8F0]">
//             <img src="/male-user-profile.jpg" alt="User" className="h-full w-full object-cover" />
//           </div>
//           <button className="rounded-md border border-[#007AFF] px-4 py-1.5 text-sm font-semibold text-[#007AFF] hover:bg-[#007AFF] hover:text-white transition-all">
//             Sign Out
//           </button>
//         </div>
//       </header>

//       <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:flex-row md:gap-8 md:p-8">
//         {/* Sidebar */}
//         <aside className="w-full shrink-0 md:w-64">
//           <div className="flex flex-col gap-4">
//             {/* Profile Card */}
//             <div className="rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9]">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2E8F0]">
//                     <User className="h-4 w-4 text-[#94A3B8]" />
//                   </div>
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-[#0F172A]">Alex Johnson</h2>
//                   <p className="text-[10px] font-bold tracking-wider text-[#007AFF]">GOLD MEMBER</p>
//                 </div>
//               </div>
//             </div>

//             {/* Side Navigation */}
//             <div className="rounded-md border border-[#E2E8F0] bg-white py-2 shadow-sm">
//               <NavItem icon={<User className="h-4 w-4" />} label="Profile Information" />
//               <NavItem icon={<Package className="h-4 w-4" />} label="My Orders" />
//               <NavItem icon={<MapPin className="h-4 w-4" />} label="Saved Addresses" active />
//               <NavItem icon={<CreditCard className="h-4 w-4" />} label="Payment Methods" />
//               <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />

//               <div className="mx-4 my-2 border-t border-[#F1F5F9]"></div>

//               <button className="flex w-full items-center gap-3 px-6 py-3 text-sm font-medium text-[#64748B] hover:text-[#EF4444] transition-colors group">
//                 <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 <span>Log Out</span>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Content Area */}
//         <section className="flex-1">
//           <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-[#0F172A]">Saved Addresses</h1>
//               <p className="mt-1 text-sm text-[#64748B]">
//                 Manage your addresses for faster service bookings and deliveries.
//               </p>
//             </div>
//             <button className="flex items-center gap-2 rounded-lg bg-[#007AFF] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#0062CC] hover:scale-[1.02]">
//               <Plus className="h-5 w-5" />
//               <span>Add New Address</span>
//             </button>
//           </div>

//           {/* Addresses Grid */}
//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {/* Default Address: Home */}
//             <div className="relative overflow-hidden rounded-md border-2 border-[#007AFF] bg-white p-6 shadow-sm">
//               <div className="absolute top-0 right-0 bg-[#007AFF] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
//                 Default Address
//               </div>

//               <div className="mb-4 flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EBF5FF]">
//                   <Home className="h-5 w-5 text-[#007AFF]" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-[#0F172A]">Home</h3>
//                   <p className="text-sm text-[#94A3B8]">Alex Johnson</p>
//                 </div>
//               </div>

//               <div className="mb-6 space-y-1 text-sm leading-relaxed text-[#64748B]">
//                 <p>1284 Cool Breeze Lane,</p>
//                 <p>Building B, Apt 402</p>
//                 <p>Metro City, HVAC 90210</p>
//                 <div className="mt-3 flex items-center gap-2 text-[#475569]">
//                   <Phone className="h-3.5 w-3.5" />
//                   <span>(555) 123-4567</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 pt-4 border-t border-[#F1F5F9]">
//                 <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
//                   <Edit3 className="h-4 w-4" />
//                   Edit
//                 </button>
//                 <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:border-[#FCA5A5] hover:text-[#EF4444] transition-colors">
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Address: Work Office */}
//             <div className="rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm hover:border-[#CBD5E1] transition-colors">
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
//                   <Briefcase className="h-5 w-5 text-[#64748B]" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-[#0F172A]">Work Office</h3>
//                   <p className="text-sm text-[#94A3B8]">Alex Johnson</p>
//                 </div>
//               </div>

//               <div className="mb-6 space-y-1 text-sm leading-relaxed text-[#64748B]">
//                 <p>4500 Business Park Blvd,</p>
//                 <p>Suite 200, Tech Hub</p>
//                 <p>Metro City, HVAC 90214</p>
//                 <div className="mt-3 flex items-center gap-2 text-[#475569]">
//                   <Phone className="h-3.5 w-3.5" />
//                   <span>(555) 987-6543</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 pt-4 border-t border-[#F1F5F9]">
//                 <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
//                   <Edit3 className="h-4 w-4" />
//                   Edit
//                 </button>
//                 <button className="flex-1 text-sm font-semibold text-[#64748B] hover:text-[#007AFF] transition-colors">
//                   Set as Default
//                 </button>
//                 <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:border-[#FCA5A5] hover:text-[#EF4444] transition-colors">
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Address: Parents' Home */}
//             <div className="rounded-md border border-[#E2E8F0] bg-white p-6 shadow-sm">
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]">
//                   <Home className="h-5 w-5 text-[#64748B]" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-[#0F172A]">Parents' Home</h3>
//                   <p className="text-sm text-[#94A3B8]">Martha Johnson</p>
//                 </div>
//               </div>

//               <div className="mb-6 space-y-1 text-sm leading-relaxed text-[#64748B]">
//                 <p>78 Maple Street,</p>
//                 <p>Suburban District</p>
//                 <p>Metro City, HVAC 90220</p>
//                 <div className="mt-3 flex items-center gap-2 text-[#475569]">
//                   <Phone className="h-3.5 w-3.5" />
//                   <span>(555) 555-0199</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 pt-4 border-t border-[#F1F5F9]">
//                 <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors">
//                   <Edit3 className="h-4 w-4" />
//                   Edit
//                 </button>
//                 <button className="flex-1 text-sm font-semibold text-[#64748B] hover:text-[#007AFF] transition-colors">
//                   Set as Default
//                 </button>
//                 <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:border-[#FCA5A5] hover:text-[#EF4444] transition-colors">
//                   <Trash2 className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Empty State: Add New Address */}
//             <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-[#CBD5E1] bg-[#F1F5F9]/30 p-8 text-center transition-colors hover:bg-[#F1F5F9]/50 cursor-pointer group">
//               <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-8 ring-[#F1F5F9]/50 group-hover:scale-110 transition-transform">
//                 <div className="relative">
//                   <MapPin className="h-7 w-7 text-[#94A3B8]" />
//                   <Plus className="absolute -top-1 -right-1 h-3.5 w-3.5 text-[#007AFF] stroke-[3]" />
//                 </div>
//               </div>
//               <h3 className="text-lg font-bold text-[#475569]">Add New Address</h3>
//               <p className="mt-2 text-sm text-[#94A3B8] max-w-[200px]">
//                 Save a new location for easier bookings and product deliveries.
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
//   return (
//     <button
//       className={`flex w-full items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
//         active
//           ? "bg-[#EBF5FF] text-[#007AFF] border-r-2 border-[#007AFF]"
//           : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
//       }`}
//     >
//       <span className={active ? "text-[#007AFF]" : "text-[#94A3B8]"}>{icon}</span>
//       <span>{label}</span>
//     </button>
//   )
// }

// Main About Page
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Play,
//   ShieldCheck,
//   Zap,
//   DollarSign,
//   ArrowRight,
//   Phone,
//   Mail,
//   MapPin,
//   Facebook,
//   Twitter,
//   Instagram,
//   Home,
//   Briefcase,
//   Headset,
//   Award,
// } from "lucide-react";

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900">
//       {/* Navbar */}
//       <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] text-white">
//               <span className="text-xl font-bold italic">M</span>
//             </div>
//             <span className="text-xl font-bold tracking-tight">Metro Cool</span>
//           </div>

//           <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
//             <Link href="#" className="hover:text-[#007AFF] transition-colors">
//               Home
//             </Link>
//             <Link href="#" className="text-[#007AFF]">
//               About Us
//             </Link>
//             <Link href="#" className="hover:text-[#007AFF] transition-colors">
//               Services
//             </Link>
//             <Link href="#" className="hover:text-[#007AFF] transition-colors">
//               Contact
//             </Link>
//           </div>

//           <Link
//             href="#"
//             className="rounded-lg bg-[#007AFF] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0062CC] active:scale-95"
//           >
//             Book a Service
//           </Link>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden">
//         {/* Background Image Container */}
//         <div className="absolute inset-0 z-0 h-full w-full">
//           <Image
//             src="/hvac-technician-working-on-modern-ac-unit-professi.jpg"
//             alt="Hero Background"
//             fill
//             className="object-cover opacity-20"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
//         </div>

//         <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
//           <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#007AFF] border border-blue-100">
//             <span className="h-2 w-2 rounded-full bg-[#007AFF] animate-pulse" />
//             SINCE 2010
//           </div>

//           <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
//             Redefining Comfort for{" "}
//             <span className="text-[#007AFF]">Modern Living</span>
//           </h1>

//           <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl">
//             Metro Cool isn't just about fixing ACs. We're on a mission to
//             engineer perfect climates for homes and businesses, combining
//             cutting-edge efficiency with old-school reliability.
//           </p>

//           <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//             <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#007AFF] px-8 py-4 text-lg font-bold text-white transition-all hover:bg-[#0062CC] sm:w-auto">
//               View Our Story
//               <Play fill="currentColor" size={16} />
//             </button>
//             <button className="w-full rounded-md border-2 border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50 sm:w-auto">
//               Meet the Team
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Stats Bar */}
//       <section className="relative z-20 mx-auto -mt-16 max-w-7xl px-4 md:px-6 lg:px-8">
//         <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-slate-200 shadow-xl md:grid-cols-4">
//           {[
//             { label: "HOMES SERVICED", value: "10k+" },
//             { label: "CERTIFIED TECHS", value: "50+" },
//             { label: "YEARS EXPERIENCE", value: "15+" },
//             { label: "EMERGENCY SUPPORT", value: "24/7" },
//           ].map((stat, i) => (
//             <div
//               key={i}
//               className="flex flex-col items-center justify-center bg-white p-8 text-center transition-colors hover:bg-blue-50/50"
//             >
//               <span className="mb-2 text-3xl font-black text-slate-900 md:text-4xl">
//                 {stat.value}
//               </span>
//               <span className="text-[10px] font-bold tracking-widest text-slate-400">
//                 {stat.label}
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* History / Timeline Section */}
//       <section className="mx-auto max-w-7xl px-4 py-32 md:px-6 lg:px-8">
//         <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
//           {/* Left Column */}
//           <div>
//             <h2 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
//               From a Garage to a<br />
//               <span className="text-[#007AFF]">City Icon</span>
//             </h2>
//             <p className="mb-8 text-lg leading-relaxed text-slate-500">
//               It started with a simple belief: nobody should sweat the small
//               stuff—especially not in their own living room. What began as a
//               two-person operation in a suburban garage has grown into the
//               city's most trusted name in climate control.
//             </p>

//             <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-md shadow-2xl">
//               <Image
//                 src="/professional-hvac-technician-installing-copper-pip.jpg"
//                 alt="HVAC Installation"
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-105"
//               />
//               <div className="absolute inset-x-4 bottom-4 rounded-md bg-white/95 p-6 backdrop-blur-md shadow-lg">
//                 <p className="text-sm italic text-slate-600">
//                   "We don't just fix ACs, we restore comfort."
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Timeline */}
//           <div className="relative pl-8">
//             <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-100" />

//             <div className="space-y-12">
//               {[
//                 {
//                   year: "2010",
//                   title: "Founded in a Garage",
//                   desc: "Metro Cool is born. Just two techs, one van, and a lot of determination to do things right.",
//                   icon: Home,
//                 },
//                 {
//                   year: "2014",
//                   title: "First Fleet Expansion",
//                   desc: "Demand skyrocketed. We purchased 5 new vans and hired our first dedicated support team.",
//                   icon: Briefcase,
//                 },
//                 {
//                   year: "2018",
//                   title: "City-Wide Coverage",
//                   desc: "Officially covering the entire metro area with guaranteed 2-hour emergency response times.",
//                   icon: Headset,
//                 },
//                 {
//                   year: "2023",
//                   title: "Green Tech Award",
//                   desc: "Recognized for our commitment to installing energy-efficient systems that save money and the planet.",
//                   icon: Award,
//                 },
//               ].map((item, i) => (
//                 <div key={i} className="relative">
//                   <div className="absolute -left-[24px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-50 text-[#007AFF] shadow-sm">
//                     <item.icon size={16} />
//                   </div>
//                   <div className="rounded-md border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
//                     <div className="mb-2 flex items-center justify-between">
//                       <h3 className="text-lg font-bold text-slate-900">
//                         {item.title}
//                       </h3>
//                       <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-[#007AFF]">
//                         {item.year}
//                       </span>
//                     </div>
//                     <p className="text-sm text-slate-500 leading-relaxed">
//                       {item.desc}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Why Us Section */}
//       <section className="bg-slate-50/50 py-32">
//         <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
//           <div className="mb-20 text-center">
//             <h2 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
//               Why MetroCool?
//             </h2>
//             <p className="mx-auto max-w-2xl text-lg text-slate-500">
//               We don't just promise cool air; we promise peace of mind. Here is
//               what sets our service apart from the competition.
//             </p>
//           </div>

//           <div className="grid gap-8 md:grid-cols-3">
//             {[
//               {
//                 title: "Certified Expertise",
//                 desc: "Every technician on our team is NATE-certified and undergoes 100+ hours of annual training on the latest HVAC systems.",
//                 icon: ShieldCheck,
//                 color: "bg-blue-600",
//               },
//               {
//                 title: "Rapid Response",
//                 desc: "Heatwaves don't wait, and neither should you. We offer guaranteed same-day service for emergency breakdowns.",
//                 icon: Zap,
//                 color: "bg-blue-400",
//               },
//               {
//                 title: "Transparent Pricing",
//                 desc: "No hidden fees, no surprise upcharges. We provide a full quote before we pick up a wrench, so you know exactly what to expect.",
//                 icon: DollarSign,
//                 color: "bg-blue-500",
//               },
//             ].map((feature, i) => (
//               <div
//                 key={i}
//                 className="group rounded-md border border-slate-100 bg-white p-10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
//               >
//                 <div
//                   className={`mb-8 flex h-14 w-14 items-center justify-center rounded-md ${feature.color} text-white shadow-lg`}
//                 >
//                   <feature.icon size={28} />
//                 </div>
//                 <h3 className="mb-4 text-xl font-extrabold text-slate-900">
//                   {feature.title}
//                 </h3>
//                 <p className="text-sm leading-relaxed text-slate-500">
//                   {feature.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="mx-auto max-w-7xl px-4 py-32 md:px-6 lg:px-8">
//         <div className="mb-12 flex items-end justify-between">
//           <div>
//             <h2 className="mb-2 text-4xl font-extrabold text-slate-900">
//               Meet the Experts
//             </h2>
//             <p className="text-lg text-slate-500">
//               The people behind the perfect temperature.
//             </p>
//           </div>
//           <Link
//             href="#"
//             className="flex items-center gap-1 text-sm font-bold text-[#007AFF] hover:underline"
//           >
//             Join our team <ArrowRight size={16} />
//           </Link>
//         </div>

//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {[
//             {
//               name: "Sarah Jenkins",
//               role: "Operations Manager",
//               img: "professional business woman portrait office setting",
//             },
//             {
//               name: "David Chen",
//               role: "Lead Technician",
//               img: "HVAC technician man portrait professional uniform",
//             },
//             {
//               name: "Marcus Johnson",
//               role: "Installation Specialist",
//               img: "skilled technician man with glasses portrait",
//             },
//             {
//               name: "Elena Rodriguez",
//               role: "Customer Success",
//               img: "friendly customer support woman portrait",
//             },
//           ].map((member, i) => (
//             <div
//               key={i}
//               className="group relative aspect-[3/4] overflow-hidden rounded-md shadow-lg"
//             >
//               <Image
//                 // src={`/.jpg?height=800&width=600&query=${member.img}`}
//                 src="/sgdhd.jgp"
//                 alt={member.name}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
//               <div className="absolute inset-x-0 bottom-0 p-6 text-white">
//                 <h3 className="text-xl font-bold">{member.name}</h3>
//                 <p className="text-xs font-medium text-slate-300 uppercase tracking-widest">
//                   {member.role}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="mx-auto max-w-7xl px-4 pb-32 md:px-6 lg:px-8">
//         <div className="relative overflow-hidden rounded-lg bg-[#007AFF] px-8 py-20 text-center text-white shadow-2xl md:px-16">
//           {/* Subtle pattern background */}
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
//               backgroundSize: "24px 24px",
//             }}
//           />

//           <div className="relative z-10 mx-auto max-w-2xl">
//             <h2 className="mb-6 text-4xl font-black md:text-5xl">
//               Ready to Feel the Difference?
//             </h2>
//             <p className="mb-10 text-lg text-blue-100 opacity-90">
//               Don't let the weather dictate your comfort. Schedule your service
//               with Metro Cool today and experience HVAC done right.
//             </p>
//             <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//               <button className="w-full rounded-md bg-white px-8 py-4 text-lg font-bold text-[#007AFF] shadow-lg transition-all hover:scale-105 sm:w-auto">
//                 Book a Service Now
//               </button>
//               <button className="w-full rounded-md border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto">
//                 Contact Support
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-slate-50 py-20 border-t border-slate-100">
//         <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
//           <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
//             {/* Brand Col */}
//             <div>
//               <div className="mb-6 flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] text-white">
//                   <span className="text-xl font-bold italic">M</span>
//                 </div>
//                 <span className="text-xl font-bold tracking-tight">
//                   Metro Cool
//                 </span>
//               </div>
//               <p className="mb-8 text-sm leading-relaxed text-slate-500">
//                 Providing top-tier HVAC solutions for residential and commercial
//                 properties since 2010.
//               </p>
//               <div className="flex gap-4">
//                 {[Facebook, Twitter, Instagram].map((Icon, i) => (
//                   <Link
//                     key={i}
//                     href="#"
//                     className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-colors hover:bg-[#007AFF] hover:text-white"
//                   >
//                     <Icon size={14} />
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Links Col 1 */}
//             <div>
//               <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
//                 Company
//               </h4>
//               <ul className="space-y-4 text-sm text-slate-500">
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     About Us
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     Our Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     Privacy Policy
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Links Col 2 */}
//             <div>
//               <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
//                 Services
//               </h4>
//               <ul className="space-y-4 text-sm text-slate-500">
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     AC Installation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     Maintenance
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     Emergency Repair
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-[#007AFF]">
//                     Commercial HVAC
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Contact Col */}
//             <div>
//               <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
//                 Contact
//               </h4>
//               <ul className="space-y-4 text-sm text-slate-500">
//                 <li className="flex items-start gap-3">
//                   <MapPin size={18} className="text-[#007AFF] shrink-0" />
//                   <span>
//                     123 Cooling Blvd, Suite 100
//                     <br />
//                     Metro City, ST 90210
//                   </span>
//                 </li>
//                 <li className="flex items-center gap-3">
//                   <Phone size={18} className="text-[#007AFF] shrink-0" />
//                   <span>(555) 123-4567</span>
//                 </li>
//                 <li className="flex items-center gap-3">
//                   <Mail size={18} className="text-[#007AFF] shrink-0" />
//                   <span>support@metrocool.com</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="mt-20 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
//             <p>© 2023 Metro Cool Inc. All rights reserved.</p>
//             <p>Designed for comfort.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// Booking Status Tracking 
// import { Bell, MapPin, Phone, MessageSquare, ShieldCheck, Clock, CheckCircle2, Navigation2, Info } from "lucide-react"
// import Image from "next/image"

// export default function HomeServicePage() {
//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
//       {/* Navigation Header */}
//       <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20">
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 bg-[#007AFF] rounded-xl flex items-center justify-center">
//                 <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin-slow" />
//               </div>
//               <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
//                 Metro<span className="text-[#007AFF]">Cool</span>
//               </span>
//             </div>

//             <nav className="hidden md:flex items-center gap-8">
//               <a href="#" className="text-slate-500 hover:text-[#007AFF] font-medium transition-colors">
//                 Home
//               </a>
//               <div className="bg-[#F1F5F9] px-6 py-2 rounded-full">
//                 <a href="#" className="text-[#007AFF] font-semibold">
//                   My Bookings
//                 </a>
//               </div>
//               <a href="#" className="text-slate-500 hover:text-[#007AFF] font-medium transition-colors">
//                 Support
//               </a>
//             </nav>

//             <div className="flex items-center gap-4">
//               <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
//                 <Bell className="w-6 h-6" />
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
//               </button>
//               <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
//                 <div className="text-right hidden sm:block">
//                   <p className="text-sm font-bold text-[#0F172A]">Alex Morgan</p>
//                   <p className="text-xs text-slate-400 font-medium">Premium Member</p>
//                 </div>
//                 <div className="w-10 h-10 rounded-full bg-[#FFE4D6] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
//                   <Image src="/abstract-profile.png" alt="Profile" width={40} height={40} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         {/* Status Banner */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD]">
//                 <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] mr-2 animate-pulse" />
//                 In Progress
//               </span>
//               <span className="text-sm text-slate-400 font-medium tracking-wide">Order ID: #MC-8293</span>
//             </div>
//             <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">Technician is arriving soon</h1>
//             <p className="text-lg text-slate-500">Your AC expert is currently en route to your location.</p>
//           </div>

//           <div className="bg-white p-2 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center gap-2">
//             <div className="bg-[#F8FAFC] px-6 py-4 rounded-lg border border-slate-100">
//               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Estimated Arrival</p>
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl font-black text-[#0F172A]">10:45 AM</span>
//                 <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[10px] font-bold rounded-md uppercase">
//                   On Time
//                 </span>
//               </div>
//             </div>
//             <div className="flex gap-2 pr-2">
//               <button className="px-5 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all">
//                 Help
//               </button>
//               <button className="px-5 py-4 text-[#EF4444] font-bold hover:bg-red-50 rounded-xl transition-all border border-red-100">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column: Map & Timeline */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Live Tracking Map Card */}
//             <div className="relative h-[480px] rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/10 border border-white bg-slate-100">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12093.31065438865!2d-74.0538059!3d40.7281575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250d2aaaaaaab%3A0x13781c1374974340!2sJersey%20City%2C%20NJ!5e0!3m2!1sen!2sus!4v1704384000000!5m2!1sen!2sus&hl=en&style=feature:all|element:labels|visibility:on"
//                 width="100%"
//                 height="100%"
//                 style={{ border: 0, filter: "grayscale(20%) contrast(1.1) brightness(1.05)" }}
//                 allowFullScreen
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//                 className="absolute inset-0 grayscale-[20%]"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

//               {/* Map Floating UI */}
//               <div className="absolute top-6 right-6">
//                 <button className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-white flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-white transition-all">
//                   <Navigation2 className="w-4 h-4 text-[#007AFF] fill-[#007AFF]" />
//                   Live Tracking
//                 </button>
//               </div>

//               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
//                 <div className="bg-white/95 backdrop-blur-xl p-5 rounded-lg shadow-2xl border border-white/50 flex items-center divide-x divide-slate-100">
//                   <div className="flex items-center gap-4 flex-1 pr-6">
//                     <div className="w-12 h-12 bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
//                       <Navigation2 className="w-6 h-6 text-white fill-white -rotate-45" />
//                     </div>
//                     <div>
//                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">
//                         Current Location
//                       </p>
//                       <p className="text-sm font-black text-[#0F172A]">
//                         2.4 km away <span className="text-slate-300 mx-1">•</span> 15 mins
//                       </p>
//                     </div>
//                   </div>
//                   <div className="pl-6">
//                     <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
//                       Traffic Status
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
//                       <span className="text-sm font-bold text-[#166534]">Clear Route</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Service Timeline */}
//             <div className="bg-white p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50">
//               <div className="flex justify-between items-center mb-10">
//                 <h2 className="text-2xl font-black text-[#0F172A]">Service Timeline</h2>
//                 <button className="text-[#007AFF] font-bold text-sm hover:underline">View Details</button>
//               </div>

//               <div className="space-y-12 relative">
//                 {/* Connector Line */}
//                 <div className="absolute left-[20px] top-2 bottom-2 w-0.5 bg-[#F1F5F9]" />
//                 <div className="absolute left-[20px] top-2 h-[50%] w-0.5 bg-gradient-to-b from-[#007AFF] to-[#007AFF]/30" />

//                 {/* Step 1 */}
//                 <div className="flex gap-6 relative group">
//                   <div className="z-10 w-10 h-10 rounded-xl bg-[#E0F2FE] border-2 border-white shadow-sm flex items-center justify-center text-[#007AFF] group-hover:scale-110 transition-transform">
//                     <CheckCircle2 className="w-5 h-5 fill-[#007AFF] text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start mb-1">
//                       <h3 className="font-bold text-[#0F172A] text-lg">Booking Confirmed</h3>
//                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">09:00 AM</span>
//                     </div>
//                     <p className="text-slate-500 text-sm leading-relaxed">
//                       We received your request for AC Deep Clean.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Step 2 */}
//                 <div className="flex gap-6 relative group">
//                   <div className="z-10 w-10 h-10 rounded-xl bg-[#E0F2FE] border-2 border-white shadow-sm flex items-center justify-center text-[#007AFF] group-hover:scale-110 transition-transform">
//                     <CheckCircle2 className="w-5 h-5 fill-[#007AFF] text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start mb-1">
//                       <h3 className="font-bold text-[#0F172A] text-lg">Technician Assigned</h3>
//                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">09:15 AM</span>
//                     </div>
//                     <p className="text-slate-500 text-sm leading-relaxed">Rahul K. has accepted your booking.</p>
//                   </div>
//                 </div>

//                 {/* Step 3 - Active */}
//                 <div className="flex gap-6 relative">
//                   <div className="z-10 w-10 h-10 rounded-xl bg-[#007AFF] border-4 border-[#DBEAFE] shadow-[0_0_20px_rgba(0,122,255,0.3)] flex items-center justify-center text-white scale-110">
//                     <Navigation2 className="w-5 h-5 fill-white" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start mb-1">
//                       <div className="flex items-center gap-3">
//                         <h3 className="font-black text-[#007AFF] text-lg">Out for Service</h3>
//                         <span className="px-2 py-0.5 bg-[#007AFF] text-white text-[9px] font-black rounded-md uppercase tracking-widest animate-pulse">
//                           Live
//                         </span>
//                       </div>
//                     </div>
//                     <p className="text-slate-600 font-medium text-sm leading-relaxed">
//                       Technician is on the way to your location.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Step 4 - Pending */}
//                 <div className="flex gap-6 relative opacity-40">
//                   <div className="z-10 w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
//                     <Clock className="w-5 h-5" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-bold text-slate-400 text-lg mb-1">Work in Progress</h3>
//                     <p className="text-slate-400 text-sm italic font-medium">Estimated duration: 1h 30m</p>
//                   </div>
//                 </div>

//                 {/* Step 5 - Pending */}
//                 <div className="flex gap-6 relative opacity-40">
//                   <div className="z-10 w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
//                     <CheckCircle2 className="w-5 h-5" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-bold text-slate-400 text-lg mb-1">Job Completed</h3>
//                     <p className="text-slate-400 text-sm italic font-medium">Final inspection, payment & rating</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Profile, OTP, Summary */}
//           <div className="space-y-8">
//             {/* Professional Card */}
//             <div className="bg-white p-8 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 text-center">
//               <div className="flex justify-between items-center mb-8">
//                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">
//                   Your Professional
//                 </span>
//                 <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E0F2FE] text-[#007AFF] text-[10px] font-bold rounded-full uppercase">
//                   <ShieldCheck className="w-3.5 h-3.5" />
//                   Verified
//                 </span>
//               </div>

//               <div className="relative inline-block mb-4">
//                 <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
//                   <Image
//                     src="/assets/testimonial-image.avif"
//                     alt="Technician"
//                     width={100}
//                     height={100}
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-slate-100">
//                   <span className="text-orange-400 text-[10px] font-bold">★</span>
//                   <span className="text-[11px] font-black text-[#0F172A]">4.8</span>
//                 </div>
//               </div>

//               <h2 className="text-2xl font-black text-[#0F172A] mb-1">Rahul Kumar</h2>
//               <p className="text-[#007AFF] font-bold text-sm mb-2">Master Technician</p>
//               <p className="text-slate-400 text-xs font-medium mb-8">120+ Jobs completed</p>

//               <div className="grid grid-cols-2 gap-4">
//                 <button className="flex items-center justify-center gap-2 bg-[#007AFF] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95">
//                   <Phone className="w-4 h-4 fill-white" />
//                   Call Now
//                 </button>
//                 <button className="flex items-center justify-center gap-2 bg-white text-slate-600 border-2 border-slate-100 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95">
//                   <MessageSquare className="w-4 h-4" />
//                   Message
//                 </button>
//               </div>
//             </div>

//             {/* OTP Card */}
//             <div className="bg-[#007AFF] p-8 rounded-lg text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
//               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h3 className="text-xs font-black uppercase tracking-widest text-blue-100 mb-1">Start Code (OTP)</h3>
//                   <p className="text-[11px] text-blue-100/80 font-medium">Share with technician upon arrival</p>
//                 </div>
//                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                   <ShieldCheck className="w-5 h-5 text-white" />
//                 </div>
//               </div>

//               <div className="bg-white/10 backdrop-blur-md rounded-lg py-6 flex justify-center items-center gap-4 border border-white/20">
//                 <span className="text-5xl font-black tracking-[0.2em] drop-shadow-lg">4 8 2 9</span>
//               </div>
//             </div>

//             {/* Service Summary Card */}
//             <div className="bg-white p-8 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50">
//               <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-8">Service Summary</h3>

//               <div className="space-y-8 mb-10">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
//                     <div className="w-6 h-6 text-slate-400 rotate-45">
//                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
//                       </svg>
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between mb-1">
//                       <h4 className="font-black text-[#0F172A] text-sm">AC Deep Clean (Split)</h4>
//                       <span className="font-black text-[#0F172A] text-sm">$120.00</span>
//                     </div>
//                     <p className="text-xs text-slate-400 font-medium mb-3">Quantity: 2 Units</p>
//                     <span className="px-2 py-1 bg-[#F0FDF4] text-[#166534] text-[9px] font-black rounded-md uppercase tracking-wider border border-[#DCFCE7]">
//                       Includes Gas Check
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4 pt-8 border-t border-slate-50">
//                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
//                     <MapPin className="w-5 h-5 text-slate-400" />
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="font-black text-[#0F172A] text-sm mb-1">Service Location</h4>
//                     <p className="text-xs text-slate-400 font-medium leading-relaxed">
//                       Block A, Apt 402, Green Valley Residency, Metro City, 560001
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-[#F8FAFC] p-6 rounded-2xl space-y-3">
//                 <div className="flex justify-between text-xs font-bold text-slate-400">
//                   <span>Subtotal</span>
//                   <span className="text-slate-600">$120.00</span>
//                 </div>
//                 <div className="flex justify-between text-xs font-bold text-slate-400 pb-4 border-b border-slate-200/50">
//                   <span>Taxes & Fees</span>
//                   <span className="text-slate-600">$5.00</span>
//                 </div>
//                 <div className="flex justify-between items-center pt-2 mb-4">
//                   <span className="font-black text-[#0F172A]">Total Amount</span>
//                   <span className="text-2xl font-black text-[#0F172A]">$125.00</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/50 p-3 rounded-xl border border-white">
//                   <Info className="w-3.5 h-3.5" />
//                   Payment via Credit Card ending in 4242
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Visual Accents */}
//       <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-50/50 blur-[100px] rounded-full" />
//       <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-slate-100/50 blur-[80px] rounded-full" />
//     </div>
//   )
// }

// FeedBack Page
// "use client"

// import { useState } from "react"
// import {
//   Bell,
//   ChevronLeft,
//   Star,
//   Check,
//   Clock,
//   Brush,
//   Smile,
//   BookOpen,
//   Tag,
//   Send,
//   CheckCircle2,
//   Pencil,
// } from "lucide-react"
// import Image from "next/image"

// export default function HomeServicePage() {
//   const [rating, setRating] = useState(4)
//   const [selectedTags, setSelectedTags] = useState(["Professional"])

//   const tags = [
//     { id: "Professional", icon: <CheckCircle2 className="w-4 h-4" /> },
//     { id: "On-Time", icon: <Clock className="w-4 h-4" /> },
//     { id: "Clean Work", icon: <Brush className="w-4 h-4" /> },
//     { id: "Friendly", icon: <Smile className="w-4 h-4" /> },
//     { id: "Knowledgeable", icon: <BookOpen className="w-4 h-4" /> },
//     { id: "Good Value", icon: <Tag className="w-4 h-4" /> },
//   ]

//   const toggleTag = (id: string) => {
//     if (selectedTags.includes(id)) {
//       setSelectedTags(selectedTags.filter((t) => t !== id))
//     } else {
//       setSelectedTags([...selectedTags, id])
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#F4F7FA] font-sans text-[#1A1C1E]">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-[#007AFF] rounded-md flex items-center justify-center">
//             <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
//           </div>
//           <span className="font-bold text-xl tracking-tight">Metro Cool</span>
//         </div>

//         <div className="flex items-center gap-8">
//           <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
//             <a href="#" className="hover:text-[#007AFF]">
//               Home
//             </a>
//             <a href="#" className="hover:text-[#007AFF]">
//               Bookings
//             </a>
//             <a href="#" className="hover:text-[#007AFF]">
//               Profile
//             </a>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
//               <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div className="w-10 h-10 rounded-full bg-[#FFE4D1] overflow-hidden border border-gray-200 cursor-pointer">
//               <Image src="/assets/testimonial-image.avif" alt="Profile" className="w-full h-full object-cover" width={100} height={100}/>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-3xl mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <button className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-800 transition-colors">
//           <ChevronLeft className="w-4 h-4" />
//           Back to Bookings
//         </button>

//         {/* Feedback Card */}
//         <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
//           {/* Gradient Header Bar */}
//           <div className="h-[4px] w-full bg-gradient-to-r from-[#00A3FF] via-[#007AFF] to-[#00D1FF]"></div>

//           {/* Service Header Section */}
//           <div className="p-6 md:p-8 bg-[#F9FBFC] border-b border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
//             <div className="relative">
//               <div className="w-20 h-20 bg-[#2D4A53] rounded-2xl overflow-hidden">
//                 <Image src="/assets/testimonial-image.avif" alt="Technician" className="w-full h-full object-cover" width={100} height={100}/>
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#34C759] rounded-full flex items-center justify-center border-2 border-white">
//                 <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
//               </div>
//             </div>

//             <div className="flex-1 text-center md:text-left">
//               <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
//                 <h1 className="text-xl font-bold">AC Maintenance Service</h1>
//                 <span className="bg-[#E8F8EE] text-[#34C759] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
//                   Completed
//                 </span>
//               </div>
//               <p className="text-gray-500 text-sm mb-3 font-medium">
//                 Service provided by <span className="text-[#1A1C1E] font-semibold">John Doe</span>
//               </p>
//               <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-400 font-medium">
//                 <span className="flex items-center gap-1.5">
//                   <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
//                   Oct 12, 2023
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
//                   Order #12345
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Experience Section */}
//           <div className="p-8 md:p-12 text-center">
//             <h2 className="text-2xl font-bold mb-2">How was your experience?</h2>
//             <p className="text-gray-400 text-sm mb-8">Your feedback helps us maintain high quality service.</p>

//             <div className="flex justify-center gap-3 mb-6">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
//                   <Star
//                     className={`w-10 h-10 ${star <= rating ? "fill-[#FFD600] text-[#FFD600]" : "text-gray-200 fill-gray-200"}`}
//                   />
//                 </button>
//               ))}
//             </div>

//             <div className="inline-block px-5 py-1.5 bg-[#EEF6FF] text-[#007AFF] text-sm font-bold rounded-full mb-10">
//               Excellent Service!
//             </div>

//             {/* Tags Section */}
//             <div className="text-left mb-10">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-bold text-base">What stood out?</h3>
//                 <span className="text-[11px] text-gray-400">Select all that apply</span>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 {tags.map((tag) => (
//                   <button
//                     key={tag.id}
//                     onClick={() => toggleTag(tag.id)}
//                     className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
//                       selectedTags.includes(tag.id)
//                         ? "bg-white border-[#007AFF] text-[#007AFF] shadow-[0_4px_12px_rgba(0,122,255,0.12)]"
//                         : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
//                     }`}
//                   >
//                     {tag.icon}
//                     {tag.id}
//                     {selectedTags.includes(tag.id) && <Check className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Comment Section */}
//             <div className="text-left mb-10">
//               <h3 className="font-bold text-base mb-4 flex items-center gap-2">
//                 Anything else to add?
//                 <span className="text-gray-300 font-normal text-sm">(Optional)</span>
//               </h3>
//               <div className="relative group">
//                 <textarea
//                   placeholder="Share more details about what made your experience great..."
//                   className="w-full h-32 p-4 bg-[#F9FBFC] border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:bg-white transition-all resize-none placeholder:text-gray-300"
//                 ></textarea>
//                 <div className="absolute bottom-4 right-4 text-gray-200 group-focus-within:text-[#007AFF] transition-colors">
//                   <Pencil className="w-4 h-4" />
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-4">
//               <button className="w-full py-4 bg-[#007AFF] hover:bg-[#0066D6] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(0,122,255,0.25)] flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
//                 Submit Feedback
//                 <Send className="w-4 h-4 fill-white" />
//               </button>

//               <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors py-2">
//                 Skip this step
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer info */}
//         <p className="mt-8 text-center text-[11px] text-gray-400 font-medium">
//           Protected by reCAPTCHA and subject to the Metro Cool{" "}
//           <a href="#" className="underline">
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </main>
//     </div>
//   )
// }

// Service Completion
import {
  ChevronLeft,
  Bell,
  Star,
  Download,
  CheckCircle2,
  LayoutDashboard,
  Wallet,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react"
import Image from "next/image"

export default function HomeServicePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      {/* Navigation Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 md:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#147BFF] p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">Metro Cool</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[#64748B] font-medium text-sm">
            <a href="#" className="hover:text-[#147BFF] transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-[#0F172A] border-b-2 border-[#147BFF] pb-4 -mb-4">
              Bookings
            </a>
            <a href="#" className="hover:text-[#147BFF] transition-colors">
              Wallet
            </a>
            <a href="#" className="hover:text-[#147BFF] transition-colors">
              Support
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#E2E8F0] overflow-hidden border border-[#CBD5E1]">
              <img
                src="/images/screen.png"
                alt="User Profile"
                className="w-full h-full object-cover grayscale opacity-50"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <button className="flex items-center text-[#64748B] text-sm font-medium gap-1 hover:text-[#147BFF] transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Bookings
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">Service Completion</h1>
              <p className="text-[#64748B]">Review invoice and complete payment to close the service request.</p>
            </div>
            <div className="flex items-center bg-[#FEF9C3] text-[#854D0E] px-4 py-2 rounded-full text-sm font-semibold border border-[#FEF08A] self-start md:self-center">
              <span className="w-2 h-2 bg-[#EAB308] rounded-full mr-2"></span>
              Payment Pending
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service Details & Invoice */}
          <div className="lg:col-span-7 space-y-6">
            {/* Technician Card */}
            <div className="bg-white rounded-lg p-6 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
              {/* Background graphic elements */}
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle cx="160" cy="40" r="40" stroke="currentColor" strokeWidth="2" />
                  <rect x="120" y="80" width="80" height="80" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex items-start gap-5 relative z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-lg bg-yellow-400 overflow-hidden">
                    <Image src="/assets/testimonial-image.avif" alt="Rahul Sharma" className="w-full h-full object-cover" width={50} height={50}/>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#22C55E] text-white rounded-full p-1 border-2 border-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-[#0F172A]">Rahul Sharma</h3>
                      <p className="text-[#64748B] text-sm">Senior HVAC Technician • Metro Cool Pro</p>
                    </div>
                    <div className="bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold px-2 py-1 rounded-md tracking-wider border border-[#E2E8F0]">
                      ID: T-8821
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center bg-[#FEF9C3] text-[#854D0E] px-2 py-1 rounded-md text-xs font-bold gap-1 border border-[#FEF08A]">
                      <Star className="w-3 h-3 fill-[#EAB308] text-[#EAB308]" />
                      4.8
                    </div>
                    <div className="h-4 w-[1px] bg-[#E2E8F0]"></div>
                    <span className="text-[#64748B] text-xs font-medium">500+ Jobs Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Stats */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <div className="p-6 border-r border-b border-[#E2E8F0]">
                  <p className="text-[#94A3B8] text-[10px] font-bold tracking-widest uppercase mb-1">
                    Service Reference
                  </p>
                  <p className="text-[#0F172A] font-bold text-base">#SR-99281</p>
                </div>
                <div className="p-6 border-b border-[#E2E8F0]">
                  <p className="text-[#94A3B8] text-[10px] font-bold tracking-widest uppercase mb-1">Completion Time</p>
                  <p className="text-[#0F172A] font-bold text-base">Oct 14, 2023 at 2:30 PM</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#94A3B8] text-[10px] font-bold tracking-widest uppercase mb-2">Service Type</p>
                <div className="flex items-center gap-3">
                  <div className="bg-[#EFF6FF] p-2 rounded-lg">
                    <Zap className="w-4 h-4 text-[#147BFF]" />
                  </div>
                  <p className="text-[#0F172A] font-medium">AC Deep Cleaning (Split Unit) + Gas Refill</p>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-[#E2E8F0] flex justify-between items-center">
                <h3 className="font-bold text-[#0F172A] text-lg">Bill Summary</h3>
                <button className="flex items-center gap-1.5 text-[#147BFF] text-sm font-bold hover:underline">
                  <Download className="w-4 h-4" />
                  Invoice
                </button>
              </div>
              <div className="bg-[#F8FAFC] px-6 py-2 grid grid-cols-2 text-[#94A3B8] text-[10px] font-bold tracking-widest uppercase">
                <span>Description</span>
                <span className="text-right">Price</span>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <p className="text-[#475569] font-medium">Standard AC Service (x1)</p>
                  <p className="text-[#0F172A] font-bold">₹499.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#475569] font-medium">Gas Refill (R32) - 1.5kg</p>
                  <p className="text-[#0F172A] font-bold">₹800.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#475569] font-medium">Taxes & Service Fee</p>
                  <p className="text-[#0F172A] font-bold">₹0.00</p>
                </div>
              </div>
              <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center">
                <p className="text-[#0F172A] font-bold text-lg">Total Payable</p>
                <p className="text-[#147BFF] font-black text-xl">₹1,299.00</p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-8 shadow-md relative overflow-hidden">
              {/* Decorative blue top bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#147BFF]"></div>

              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#0F172A]">Make Payment</h2>
                <div className="flex items-center bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-black gap-1 uppercase tracking-tighter">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Due Now
                </div>
              </div>

              <div className="text-center mb-10">
                <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-widest mb-1">Total Amount</p>
                <div className="text-[48px] font-black text-[#0F172A] leading-tight flex items-center justify-center gap-1">
                  <span className="text-3xl">₹</span>1,299
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-2">Choose Method</p>

                {/* UPI Option */}
                <div className="border-2 border-[#147BFF] bg-[#F0F7FF] p-5 rounded-lg flex items-center gap-4 cursor-pointer group relative">
                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
                    <LayoutDashboard className="w-6 h-6 text-[#147BFF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0F172A] font-bold text-base">UPI / Online</p>
                    <p className="text-[#64748B] text-xs">GPay, PhonePe, Paytm</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#147BFF] flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#147BFF] rounded-full"></div>
                  </div>
                </div>

                {/* Cash Option */}
                <div className="border border-[#E2E8F0] p-5 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                    <Wallet className="w-6 h-6 text-[#94A3B8]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#475569] font-bold text-base">Cash</p>
                    <p className="text-[#94A3B8] text-xs">Pay directly to technician</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#E2E8F0]"></div>
                </div>
              </div>

              <button className="w-full bg-[#147BFF] text-white py-5 rounded-lg font-black text-lg mt-10 hover:bg-[#0066FF] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                Pay ₹1,299
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-[#94A3B8] text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                Secured by Razorpay
              </div>
            </div>

            {/* Locked Closure Code */}
            <div className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] border-dashed p-6 flex items-center justify-between opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] font-bold">
                  2
                </div>
                <div>
                  <p className="text-[#0F172A] font-bold text-sm">Service Closure Code</p>
                  <p className="text-[#94A3B8] text-xs">Unlocks after payment confirmation</p>
                </div>
              </div>
              <Lock className="w-5 h-5 text-[#CBD5E1]" />
            </div>

            {/* Design Preview Section */}
            <div className="pt-12 border-t border-[#E2E8F0] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-[#94A3B8] text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                [ Design Preview: Post-payment state ]
              </div>

              <div className="bg-white rounded-3xl border-t-4 border-t-[#10B981] border border-[#E2E8F0] shadow-xl overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-2">Payment Successful!</h3>
                  <p className="text-[#64748B] text-sm">Transaction ID: #TXN-882920</p>

                  <div className="mt-10 p-8 bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] relative overflow-hidden">
                    <p className="text-[#147BFF] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      Share OTP with technician
                    </p>
                    <div className="flex justify-center gap-2">
                      {["4", "8", "2", "9"].map((num, i) => (
                        <div
                          key={i}
                          className="w-12 h-16 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-2xl font-black text-[#0F172A] shadow-sm"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <p className="text-[#94A3B8] text-[10px] mt-6 leading-relaxed">
                      This code closes the service request #SR-99281
                    </p>
                  </div>
                </div>
                <button className="w-full py-6 border-t border-[#E2E8F0] text-[#147BFF] font-bold text-sm hover:bg-gray-50 transition-colors">
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
