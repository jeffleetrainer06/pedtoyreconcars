import { VehicleGrid}  from './VehicleGrid'
import { Shield, CheckCircle, Clock, Award } from 'lucide-react'

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quality Pre-Owned Vehicles
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8">
            Reserve your next vehicle during our reconditioning process
          </p>
        </div>
      </div>

      {/* Process Explanation */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Reconditioning Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every vehicle goes through our comprehensive reconditioning process to ensure safety, reliability, and quality. 
              You can reserve these vehicles now with no deposit required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Inspection</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive safety checks including brakes, tires, lights, and all safety systems
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mechanical Check</h3>
              <p className="text-gray-600 text-sm">
                Engine, transmission, and all mechanical systems thoroughly inspected and serviced
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Award className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Toyota Certification</h3>
              <p className="text-gray-600 text-sm">
                Newer Toyota vehicles evaluated for Gold or Silver certification eligibility
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reserve Now</h3>
              <p className="text-gray-600 text-sm">
                Test drive and sign a non-binding agreement to reserve your vehicle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Information */}
      <div className="bg-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-semibold text-blue-900 mb-4">
            How Vehicle Reservation Works
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>• Schedule a test drive of any vehicle currently in reconditioning</p>
            <p>• Sign a purchase agreement that is <strong>not binding</strong> - no deposit required</p>
            <p>• If we discover major mechanical issues during reconditioning, you won't be expected to purchase</p>
            <p>• Reserve your vehicle with confidence - we stand behind our quality process</p>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <VehicleGrid />
    </div>
  )
}
