'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import Header from '@/components/Header'
import StatsCards from '@/components/StatsCards'
import DateContainer from '@/components/DateContainer'
import BusList from '@/components/BusList'
import BoxCountBadges from '@/components/BoxCountBadges'

export default function Dashboard() {
  const [driverData, setDriverData] = useState(null)
  const [busData, setBusData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busError, setBusError] = useState(null)
  const [selectedBus, setSelectedBus] = useState('All')
  const [totalBoxes, setTotalBoxes] = useState(0)

  const storeLivecbecargo = async (data) => {
    try {
      const livecbecargoRef = doc(db, 'Livecbecargo', data.date)
      await setDoc(livecbecargoRef, {
        driverName: data.driverName,
        total: data.total,
        diesel: data.diesel,
        date: data.date
      })
    } catch (err) {
      setError('Failed to store Livecbecargo data. Please try again.')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverSheetRef = collection(db, 'driversheets')
        const busDetailsRef = collection(db, 'busdetails')

        const [driverSnapshot, busSnapshot] = await Promise.all([
          getDocs(driverSheetRef),
          getDocs(busDetailsRef)
        ])

        const driverDoc = driverSnapshot.docs[0]?.data()
        if (!driverDoc) {
          throw new Error('No driver data found')
        }

        const total = driverDoc.total || 0
        
        setDriverData({
          ...driverDoc,
          total: total
        })

        await storeLivecbecargo({
          ...driverDoc,
          total: total
        })

        const busDetails = busSnapshot.docs.map(doc => doc.data())
        if (busDetails.length === 0) {
          setBusError('No bus data found. Please check your connection and try again.')
        } else {
          setBusData(busDetails)
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const filteredBusData = selectedBus === 'All' ? busData : busData.filter(bus => bus.bus === selectedBus)
  const busOptions = ['All', ...new Set(busData.map(bus => bus.bus).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <StatsCards 
          totalArticles={driverData.total || 0}
          diesel={driverData?.diesel || 0}
          startTime={driverData?.vehicleStartTime || 'N/A'}
        />
        <DateContainer date={driverData?.date || 'N/A'} />
        <BoxCountBadges busData={filteredBusData} setTotalBoxes={setTotalBoxes} />
        
        <div className="flex justify-end mb-4">
          <div className="flex items-center">
            <label htmlFor="busFilter" className="text-sm text-gray-700 mr-2">
              Filter:
            </label>
            <select
              id="busFilter"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
            >
              {busOptions.map((option) => (
                <option key={option} value={option} className="py-1">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {busError && <p className="mt-2 text-sm text-red-600">{busError}</p>}

        <BusList busData={filteredBusData} />
      </main>
    </div>
  )
}