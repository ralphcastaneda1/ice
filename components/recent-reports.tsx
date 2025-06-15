"use client"

import { useState, useEffect } from "react"
import { getRecentReports } from "@/lib/reports"
import type { Report } from "@/lib/types"
import { format, formatDistanceToNow } from "date-fns"
import { MapPin, Clock, AlertCircle, RefreshCw, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageGallery from "./image-gallery"

export default function RecentReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecentReports = async () => {
    try {
      setError(null)
      const data = await getRecentReports(5)
      setReports(data || [])
    } catch (error) {
      console.error("Failed to load recent reports:", error)
      setError("Failed to load reports")
      setReports([])
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadRecentReports()
    setIsRefreshing(false)
  }

  useEffect(() => {
    async function initialLoad() {
      setIsLoading(true)
      await loadRecentReports()
      setIsLoading(false)
    }

    initialLoad()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadRecentReports, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6">Recent Reports</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066cc]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#1d1d1f]">Recent Reports</h2>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="ghost"
          size="sm"
          className="text-[#86868b] hover:text-[#1d1d1f]"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="text-center py-8 text-red-600">
          <AlertCircle className="mx-auto h-8 w-8 mb-3" />
          <p>{error}</p>
          <Button onClick={handleRefresh} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {!error && reports.length === 0 ? (
        <div className="text-center py-8 text-[#86868b]">
          <AlertCircle className="mx-auto h-8 w-8 mb-3" />
          <p>No recent reports available.</p>
          <p className="text-sm mt-2">Submit a new report to see it appear here!</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {reports.map((report) => (
            <li key={report.id} className="border-b border-[#e5e5e7] pb-6 last:border-0">
              <div className="font-medium text-[#1d1d1f] flex items-center">
                {report.location}
                {report.images && report.images.length > 0 && (
                  <div className="ml-2 flex items-center text-[#0066cc]">
                    <Camera className="h-3 w-3 mr-1" />
                    <span className="text-xs">{report.images.length}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-sm text-[#86868b] mt-2">
                <Clock className="h-3 w-3 mr-1" />
                <span title={format(new Date(report.timestamp), "PPP p")}>
                  {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                </span>
              </div>

              <div className="flex items-center text-sm text-[#86868b] mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}
                </span>
              </div>

              <p className="text-sm mt-3 line-clamp-2 text-[#1d1d1f]">{report.description}</p>

              {/* Image Gallery */}
              {report.images && report.images.length > 0 && (
                <ImageGallery images={report.images} alt={`${report.location} report`} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
