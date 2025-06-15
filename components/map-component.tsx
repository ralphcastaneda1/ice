"use client"

import { useEffect, useRef, useState } from "react"
import type { Report } from "@/lib/types"
import { format } from "date-fns"

// LA coordinates
const LA_CENTER = { lat: 34.0522, lng: -118.2437 }

interface MapComponentProps {
  reports: Report[]
  showHeatmap: boolean
}

export default function MapComponent({ reports, showHeatmap }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  // Get color based on intensity with more vibrant Apple-style colors
  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 0.2) return "#007AFF" // Apple Blue
    if (intensity <= 0.4) return "#30D158" // Apple Green
    if (intensity <= 0.6) return "#FF9F0A" // Apple Orange
    if (intensity <= 0.8) return "#FF6B35" // Apple Red-Orange
    return "#FF453A" // Apple Red
  }

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    const tryInitMap = () => {
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.visualization) {
        initMap()
      } else {
        console.log("Google Maps API not yet loaded, retrying...")
        setTimeout(tryInitMap, 100)
      }
    }

    const initMap = () => {
      const google = (window as any).google

      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: LA_CENTER,
        zoom: 9,
        disableDefaultUI: true, // Disable default UI to add custom controls
        zoomControl: true, // Enable zoom control
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
        styles: [
          // Minimalistic map style, similar to Apple Maps light mode
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#1d1d1f" }], // Make city labels visible and dark
          },
          {
            featureType: "administrative.neighborhood",
            elementType: "labels.text.fill",
            stylers: [{ color: "#86868b" }], // Keep neighborhood labels slightly lighter
          },
          {
            featureType: "administrative",
            elementType: "labels",
            stylers: [{ visibility: "on" }], // Ensure administrative labels are generally on
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f7" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
        ],
      })

      setMap(mapInstance)
      infoWindowRef.current = new google.maps.InfoWindow()

      // Initialize heatmap layer
      const heatmap = new google.maps.visualization.HeatmapLayer({
        map: mapInstance,
        data: [], // Will be updated later
        radius: 20, // Adjust radius for desired heatmap spread
        opacity: 0.8,
        gradient: [
          "rgba(0, 122, 255, 0)", // Blue (transparent)
          "rgba(0, 122, 255, 0.7)", // Blue
          "rgba(48, 209, 88, 0.7)", // Green
          "rgba(255, 159, 10, 0.7)", // Orange
          "rgba(255, 107, 53, 0.7)", // Red-Orange
          "rgba(255, 69, 58, 0.7)", // Red
          "rgba(191, 10, 10, 0.8)", // Darker Red
        ],
      })
      setHeatmapLayer(heatmap)
    }

    tryInitMap()

    return () => {
      // Clean up map instance if needed (though Google Maps handles much of this)
      if (map) {
        // map.setMap(null); // This might not be necessary or desired
      }
    }
  }, [])

  // Update markers and heatmap data when reports or showHeatmap changes
  useEffect(() => {
    console.log("MapComponent useEffect triggered.")
    console.log("Reports received:", reports)
    console.log("Show Heatmap:", showHeatmap)

    if (!map || !heatmapLayer) return

    // Close any open info window before clearing markers
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
    }

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([]) // This state update is fine as it's not in the dependency array anymore

    if (showHeatmap) {
      // Show heatmap, hide markers
      heatmapLayer.setMap(map)
      const heatMapData = reports.map((report) => ({
        location: new google.maps.LatLng(report.latitude, report.longitude),
        weight: 1, // Each report contributes equally to intensity
      }))
      heatmapLayer.setData(heatMapData)
      console.log("Heatmap data set:", heatMapData)
    } else {
      // Hide heatmap, show markers
      heatmapLayer.setMap(null)

      // Group reports by proximity for better visualization
      const processedReports = new Set<string>()
      const newMarkers: google.maps.Marker[] = []

      reports.forEach((report) => {
        const reportKey = `${report.latitude.toFixed(4)},${report.longitude.toFixed(4)}`
        if (processedReports.has(reportKey)) return

        // Find nearby reports
        const nearbyReports = reports.filter((r) => {
          const distance = Math.sqrt(
            Math.pow(r.latitude - report.latitude, 2) + Math.pow(r.longitude - report.longitude, 2),
          )
          return distance <= 0.005 // ~500m radius
        })

        nearbyReports.forEach((r) => {
          processedReports.add(`${r.latitude.toFixed(4)},${r.longitude.toFixed(4)}`)
        })

        const count = nearbyReports.length
        const intensity = Math.min(count / 5, 1) // Normalize to 0-1
        const color = getIntensityColor(intensity)
        const size = Math.max(24, Math.min(count * 8, 64)) // 24px to 64px

        const hasImages = report.images && report.images.length > 0

        const markerDiv = document.createElement("div")
        markerDiv.className = "apple-marker"
        markerDiv.style.width = `${size}px`
        markerDiv.style.height = `${size}px`
        markerDiv.style.fontSize = `${Math.max(11, size * 0.35)}px`
        markerDiv.style.backgroundColor = color
        markerDiv.innerHTML = `
          ${count > 1 ? count : ""}
          ${hasImages ? `<div class="camera-icon" style="color: ${color};"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg></div>` : ""}
        `

        const marker = new google.maps.Marker({
          position: { lat: report.latitude, lng: report.longitude },
          map: map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerDiv.outerHTML)}`,
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(size / 2, size / 2),
          },
          title: report.location,
        })

        marker.addListener("click", () => {
          const intensityLevel =
            intensity > 0.8
              ? "Very High"
              : intensity > 0.6
                ? "High"
                : intensity > 0.4
                  ? "Medium"
                  : intensity > 0.2
                    ? "Low"
                    : "Very Low"

          const contentString = `
            <div class="apple-popup-content">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${color}"></div>
                <h3 class="text-lg font-semibold text-gray-900">${report.location}</h3>
                ${hasImages ? `<div class="ml-2 flex items-center text-blue-600"><svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg><span class="text-sm">${report.images.length}</span></div>` : ""}
              </div>
              <p class="text-sm text-gray-600 mb-3">${format(new Date(report.timestamp), "EEEE, MMMM d 'at' h:mm a")}</p>
              <p class="text-sm text-gray-800 mb-4 leading-relaxed">${report.description}</p>
              
              ${
                count > 1
                  ? `
                <div class="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div class="text-sm font-semibold text-gray-900 mb-2">Area Summary</div>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-gray-600">Total Reports:</span>
                      <span class="font-semibold text-gray-900 ml-1">${count}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Activity:</span>
                      <span class="font-semibold ml-1" style="color: ${color};">${intensityLevel}</span>
                    </div>
                  </div>
                </div>
              `
                  : ""
              }
              
              <div class="text-xs text-gray-500 pt-3 border-t border-gray-200">
                <div class="mb-1">📍 ${Number(report.latitude).toFixed(4)}, ${Number(report.longitude).toFixed(4)}</div>
              </div>
              
              ${
                nearbyReports.length > 1
                  ? `
                <div class="mt-3 pt-3 border-t border-gray-200">
                  <div class="text-sm font-medium text-gray-900 mb-2">Other reports nearby</div>
                  <div class="space-y-2 max-h-24 overflow-y-auto">
                    ${nearbyReports
                      .filter((r) => r.id !== report.id)
                      .slice(0, 2)
                      .map(
                        (r) => `
                      <div class="text-xs">
                        <div class="font-medium text-gray-800 flex items-center">
                          ${r.location}
                          ${r.images && r.images.length > 0 ? `<div class="ml-2 flex items-center text-blue-600"><svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg><span class="text-xs">${r.images.length}</span></div>` : ""}
                        </div>
                        <div class="text-gray-500">${format(new Date(r.timestamp), "MMM d, h:mm a")}</div>
                      </div>
                    `,
                      )
                      .join("")}
                    ${nearbyReports.length > 3 ? `<div class="text-xs text-gray-500 italic">...and ${nearbyReports.length - 3} more</div>` : ""}
                  </div>
                </div>
              `
                  : ""
              }
              ${
                hasImages
                  ? `
                <div class="mt-3 pt-3 border-t border-gray-200">
                  <div class="text-sm font-medium text-gray-900 mb-2">Photos (${report.images!.length})</div>
                  <div class="grid ${report.images!.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2">
                    ${report
                      .images!.slice(0, 4)
                      .map(
                        (imageUrl, index) => `
                      <div class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                        <img src="${imageUrl}" alt="Report image ${index + 1}" class="w-full h-full object-cover" />
                        ${index === 3 && report.images!.length > 4 ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center"><span class="text-white font-semibold text-sm">+${report.images!.length - 4}</span></div>` : ""}
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          `
          infoWindowRef.current?.setContent(contentString)
          infoWindowRef.current?.open(map, marker)
        })
        newMarkers.push(marker)
      })
      setMarkers(newMarkers)
    }
  }, [map, reports, showHeatmap, heatmapLayer]) // Removed 'markers' from dependency array

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-lg" style={{ minHeight: "600px" }} />

      {/* Google Maps Attribution (usually handled by the map itself, but can add custom if needed) */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg">
        Map data © Google
      </div>
    </div>
  )
}
