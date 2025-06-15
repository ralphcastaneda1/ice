"use server"

import type { Report, ReportInput } from "./types"
import { collection, getDocs, addDoc, query, orderBy, limit } from "firebase/firestore"
import { db } from "./firebase" // Import Firestore instance

// In a real Firebase setup, you'd also handle image uploads to Firebase Storage here
// For now, we'll keep the mock image URLs for demonstration.
import { uploadImages } from "./image-upload"

export async function getReports(from?: Date, to?: Date): Promise<Report[]> {
  try {
    // Placeholder for Firebase Firestore data fetching
    // You will replace this with actual Firestore queries.
    console.log("Fetching reports from Firebase...")

    const reportsCollection = collection(db, "reports")
    const q = query(reportsCollection, orderBy("timestamp", "desc"))

    // Add date range filtering if needed
    // if (from) {
    //   q = query(q, where("timestamp", ">=", from.toISOString()));
    // }
    // if (to) {
    //   q = query(q, where("timestamp", "<=", to.toISOString()));
    // }

    const querySnapshot = await getDocs(q)
    const reports: Report[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        timestamp: data.timestamp, // Assuming timestamp is stored as ISO string or Firebase Timestamp
        images: data.images || [], // Assuming images are stored as an array of URLs
      }
    })

    // If no data from Firebase, you might want to return an empty array or handle it.
    if (reports.length === 0) {
      console.log("No reports found in Firebase. Returning mock data for development.")
      // For development, you can temporarily return mock data if Firebase is empty
      // In production, you'd likely just return an empty array or handle no data.
      return [
        {
          id: "mock-1",
          location: "Downtown LA - Union Station",
          latitude: 34.056,
          longitude: -118.2368,
          description: "Multiple ICE vehicles observed in the parking structure. Officers checking IDs of passengers.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          images: ["https://picsum.photos/800/600?random=1001", "https://picsum.photos/800/600?random=1002"],
        },
        {
          id: "mock-2",
          location: "East LA - Whittier Blvd & Atlantic",
          latitude: 34.0242,
          longitude: -118.1739,
          description: "Checkpoint setup on major boulevard. Multiple unmarked vehicles conducting stops.",
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
          images: ["https://picsum.photos/800/600?random=1013", "https://picsum.photos/800/600?random=1014"],
        },
        {
          id: "mock-3",
          location: "Hollywood - Highland & Sunset",
          latitude: 34.1016,
          longitude: -118.339,
          description: "ICE presence near Metro station. Two vehicles with officers observing foot traffic.",
          timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
          images: [],
        },
        {
          id: "mock-4",
          location: "South LA - Crenshaw & Slauson",
          latitude: 33.9898,
          longitude: -118.3351,
          description: "Officers stationed outside community center during ESL classes.",
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          images: ["https://picsum.photos/800/600?random=1022"],
        },
        {
          id: "mock-5",
          location: "Koreatown - Wilshire & Western",
          latitude: 34.0619,
          longitude: -118.309,
          description: "ICE activity at apartment complex. Residents report officers asking for documentation.",
          timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
          images: [],
        },
      ]
    }

    return reports
  } catch (error) {
    console.error("Error fetching reports from Firebase:", error)
    // Log the full error object for more details
    console.error("Full Firebase Firestore error payload (getReports):", JSON.stringify(error, null, 2))
    return [
      {
        id: "fallback-1",
        location: "Fallback Data (Error)",
        latitude: 34.0522,
        longitude: -118.2437,
        description: "Fallback data due to Firebase error.",
        timestamp: new Date().toISOString(),
        images: [],
      },
    ]
  }
}

export async function submitReport(input: ReportInput): Promise<Report> {
  try {
    // Validate input
    if (!input.location?.trim()) {
      throw new Error("Location is required")
    }
    if (!input.description?.trim()) {
      throw new Error("Description is required")
    }
    if (!input.latitude || !input.longitude) {
      throw new Error("Valid coordinates are required")
    }

    // Placeholder for Firebase Firestore data submission
    console.log("Submitting report to Firebase...", input)

    const docRef = await addDoc(collection(db, "reports"), {
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      description: input.description,
      timestamp: input.timestamp || new Date().toISOString(),
      images: input.images, // Use passed image URLs
      createdAt: new Date().toISOString(),
    })

    const newReport: Report = {
      id: docRef.id,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      description: input.description,
      timestamp: input.timestamp || new Date().toISOString(),
      images: input.images,
    }

    console.log("Report submitted to Firebase:", newReport)
    return newReport
  } catch (error) {
    console.error("Error submitting report to Firebase:", error)
    throw new Error(`Failed to submit report: ${error.message}`)
  }
}

export async function getRecentReports(limitCount = 5): Promise<Report[]> {
  try {
    // Placeholder for Firebase Firestore data fetching (recent reports)
    console.log(`Fetching ${limitCount} recent reports from Firebase...`)

    const reportsCollection = collection(db, "reports")
    const q = query(reportsCollection, orderBy("timestamp", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    const reports: Report[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        timestamp: data.timestamp,
        images: data.images || [],
      }
    })

    if (reports.length === 0) {
      console.log("No recent reports found in Firebase. Returning mock data for development.")
      // For development, you can temporarily return mock data if Firebase is empty
      return [
        {
          id: "mock-recent-1",
          location: "Downtown LA - Union Station",
          latitude: 34.056,
          longitude: -118.2368,
          description: "Multiple ICE vehicles observed in the parking structure. Officers checking IDs of passengers.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          images: ["https://picsum.photos/800/600?random=1001"],
        },
        {
          id: "mock-recent-2",
          location: "East LA - Whittier Blvd & Atlantic",
          latitude: 34.0242,
          longitude: -118.1739,
          description: "Checkpoint setup on major boulevard. Multiple unmarked vehicles conducting stops.",
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
          images: ["https://picsum.photos/800/600?random=1013"],
        },
      ]
    }

    return reports
  } catch (error) {
    console.error("Error fetching recent reports from Firebase:", error)
    // Log the full error object for more details
    console.error("Full Firebase Firestore error payload (getRecentReports):", JSON.stringify(error, null, 2))
    return []
  }
}
