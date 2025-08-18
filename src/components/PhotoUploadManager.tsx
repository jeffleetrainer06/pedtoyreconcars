import { useState, useEffect } from 'react'
import { supabase, VehiclePhoto } from '../lib/supabase'
import { Upload, X, Camera } from 'lucide-react'

interface PhotoUploadManagerProps {
  vehicleId: string
}

const PHOTO_TYPES = [
  { id: 'front_corner', label: '1. Passenger Front Corner', required: true },
  { id: 'driver_side', label: '2. Driver\'s Front Corner', required: true },
  { id: 'rear_corner', label: '3. Driver\'s Rear Corner', required: true },
  { id: 'passenger_side', label: '4. Passenger\'s Rear Corner', required: true },
  { id: 'interior_front', label: '5. Interior - Front Seats', required: true },
  { id: 'interior_rear', label: '6. Interior - Rear Seats', required: true },
  { id: 'damage', label: '7. Damage/Scratches/Wear', required: false },
  { id: 'undercarriage', label: 'Undercarriage', required: false },
  { id: 'additional', label: 'Additional', required: false }
] as const

function VehiclePhotoUpload({ vehicleId, slot, onUploadComplete }: { 
  vehicleId: string, 
  slot: string, 
  onUploadComplete: () => void 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      if (!supabase) {
        alert('Database connection not available. Please check your internet connection and refresh the page.');
        return;
      }

      const fileName = `${slot}_${Date.now()}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        alert('Storage upload failed: ' + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName);
      
      const { error: deleteError } = await supabase
        .from('vehicle_photos')
        .delete()
        .eq('vehicle_id', vehicleId)
        .eq('photo_type', slot)
      
      const { error: dbError } = await supabase
        .from('vehicle_photos')
        .insert([{
          vehicle_id: vehicleId,
          photo_type: slot,
          photo_url: urlData?.publicUrl || '',
          sort_order: PHOTO_TYPES.findIndex(type => type.id === slot)
        }])

      if (dbError) {
        alert('Database error: ' + dbError.message);
        return;
      }

      alert('Photo uploaded successfully!');
      setFile(null);
      onUploadComplete();
    } catch (error) {
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors">
      <div className="text-center">
        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {slot.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </label>
        {file && (
          <div className="mb-2 text-xs text-gray-600">
            Selected: {file.name}
          </div>
        )}
        <input 
          type="file" 
          onChange={handleFileSelect}
          accept="image/*"
          capture="environment"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 mb-3"
        />
        <button 
          onClick={handleUpload} 
          disabled={uploading || !file}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </div>
  );
}

export function PhotoUploadManager({ vehicleId }: PhotoUploadManagerProps) {
  const [photos, setPhotos] = useState<VehiclePhoto[]>([])

  useEffect(() => {
    fetchPhotos()
  }, [vehicleId])

  async function fetchPhotos() {
    const { data } = await supabase
      .from('vehicle_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('sort_order')
    
    setPhotos(data || [])
  }

  async function deletePhoto(photoId: string, photoUrl: string) {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        const urlParts = photoUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        if (fileName) {
          await supabase.storage
            .from('vehicle-photos')
            .remove([fileName])
        }

        await supabase
          .from('vehicle_photos')
          .delete()
          .eq('id', photoId)

        fetchPhotos()
      } catch (error) {
        console.error('Error deleting photo:', error)
        alert('Error deleting photo. Please try again.')
      }
    }
  }

  const getPhotosForType = (type: string) => {
    return photos.filter(p => p.photo_type === type)
  }

  return (
    <div className="space-y-6">
      {PHOTO_TYPES.map((type) => {
        const typePhotos = getPhotosForType(type.id)

        return (
          <div key={type.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                {type.label}
                {type.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <span className="text-sm text-gray-500">
                {typePhotos.length} photo{typePhotos.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {typePhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.photo_url}
                    alt={type.label}
                    className="w-full h-24 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    onClick={() => deletePhoto(photo.id, photo.photo_url)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-75 hover:opacity-100 transition-opacity shadow-md"
                    title="Delete this photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <VehiclePhotoUpload 
              vehicleId={vehicleId} 
              slot={type.id} 
              onUploadComplete={fetchPhotos}
            />
          </div>
        )
      })}
    </div>
  )
}
