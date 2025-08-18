import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please check your .env file.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface Vehicle {
  id: string
  stock_number: string
  year: number
  make: string
  model: string
  trim: string
  mileage: number
  price: number
  exterior_color: string
  interior_color: string
  transmission: string
  engine: string
  features: string[]
  description: string
  status: 'active' | 'sold' | 'removed'
  assigned_salesperson: string
  created_at: string
  updated_at: string
}

export interface VehiclePhoto {
  id: string
  vehicle_id: string
  photo_type: 'front_corner' | 'rear_corner' | 'driver_side' | 'passenger_side' | 'interior_front' | 'interior_rear' | 'damage' | 'undercarriage' | 'additional'
  photo_url: string
  caption: string
  sort_order: number
  uploaded_at: string
}

export interface CustomerInquiry {
  id: string
  vehicle_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string
  assigned_salesperson: string
  created_at: string
}
