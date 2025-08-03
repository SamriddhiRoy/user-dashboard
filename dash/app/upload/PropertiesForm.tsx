'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Property {
  id?: number
  zpid: string
  title: string
  description: string
  propdetails?: string
  price: number
  location: string
  imageUrl?: string
  bedrooms: number
  bathrooms: number
  sqft: number
  LotSize?: number
  HOADues?: number
  YearBuilt?: number
  GarageSqFt?: number
  BasementSqFt?: number
  propertyType: string
  isForSale: boolean
  basement?: string
  floorCovering?: string[]
  coolingType?: string[]
  heatingType?: string[]
  heatingFuel?: string[]
  rooms?: string[]
  indoorFeatures?: string[]
  buildingAmenities?: string[]
  architecturalStyle?: string
  exterior?: string[]
  outdoorAmenities?: string[]
  parking?: string[]
  roof?: string[]
  view?: string[]
}

interface PropertiesFormProps {
  propertyId?: number
}

export default function PropertiesForm({ propertyId }: PropertiesFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    propdetails: '',
    price: 0,
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 0,
    propertyType: '',
    isForSale: true,
    floorCovering: [],
    coolingType: [],
    heatingType: [],
    heatingFuel: [],
    rooms: [],
    indoorFeatures: [],
    buildingAmenities: [],
    exterior: [],
    outdoorAmenities: [],
    parking: [],
    roof: [],
    view: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch property data if editing
  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${propertyId}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        setFormData(data)
      } else {
        console.error('Failed to fetch property')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleArrayInputChange = (field: keyof Property, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.propertyType?.trim()) {
      newErrors.propertyType = 'Property type is required'
    }
    if (!formData.bedrooms || formData.bedrooms < 0) {
      newErrors.bedrooms = 'Bedrooms must be 0 or greater'
    }
    if (!formData.bathrooms || formData.bathrooms < 0) {
      newErrors.bathrooms = 'Bathrooms must be 0 or greater'
    }
    if (!formData.sqft || formData.sqft <= 0) {
      newErrors.sqft = 'Square footage must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      const url = propertyId ? `/api/properties/${propertyId}` : '/api/properties'
      const method = propertyId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard/properties')
      } else {
        const errorData = await response.json()
        console.error('Failed to save property:', errorData)
        alert('Failed to save property. Please try again.')
      }
    } catch (error) {
      console.error('Error saving property:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && propertyId) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {propertyId ? 'Edit Property' : 'Add New Property'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Property title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Property location"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Type *</label>
              <select
                value={formData.propertyType || ''}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.propertyType ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Property description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Additional Details</label>
            <textarea
              value={formData.propdetails || ''}
              onChange={(e) => handleInputChange('propdetails', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional property details"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms *</label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms || ''}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms *</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms || ''}
                onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Square Feet *</label>
              <input
                type="number"
                min="0"
                value={formData.sqft || ''}
                onChange={(e) => handleInputChange('sqft', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sqft ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.sqft && <p className="text-red-500 text-sm mt-1">{errors.sqft}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lot Size</label>
              <input
                type="number"
                min="0"
                value={formData.LotSize || ''}
                onChange={(e) => handleInputChange('LotSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year Built</label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.YearBuilt || ''}
                onChange={(e) => handleInputChange('YearBuilt', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">HOA Dues</label>
              <input
                type="number"
                min="0"
                value={formData.HOADues || ''}
                onChange={(e) => handleInputChange('HOADues', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Garage Sq Ft</label>
              <input
                type="number"
                min="0"
                value={formData.GarageSqFt || ''}
                onChange={(e) => handleInputChange('GarageSqFt', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Basement Sq Ft</label>
              <input
                type="number"
                min="0"
                value={formData.BasementSqFt || ''}
                onChange={(e) => handleInputChange('BasementSqFt', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isForSale || false}
                onChange={(e) => handleInputChange('isForSale', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">For Sale</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : propertyId ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  )
}