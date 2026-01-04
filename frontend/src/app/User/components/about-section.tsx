import { ArrowRight, History, Sparkles, Cpu } from "lucide-react"
import { AboutCard } from "./ui/about-card"

export function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-blue-600" />
              <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">About Us</span>
            </div>

            <h2 className="text-5xl font-bold mb-8 text-[#1d242d]">The MetroCool Story</h2>

            <div className="space-y-6 text-gray-500 leading-relaxed mb-10">
              <p>
                Founded in 2016, <span className="font-bold text-[#1d242d]">Comfort HVAC Solutions</span> began with a
                mission to deliver precision cooling for residential, industrial, and IT environments. With over 9+
                years of experience handling commercial chillers, industrial HVAC systems, and server-room cooling, we
                noticed one major gap — the service booking experience was outdated.
              </p>
              <p>
                <span className="text-blue-600 font-bold">MetroCool</span> is the digital evolution of Comfort HVAC
                Solutions. We bring industrial-grade HVAC expertise into a seamless, 60-second online booking
                experience.
              </p>
              <p>
                When customers book with MetroCool, they receive technicians trained by HVAC engineers — not just
                general service workers.
              </p>
            </div>

            <button className="bg-[#1d242d] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-black transition-all">
              Read full story <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-16 lg:mt-0 space-y-6">
            <AboutCard
              icon={<History className="w-5 h-5 text-blue-600" />}
              title="Deep Roots"
              desc="Backed by nearly a decade of HVAC expertise."
            />
            <AboutCard
              icon={<Sparkles className="w-5 h-5 text-blue-600" />}
              title="Zero Mess Promise"
              desc='Signature "Service Jacket" protocol.'
            />
            <AboutCard
              icon={<Cpu className="w-5 h-5 text-blue-600" />}
              title="Engineering Mindset"
              desc="Optimized cooling, not just cleaning."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
