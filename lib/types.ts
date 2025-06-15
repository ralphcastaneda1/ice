export interface Report {
  id: string
  location: string
  latitude: number
  longitude: number
  description: string
  timestamp: string
  images?: string[] // Array of image URLs
}

export interface ReportInput {
  location: string
  latitude: number
  longitude: number
  description: string
  timestamp: string
  images?: File[] // Array of image files for upload
}
