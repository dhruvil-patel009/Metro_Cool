import { Button } from "@/app/components/ui/button"
import { Info, ShieldCheck, X } from "lucide-react"

export default function SuccessModal({
  onReturnToHome,
//   onLogout,
  onClose,
}: {
  onReturnToHome: () => void
//   onLogout: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon with Badge */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <ShieldCheck className="w-12 h-12 text-blue-600" />
            </div>
            {/* Pending Badge */}
            <div className="absolute -bottom-2 w-26 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              ⚡ PENDING
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Verification in Progress</h2>

        {/* Description */}
        <p className="text-center text-gray-600 leading-relaxed mb-6">
          Thank you for registering. Your technician profile is currently under review by our administrative team to
          ensure quality standards and safety.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">What happens next?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You will receive an automated notification via <span className="font-semibold text-blue-600">SMS</span>{" "}
                and <span className="font-semibold text-blue-600">Email</span> immediately after your documents are
                approved.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onReturnToHome}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl"
          >
            Return to Home
          </Button>
          {/* <button
            onClick={onLogout}
            className="w-full text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
          >
            Logout
          </button> */}
        </div>
      </div>
    </div>
  )
}