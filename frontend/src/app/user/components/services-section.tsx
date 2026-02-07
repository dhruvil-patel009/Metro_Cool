import { Wrench, Settings } from "lucide-react"
import { ServiceCard } from "./ui/services-card"

export function ServicesSection() {
  return (
    <section className="py-24 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">What We Do</p>
          <h2 className="text-2xl sm:text-4xl font-bold">Our Professional Services</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Wrench className="w-6 h-6 text-blue-600" />}
            title="AC Repair"
            description="Fast diagnostics and expert fixes for all AC brands. We restore your cooling comfort instantly."
            linkText="Book Repair"
          />
          <ServiceCard
            icon={<Settings className="w-6 h-6 text-blue-600" />}
            title="Installation"
            description="Professional uninstallation and installation services. Secure mounting and leakage checks included."
            linkText="Book Install"
          />
          <ServiceCard
            icon={<Settings className="w-6 h-6 text-blue-600" />}
            title="Maintenance"
            description="Regular servicing to improve efficiency and longevity. Deep cleaning and gas refilling services."
            linkText="Book Service"
          />
        </div>
      </div>
    </section>
  )
}
