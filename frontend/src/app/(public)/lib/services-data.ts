export interface ServiceAddon {
  title: string
  price: string
  badge: string | null
  description: string
  image: string
}

export interface Service {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  image: string
  thumbnailImage: string
  category: string
  badge: string | null
  rating: number
  reviews: string
  duration: string
  expertise: string
  warranty: string
  price: number
  originalPrice: number
  discount: string
  included: Array<{
    title: string
    description: string
    icon: string
    color: string
  }>
  addons: ServiceAddon[]
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const servicesData: Service[] = [
  {
    id: "split-ac-power-jet",
    title: "Split AC Power Jet Service",
    shortDescription: "Comprehensive service for standalone room units to ensure optimal performance.",
    longDescription:
      "Advanced high-pressure cleaning for superior cooling performance and healthier air quality. Recommended every 6 months.",
    image: "/professional-technician-cleaning-split-ac-unit-wit.jpg",
    thumbnailImage: "/assets/Hero-Slider-AC-Repairing-2.jpg",
    category: "Split AC + Window AC",
    badge: "Bestseller",
    rating: 4.9,
    reviews: "1.2k+",
    duration: "60 Minutes",
    expertise: "Certified Pro",
    warranty: "30 Days",
    price: 49.0,
    originalPrice: 65.0,
    discount: "25%",
    included: [
      {
        title: "Pre-service Inspection",
        description: "Detailed checks on gas pressure, cooling coil, and overall system health.",
        icon: "SearchCheck",
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Deep Jet Cleaning",
        description: "High-pressure wash for condenser coils, drain trays, and blower fans.",
        icon: "Droplets",
        color: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "Anti-bacterial Wash",
        description: "Chemical treatment for filters to eliminate mold, fungi, and bad odors.",
        icon: "Wind",
        color: "bg-cyan-50 text-cyan-600",
      },
      {
        title: "Site Cleanup",
        description: "Thorough post-service cleanup of the area and final performance test.",
        icon: "Trash2",
        color: "bg-blue-50 text-blue-600",
      },
    ],
    addons: [
      {
        title: "Gas Top-up",
        price: "+$20.00",
        badge: "Popular",
        description: "Refill refrigerant gas up to 10 PSI if levels are found low during inspection.",
        image: "/refrigerant-gas-cylinder.jpg",
      },
      {
        title: "Anti-rust Coating",
        price: "+$12.00",
        badge: null,
        description: "Protective coating to prevent rust and extend the life of your AC unit.",
        image: "/protective-spray-bottle-for-ac.jpg",
      },
    ],
    faqs: [
      {
        question: "Does this service include gas filling?",
        answer:
          "No, gas filling is an additional service. However, we check gas levels during inspection and can add it as an addon.",
      },
      {
        question: "What if a spare part is needed?",
        answer:
          "Our technician will inform you of any parts needed and provide a quote. Parts are billed separately after your approval.",
      },
    ],
  },
  {
    id: "room-air-conditioner",
    title: "Room Air-Conditioner Service",
    shortDescription: "Comprehensive service for standalone room units to ensure optimal performance.",
    longDescription:
      "Complete maintenance and cleaning service for room air conditioners with filter cleaning and performance optimization.",
    image: "/professional-technician-cleaning-split-ac-unit-wit.jpg",
    thumbnailImage: "/assets/Hero-Slider-AC-Repairing-1.jpg",
    category: "Room Air-Conditioner",
    badge: null,
    rating: 4.8,
    reviews: "890+",
    duration: "45 Minutes",
    expertise: "Certified Pro",
    warranty: "30 Days",
    price: 39.0,
    originalPrice: 55.0,
    discount: "29%",
    included: [
      {
        title: "Filter Cleaning",
        description: "Deep cleaning of air filters to improve air quality and cooling efficiency.",
        icon: "SearchCheck",
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Coil Cleaning",
        description: "Thorough cleaning of evaporator and condenser coils for better heat transfer.",
        icon: "Droplets",
        color: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "Performance Check",
        description: "Complete system diagnostics to ensure optimal cooling performance.",
        icon: "Wind",
        color: "bg-cyan-50 text-cyan-600",
      },
      {
        title: "Area Cleanup",
        description: "Complete cleanup of service area and final testing.",
        icon: "Trash2",
        color: "bg-blue-50 text-blue-600",
      },
    ],
    addons: [
      {
        title: "Gas Top-up",
        price: "+$20.00",
        badge: "Popular",
        description: "Refill refrigerant gas up to 10 PSI if levels are found low during inspection.",
        image: "/refrigerant-gas-cylinder.jpg",
      },
    ],
    faqs: [
      {
        question: "How often should I service my room AC?",
        answer: "We recommend servicing your room AC every 3-4 months for optimal performance and longevity.",
      },
      {
        question: "Do you provide same-day service?",
        answer: "Yes, we offer same-day service based on technician availability in your area.",
      },
    ],
  },
  {
    id: "ac-installation",
    title: "AC Installation Service",
    shortDescription: "Professional mounting, unmounting, and setup services with safety protocols.",
    longDescription:
      "Expert installation service for all types of air conditioners with proper mounting and electrical connections.",
    image: "/professional-technician-cleaning-split-ac-unit-wit.jpg",
    thumbnailImage: "/assets/Hero-Slider-AC-Repairing-3.jpg",
    category: "Installations",
    badge: null,
    rating: 4.9,
    reviews: "1.5k+",
    duration: "90 Minutes",
    expertise: "Expert Installer",
    warranty: "60 Days",
    price: 79.0,
    originalPrice: 99.0,
    discount: "20%",
    included: [
      {
        title: "Site Assessment",
        description: "Professional evaluation of installation location and requirements.",
        icon: "SearchCheck",
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Professional Mounting",
        description: "Secure mounting with proper brackets and safety measures.",
        icon: "Droplets",
        color: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "Electrical Setup",
        description: "Safe electrical connections with proper grounding and testing.",
        icon: "Wind",
        color: "bg-cyan-50 text-cyan-600",
      },
      {
        title: "Performance Test",
        description: "Complete testing to ensure proper operation and cooling.",
        icon: "Trash2",
        color: "bg-blue-50 text-blue-600",
      },
    ],
    addons: [
      {
        title: "Copper Piping (per meter)",
        price: "+$8.00",
        badge: "Essential",
        description: "High-quality copper piping for refrigerant connections.",
        image: "/refrigerant-gas-cylinder.jpg",
      },
      {
        title: "Electrical Wiring Kit",
        price: "+$25.00",
        badge: null,
        description: "Complete wiring kit with circuit breaker and proper gauge cables.",
        image: "/protective-spray-bottle-for-ac.jpg",
      },
    ],
    faqs: [
      {
        question: "What is included in the installation service?",
        answer:
          "The service includes mounting, basic piping (up to 3 meters), electrical connections, and performance testing.",
      },
      {
        question: "Do I need to buy any materials?",
        answer:
          "Standard installation materials are included. Extra piping, electrical work, or special mounting may incur additional charges.",
      },
    ],
  },
  {
    id: "ac-repair-gas-charging",
    title: "AC Repair + Gas Charging",
    shortDescription: "Fixing cooling issues, leakages, component replacements, and gas charging.",
    longDescription:
      "Complete repair service for all AC issues including cooling problems, gas leaks, and component replacements.",
    image: "/professional-technician-cleaning-split-ac-unit-wit.jpg",
    thumbnailImage: "/assets/Hero-Slider-AC-Repairing-1.jpg",
    category: "Repair + Gas Charging",
    badge: "Popular",
    rating: 4.8,
    reviews: "2k+",
    duration: "75 Minutes",
    expertise: "Master Technician",
    warranty: "45 Days",
    price: 69.0,
    originalPrice: 89.0,
    discount: "22%",
    included: [
      {
        title: "Diagnostics",
        description: "Complete system diagnostics to identify all issues.",
        icon: "SearchCheck",
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Leak Detection",
        description: "Advanced leak detection and repair for refrigerant system.",
        icon: "Droplets",
        color: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "Gas Charging",
        description: "Proper refrigerant charging with pressure testing.",
        icon: "Wind",
        color: "bg-cyan-50 text-cyan-600",
      },
      {
        title: "Final Testing",
        description: "Comprehensive testing to ensure proper operation.",
        icon: "Trash2",
        color: "bg-blue-50 text-blue-600",
      },
    ],
    addons: [
      {
        title: "Extra Gas (per 100g)",
        price: "+$15.00",
        badge: "Common",
        description: "Additional refrigerant gas if more than standard amount is needed.",
        image: "/refrigerant-gas-cylinder.jpg",
      },
      {
        title: "Component Replacement",
        price: "Varies",
        badge: null,
        description: "Replacement of faulty components like capacitors, relays, or thermostats.",
        image: "/protective-spray-bottle-for-ac.jpg",
      },
    ],
    faqs: [
      {
        question: "How do I know if my AC needs gas charging?",
        answer:
          "Signs include reduced cooling, ice formation on pipes, or AC running continuously without cooling properly.",
      },
      {
        question: "Is gas charging covered in warranty?",
        answer:
          "Yes, if gas leaks again within 45 days due to our service, we'll recharge it free of cost (parts excluded).",
      },
    ],
  },
  {
    id: "ac-maintenance",
    title: "AC Maintenance Service",
    shortDescription: "Routine maintenance, filter cleaning, and master service checks for efficiency.",
    longDescription:
      "Comprehensive maintenance service to keep your AC running efficiently with preventive care and optimization.",
    image: "/professional-technician-cleaning-split-ac-unit-wit.jpg",
    thumbnailImage: "/assets/Hero-Slider-AC-Repairing-4.jpg",
    category: "AC Services",
    badge: null,
    rating: 4.7,
    reviews: "750+",
    duration: "50 Minutes",
    expertise: "Certified Pro",
    warranty: "30 Days",
    price: 44.0,
    originalPrice: 60.0,
    discount: "27%",
    included: [
      {
        title: "Routine Inspection",
        description: "Complete inspection of all AC components and systems.",
        icon: "SearchCheck",
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Filter Maintenance",
        description: "Cleaning or replacement of air filters for better air quality.",
        icon: "Droplets",
        color: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "Efficiency Optimization",
        description: "Adjustments to ensure maximum cooling efficiency and energy savings.",
        icon: "Wind",
        color: "bg-cyan-50 text-cyan-600",
      },
      {
        title: "Report Generation",
        description: "Detailed maintenance report with recommendations.",
        icon: "Trash2",
        color: "bg-blue-50 text-blue-600",
      },
    ],
    addons: [
      {
        title: "Premium Filter Replacement",
        price: "+$18.00",
        badge: "Recommended",
        description: "High-quality HEPA filters for superior air filtration.",
        image: "/refrigerant-gas-cylinder.jpg",
      },
    ],
    faqs: [
      {
        question: "How often should I schedule maintenance?",
        answer:
          "We recommend quarterly maintenance for optimal performance, especially before and after peak usage seasons.",
      },
      {
        question: "What's the difference between maintenance and service?",
        answer:
          "Maintenance is preventive care, while service is deeper cleaning. We recommend alternating between both.",
      },
    ],
  },
]
