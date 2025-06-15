"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { getReports } from "@/lib/reports"
import type { Report } from "@/lib/types"
import { DateRangePicker } from "@/components/date-range-picker"
import { MapPin, Layers, BarChart3, TrendingUp } from "lucide-react"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
        <p className="text-[#86868b]">Loading map...</p>
      </div>
    </div>
  ),
})

export default function ReportMap() {
  const [reports, setReports] = useState<Report[]>([])
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(true)

  // Calculate activity statistics
  const getActivityStats = () => {
    // Filter out reports from future dates
    const now = new Date()
    const validReports = reports.filter(report => {
      const reportDate = new Date(report.timestamp)
      return reportDate <= now
    })

    if (validReports.length === 0) return { hotspots: 0, totalReports: 0, avgIntensity: 0 }

    const gridSize = 0.01
    const locationGroups = new Map()

    validReports.forEach((report) => {
      const gridKey = `${Math.round(report.latitude / gridSize)},${Math.round(report.longitude / gridSize)}`
      if (!locationGroups.has(gridKey)) {
        locationGroups.set(gridKey, [])
      }
      locationGroups.get(gridKey).push(report)
    })

    const hotspots = Array.from(locationGroups.values()).filter((group) => group.length >= 2).length
    const totalReports = validReports.length
    const avgIntensity = Math.round(
      (Array.from(locationGroups.values()).reduce((sum, group) => sum + group.length, 0) / locationGroups.size) * 10,
    )

    return { hotspots, totalReports, avgIntensity }
  }

  const stats = getActivityStats()

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getReports(dateRange.from, dateRange.to)
        setReports(data || [])
      } catch (error) {
        console.error("Failed to load reports:", error)
        setError("Failed to load map data")
        setReports([])
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [dateRange])

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6 border-b border-[#e5e5e7]">
        <div className="flex items-center justify-between mb-4">
          <div className="font-extralight">
            <h2 className="text-xl text-[#1d1d1f] font-extralight">ICE Sighting Map - Greater Los Angeles</h2>
            <p className="text-sm text-[#86868b] mt-1">
              Intensity-based heatmap showing activity concentration by report density
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors flex items-center font-extralight ${
                showHeatmap ? "bg-[#0066cc] text-white" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5e7]"
              }`}
            >
              <Layers className="w-4 h-4 mr-1" />
              {showHeatmap ? "Hide" : "Show"} Heatmap
            </button>
          </div>
        </div>

        {/* Activity Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-[#f5f5f7] rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BarChart3 className="w-4 h-4 text-[#0066cc] mr-1" />
              <span className="text-lg font-extralight text-[#1d1d1f]">{stats.totalReports}</span>
            </div>
            <div className="text-xs text-[#86868b]">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-[#ea580c] mr-1" />
              <span className="text-lg font-extralight text-[#1d1d1f]">{stats.hotspots}</span>
            </div>
            <div className="text-xs text-[#86868b]">Activity Hotspots</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4 text-[#dc2626] mr-1" />
              <span className="text-lg font-extralight text-[#1d1d1f]">{stats.avgIntensity}%</span>
            </div>
            <div className="text-xs text-[#86868b]">Avg Intensity</div>
          </div>
        </div>

        <div className="mt-6">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      <div className="h-[600px] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
              <p className="text-[#86868b]">Loading reports...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-sm text-[#86868b]">Using fallback map data</p>
            </div>
          </div>
        )}

        <MapComponent reports={reports} showHeatmap={showHeatmap} />
      </div>

      {/* Enhanced Map legend and controls */}
      <div className="p-4 bg-[#f5f5f7] border-t border-[#e5e5e7]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-extralight text-[#1d1d1f]">Intensity-Based Heatmap Legend</div>
          <span className="text-xs text-[#86868b]">{stats.totalReports} reports analyzed</span>
        </div>

        <div className="grid grid-cols-2 gap-6 text-xs text-[#86868b]">
          <div className="space-y-2">
            <div className="font-extralight text-[#1d1d1f] mb-2">Heatmap Intensity</div>
            <div className="flex items-center">
              <div className="w-4 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Very Low (1 report)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-3 bg-green-500 rounded mr-2"></div>
              <span>Low (2 reports)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Medium (3-4 reports)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-3 bg-orange-500 rounded mr-2"></div>
              <span>High (5-6 reports)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-3 bg-red-600 rounded mr-2"></div>
              <span>Very High (7+ reports)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-extralight text-[#1d1d1f] mb-2">Map Features</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-red-600 mr-2"></div>
              <span>Concentric heat zones</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-800 rounded-full text-white text-center text-xs mr-2 flex items-center justify-center">
                #
              </div>
              <span>Clustered markers (count)</span>
            </div>
            <div className="text-xs text-[#86868b] mt-2 italic">
              * Intensity calculated by report density within 2km radius
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
