'use client'

import { useState, useEffect } from 'react'

interface Property {
  id?: number
  location?: string
  price?: number
  description?: string
  [key: string]: any
}

interface PropertiesFormProps {
  propertyId?: number
}

export default function PropertiesForm({ propertyId }: PropertiesFormProps) {
  const [property, setProperty] = useState<Property>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (propertyId) {
      // Fetch property data for editing
      fetchProperty(propertyId)
    }
  }, [propertyId])

  const fetchProperty = async (id: number) => {
    try {
      setLoading(true)
      // Add fetch logic here when API is available
      console.log('Fetching property with ID:', id)
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Add submit logic here
      console.log('Submitting property:', property)
    } catch (error) {
      console.error('Error submitting property:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {propertyId ? 'Edit Property' : 'Add Property'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={property.location || ''}
            onChange={(e) => setProperty({ ...property, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter property location"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={property.price || ''}
            onChange={(e) => setProperty({ ...property, price: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={property.description || ''}
            onChange={(e) => setProperty({ ...property, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter property description"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : propertyId ? 'Update Property' : 'Add Property'}
        </button>
      </form>
    </div>
  )
}