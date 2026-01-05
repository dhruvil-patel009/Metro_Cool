export interface Product {
  id: string
  name: string
  description: string
  shortDesc: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  badge?: string
  badgeColor?: string
  inStock: boolean
  category: string
  brand: string
  capacity?: string
  specifications: {
    label: string
    value: string
  }[]
  features: {
    title: string
    description: string
  }[]
}

export const products: Product[] = [
  {
    id: "samsung-windfree-split-ac",
    name: "Samsung WindFree™ Split AC",
    shortDesc: "1.5 Ton 5 Star, Inverter with Wi-Fi Connect, Antibacterial Filter.",
    description:
      "Experience superior comfort with the Samsung WindFree™ Split AC. Designed with advanced inverter technology, it adjusts power consumption precisely to maintain your desired temperature, saving you up to 45% on energy bills. The sleek design blends seamlessly into any modern interior, while the whisper-quiet operation ensures your sleep is never disturbed.",
    price: 549.0,
    oldPrice: 699.0,
    rating: 4.8,
    reviews: 124,
    image: "/samsung-split-ac-unit-white-modern.jpg",
    images: [
      "/samsung-split-ac-unit-white-modern.jpg",
      "/ac-remote-control-sleek-design.jpg",
      "/ac-indoor-unit-mounted-wall.jpg",
      "/ac-outdoor-compressor-unit.jpg",
    ],
    badge: "In Stock",
    badgeColor: "bg-emerald-500",
    inStock: true,
    category: "Air Conditioners",
    brand: "Samsung",
    capacity: "1.5 Ton",
    specifications: [
      { label: "Capacity", value: "1.5 Ton (18,000 BTU)" },
      { label: "Energy Rating", value: "5 Star" },
      { label: "Technology", value: "Dual Inverter Compressor" },
      { label: "Cooling Area", value: "Up to 180 sq. ft." },
      { label: "Refrigerant", value: "R32 (Eco-friendly)" },
      { label: "Noise Level", value: "19 dB (Indoor)" },
      { label: "Warranty", value: "5 Years Comprehensive" },
      { label: "Power Consumption", value: "1050W" },
    ],
    features: [
      {
        title: "Dual Inverter Compressor",
        description: "Faster cooling and longer durability with reduced energy consumption.",
      },
      {
        title: "Smart Connectivity",
        description: "Control from anywhere via the Metro Cool app with Wi-Fi integration.",
      },
      {
        title: "Anti-Viral Filter",
        description: "Ensures the air you breathe is clean and healthy with advanced filtration.",
      },
    ],
  },
  {
    id: "lg-dual-inverter-smart-ac",
    name: "LG Dual Inverter Smart AC",
    shortDesc: "AI Convertible 6-in-1 Cooling, HD Filter with Anti-Virus Protection.",
    description:
      "The LG Dual Inverter Smart AC offers intelligent cooling with AI-powered temperature control. With 6-in-1 convertible modes, it adapts to your cooling needs perfectly. The HD filter removes dust, bacteria, and viruses, ensuring a healthy environment for your family.",
    price: 720.0,
    oldPrice: 850.0,
    rating: 5.0,
    reviews: 98,
    image: "/lg-smart-ac-white-premium-design.jpg",
    images: [
      "/lg-smart-ac-white-premium-design.jpg",
      "/lg-ac-remote-display-screen.jpg",
      "/lg-ac-indoor-unit-sleek.jpg",
      "/lg-ac-outdoor-unit-compact.jpg",
    ],
    badge: "Best Seller",
    badgeColor: "bg-blue-600",
    inStock: true,
    category: "Air Conditioners",
    brand: "LG",
    capacity: "1.5 Ton",
    specifications: [
      { label: "Capacity", value: "1.5 Ton (18,000 BTU)" },
      { label: "Energy Rating", value: "5 Star" },
      { label: "Technology", value: "AI Dual Inverter" },
      { label: "Cooling Area", value: "Up to 200 sq. ft." },
      { label: "Refrigerant", value: "R32 (Eco-friendly)" },
      { label: "Noise Level", value: "18 dB (Indoor)" },
      { label: "Warranty", value: "10 Years Compressor, 5 Years Product" },
      { label: "Power Consumption", value: "980W" },
    ],
    features: [
      {
        title: "AI Convertible 6-in-1",
        description: "Adjust tonnage capacity based on your cooling requirements intelligently.",
      },
      {
        title: "Ocean Black Protection",
        description: "Anti-corrosion coating for outdoor unit ensures longevity in harsh conditions.",
      },
      {
        title: "HD Filter with Anti-Virus",
        description: "Advanced filtration removes 99.9% of bacteria and viruses from the air.",
      },
    ],
  },
  {
    id: "voltas-adjustable-window-ac",
    name: "Voltas Adjustable Window AC",
    shortDesc: "1.5 Ton 3 Star, High Ambient Cooling, Copper Condenser.",
    description:
      "The Voltas Adjustable Window AC is perfect for those looking for reliable cooling at an affordable price. With high ambient cooling technology, it works efficiently even in extreme heat conditions. The copper condenser ensures better cooling and longer life.",
    price: 399.0,
    rating: 4.2,
    reviews: 67,
    image: "/voltas-window-ac-unit-white.jpg",
    images: [
      "/voltas-window-ac-unit-white.jpg",
      "/window-ac-front-view-controls.jpg",
      "/window-ac-side-profile.jpg",
      "/window-ac-installation-setup.jpg",
    ],
    inStock: true,
    category: "Air Conditioners",
    brand: "Voltas",
    capacity: "1.5 Ton",
    specifications: [
      { label: "Capacity", value: "1.5 Ton (18,000 BTU)" },
      { label: "Energy Rating", value: "3 Star" },
      { label: "Technology", value: "Fixed Speed" },
      { label: "Cooling Area", value: "Up to 150 sq. ft." },
      { label: "Refrigerant", value: "R22" },
      { label: "Noise Level", value: "48 dB" },
      { label: "Warranty", value: "1 Year Comprehensive" },
      { label: "Power Consumption", value: "1600W" },
    ],
    features: [
      {
        title: "High Ambient Cooling",
        description: "Works efficiently even at outdoor temperatures up to 52°C.",
      },
      {
        title: "Copper Condenser",
        description: "Better heat transfer and durability compared to aluminum condensers.",
      },
      {
        title: "Auto Restart",
        description: "Automatically restarts with previous settings after power cut.",
      },
    ],
  },
  {
    id: "blue-star-portable-ac",
    name: "Blue Star Portable AC",
    shortDesc: "1 Ton Portable AC, Silver Coating, Easy Mobility for small rooms.",
    description:
      "The Blue Star Portable AC offers the ultimate in flexibility. Move it from room to room as needed. Perfect for renters or those who want cooling without permanent installation. The silver coating ensures efficient cooling and energy savings.",
    price: 382.5,
    oldPrice: 450.0,
    rating: 3.8,
    reviews: 45,
    image: "/portable-ac-unit-with-wheels-compact.jpg",
    images: [
      "/portable-ac-unit-with-wheels-compact.jpg",
      "/portable-ac-control-panel-digital.jpg",
      "/portable-ac-exhaust-hose-setup.jpg",
      "/placeholder.svg?height=400&width=400",
    ],
    badge: "Sale -15%",
    badgeColor: "bg-rose-500",
    inStock: true,
    category: "Air Conditioners",
    brand: "Blue Star",
    capacity: "1.0 Ton",
    specifications: [
      { label: "Capacity", value: "1.0 Ton (12,000 BTU)" },
      { label: "Energy Rating", value: "3 Star" },
      { label: "Technology", value: "Portable" },
      { label: "Cooling Area", value: "Up to 120 sq. ft." },
      { label: "Refrigerant", value: "R410A" },
      { label: "Noise Level", value: "52 dB" },
      { label: "Warranty", value: "1 Year Product" },
      { label: "Power Consumption", value: "1200W" },
    ],
    features: [
      {
        title: "Easy Mobility",
        description: "Built-in wheels and handles make it easy to move between rooms.",
      },
      {
        title: "No Installation Required",
        description: "Just plug in and start cooling. Perfect for renters.",
      },
      {
        title: "Dehumidifier Mode",
        description: "Removes excess moisture from the air during humid conditions.",
      },
    ],
  },
  {
    id: "daikin-standard-series",
    name: "Daikin Standard Series",
    shortDesc: "0.8 Ton 3 Star, Split AC, Copper Condenser, PM 2.5 Filter.",
    description:
      "Daikin brings you reliable cooling with the Standard Series. Compact yet powerful, this AC is perfect for small rooms. The PM 2.5 filter removes harmful particles from the air, ensuring you breathe clean and fresh air always.",
    price: 320.0,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    inStock: true,
    category: "Air Conditioners",
    brand: "Daikin",
    capacity: "0.8 Ton",
    specifications: [
      { label: "Capacity", value: "0.8 Ton (9,600 BTU)" },
      { label: "Energy Rating", value: "3 Star" },
      { label: "Technology", value: "Fixed Speed" },
      { label: "Cooling Area", value: "Up to 100 sq. ft." },
      { label: "Refrigerant", value: "R32 (Eco-friendly)" },
      { label: "Noise Level", value: "38 dB (Indoor)" },
      { label: "Warranty", value: "1 Year Comprehensive" },
      { label: "Power Consumption", value: "890W" },
    ],
    features: [
      {
        title: "PM 2.5 Filter",
        description: "Removes fine particulate matter from the air for healthier breathing.",
      },
      {
        title: "Copper Condenser",
        description: "Better cooling efficiency and durability over time.",
      },
      {
        title: "Quiet Operation",
        description: "Low noise levels ensure peaceful sleep and work environment.",
      },
    ],
  },
  {
    id: "carrier-midea-cassette-ac",
    name: "Carrier Midea Cassette AC",
    shortDesc: "3 Ton Ceiling Cassette, Commercial Grade, 360° Air Distribution.",
    description:
      "The Carrier Midea Cassette AC is designed for large commercial spaces. With 360° air distribution, it ensures uniform cooling throughout the room. Perfect for offices, restaurants, and retail spaces.",
    price: 1450.0,
    rating: 4.6,
    reviews: 32,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    inStock: true,
    category: "Air Conditioners",
    brand: "Carrier",
    capacity: "3.0 Ton",
    specifications: [
      { label: "Capacity", value: "3.0 Ton (36,000 BTU)" },
      { label: "Energy Rating", value: "4 Star" },
      { label: "Technology", value: "Inverter" },
      { label: "Cooling Area", value: "Up to 400 sq. ft." },
      { label: "Refrigerant", value: "R410A" },
      { label: "Noise Level", value: "42 dB (Indoor)" },
      { label: "Warranty", value: "3 Years Comprehensive" },
      { label: "Power Consumption", value: "2800W" },
    ],
    features: [
      {
        title: "360° Air Distribution",
        description: "Four-way airflow ensures uniform cooling in large spaces.",
      },
      {
        title: "Commercial Grade",
        description: "Built to withstand continuous operation in commercial environments.",
      },
      {
        title: "Auto Swing",
        description: "Automated louvers direct airflow for optimal comfort.",
      },
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getProductsByBrand(brand: string): Product[] {
  return products.filter((product) => product.brand === brand)
}
