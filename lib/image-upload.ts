"use client"

import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase" // Import Firebase Storage instance

// Function to upload images to Firebase Storage
export async function uploadImages(images: File[]): Promise<string[]> {
  try {
    console.log(
      "uploadImages: Received images for upload:",
      images.map((img) => img.name),
    )

    const uploadedUrls: string[] = []

    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`
      const storageRef = ref(storage, `reports/${fileName}`)

      console.log(`uploadImages: Attempting to upload ${fileName}`)
      const snapshot = await uploadBytes(storageRef, image)
      console.log(`uploadImages: Uploaded ${fileName}. Snapshot metadata:`, snapshot.metadata)

      if (!snapshot.ref) {
        console.error(`uploadImages: Snapshot ref is null for ${fileName}. Snapshot:`, snapshot)
        throw new Error(`Firebase Storage: No reference found for uploaded file ${fileName}.`)
      }

      try {
        console.log(`uploadImages: Attempting to get download URL for ${fileName} from ref:`, snapshot.ref.fullPath)
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log(`uploadImages: Successfully got download URL for ${fileName}:`, downloadURL)
        uploadedUrls.push(downloadURL)
      } catch (urlError) {
        console.error(`uploadImages: Failed to get download URL for ${fileName}:`, urlError)
        // Re-throw the specific error from getDownloadURL to propagate it
        throw urlError
      }
    }

    console.log("uploadImages: All images processed. Successfully uploaded URLs:", uploadedUrls)
    return uploadedUrls
  } catch (error) {
    console.error("Error uploading images to Firebase Storage:", error)
    // Improved error logging to capture all properties of the error object
    console.error("Full Firebase Storage error payload:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    throw new Error("Failed to upload images to Firebase Storage")
  }
}

// Helper function to compress images before upload (client-side)
export function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Set crossOrigin to "anonymous" to avoid CORS issues when drawing images from other origins
      img.crossOrigin = "anonymous"

      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality,
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

async function uploadImage(file: File) {
  try {
    const storageRef = ref(storage, file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
