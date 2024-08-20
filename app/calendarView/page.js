'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import CalendarView from '@/components/CalendarView'

export default function CalendarViewPage() {
  const [driverData, setDriverData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverSheetRef = collection(db, 'driversheets')
        const driverSnapshot = await getDocs(driverSheetRef)

        const driverDoc = driverSnapshot.docs[0]?.data()
        if (!driverDoc) {
          throw new Error('No driver data found')
        }
        setDriverData(driverDoc)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message || 'An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-black p-8 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-black p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white mt-28">
      <CalendarView driverName={driverData?.driverName || 'Unknown Driver'} />
    </div>
  )
}