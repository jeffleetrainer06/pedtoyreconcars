import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { VehicleDetail } from './components/VehicleDetail'
import { AdminDashboard } from './components/AdminDashboard'
import { SalespersonUpload } from './components/SalespersonUpload'
import { DownloadProject } from './components/DownloadProject'

function App() {
  const [route, setRoute] = useState('/')
  const [vehicleId, setVehicleId] = useState<string | null>(null)

  useEffect(() => {
    // Simple hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/'
      
      if (hash.startsWith('/vehicle/')) {
        const id = hash.split('/')[2]
        setVehicleId(id)
        setRoute('/vehicle')
      } else {
        setRoute(hash)
        setVehicleId(null)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Initial route

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const renderContent = () => {
    switch (route) {
      case '/admin':
        return <AdminDashboard />
      case '/upload':
        return <SalespersonUpload />
      case '/download':
        return <DownloadProject />
      case '/vehicle':
        return vehicleId ? <VehicleDetail vehicleId={vehicleId} /> : <HomePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={route === '/admin'} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Pedersen Toyota</h3>
            <p className="text-gray-300 text-sm">
              Pre-Owned Vehicle Showcase • Quality Vehicles in Reconditioning
            </p>
            <p className="text-gray-400 text-xs mt-4">
              All vehicles shown are currently going through our reconditioning process.
              Availability subject to completion of safety and mechanical inspections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
