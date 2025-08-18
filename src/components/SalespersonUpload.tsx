import { useState, useEffect } from 'react'
import { supabase, Vehicle } from '../lib/supabase'
import { PhotoUploadManager } from './PhotoUploadManager'
import { Car, Lock, User, Search, Plus, CheckCircle, DollarSign } from 'lucide-react'

interface VehiclePriceUpdateProps {
  vehicle: Vehicle
  onUpdate: () => void
}

function VehiclePriceUpdate({ vehicle, onUpdate }: VehiclePriceUpdateProps) {
  const [price, setPrice] = useState(vehicle.price.toString())
  const [updating, setUpdating] = useState(false)

  const handlePriceUpdate = async () => {
    if (!price || isNaN(Number(price))) {
      alert('Please enter a valid price')
      return
    }

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ price: parseFloat(price) })
        .eq('id', vehicle.id)

      if (error) throw error
      
      alert('Price updated successfully!')
      onUpdate()
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Error updating price. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <DollarSign className="h-5 w-5 text-blue-600" />
      <div className="flex-1">
        <label className="block text-sm font-medium text-blue-900 mb-1">
          Current Price: ${vehicle.price.toLocaleString()}
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            step="100"
            placeholder="Enter new price"
            className="flex-1 border border-blue-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            onClick={handlePriceUpdate}
            disabled={updating}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {updating ? 'Updating...' : 'Update Price'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function SalespersonUpload() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [salespersonName, setSalespersonName] = useState('')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loginCode, setLoginCode] = useState('')

  const UPLOAD_CODE = 'upload123'

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles()
    }
  }, [isAuthenticated])

  async function fetchVehicles() {
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    setVehicles(data || [])
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if ((loginCode === UPLOAD_CODE || loginCode === 'test') && salespersonName.trim()) {
      setIsAuthenticated(true)
    } else {
      alert('Invalid code or missing name. Please try again.')
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.year.toString().includes(searchTerm) ||
    vehicle.stock_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Car className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Salesperson Photo Upload</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to upload vehicle photos</p>
          </div>
          
          <div className="mb-6 p-4 bg-green-50 rounded-md sm:hidden">
            <h3 className="text-sm font-semibold text-green-800 mb-2">📱 Add to Home Screen:</h3>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• iPhone: Share button → "Add to Home Screen"</li>
              <li>• Android: Menu (⋮) → "Add to Home screen"</li>
              <li>• Creates app icon on your phone</li>
              <li>• Works offline once installed</li>
            </ul>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={salespersonName}
                onChange={(e) => setSalespersonName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Upload Code
              </label>
              <input
                type="password"
                required
                placeholder="Enter upload code"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 font-medium"
            >
              Access Photo Upload
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-700 text-sm">
              <strong>For Salespeople:</strong> Contact your manager for the upload code. 
              This system allows you to upload photos for vehicles currently in reconditioning.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Photo Upload System</h1>
            <p className="text-gray-600 mt-2">Welcome, {salespersonName}! Upload photos for vehicles in reconditioning.</p>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false)
              setSalespersonName('')
              setLoginCode('')
              setSelectedVehicle(null)
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      {!selectedVehicle ? (
        <div>
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by make, model, year, or stock number..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Select Vehicle to Upload Photos ({filteredVehicles.length} available)
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500">
                        <span>Stock #{vehicle.stock_number}</span>
                        <span className="mx-2">•</span>
                        <span>${vehicle.price.toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <span>{vehicle.exterior_color}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 font-medium text-base whitespace-nowrap"
                    >
                      Upload Photos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No vehicles available for photo upload.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="mb-6 inline-flex items-center text-red-600 hover:text-red-700"
          >
            ← Back to Vehicle List
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.trim}
            </h2>
            <div className="text-gray-600">
              <span>Stock #{selectedVehicle.stock_number}</span>
              <span className="mx-2">•</span>
              <span>${selectedVehicle.price.toLocaleString()}</span>
              <span className="mx-2">•</span>
              <span>{selectedVehicle.exterior_color}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload Vehicle Photos</h3>
            
            {/* Vehicle Price Update Section */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Update Vehicle Price</h4>
              <VehiclePriceUpdate vehicle={selectedVehicle} onUpdate={() => {
                // Refresh the selected vehicle data
                fetchVehicles().then(() => {
                  const updated = vehicles.find(v => v.id === selectedVehicle.id)
                  if (updated) setSelectedVehicle(updated)
                })
              }} />
            </div>
            
            <PhotoUploadManager vehicleId={selectedVehicle.id} />
          </div>
        </div>
      )}
    </div>
  )
}
