"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Upload, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
  maxSizePerImage?: number // in MB
}

export default function ImageUpload({ images, onImagesChange, maxImages = 3, maxSizePerImage = 5 }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please upload only image files"
    }

    // Check file size (convert MB to bytes)
    if (file.size > maxSizePerImage * 1024 * 1024) {
      return `Image size must be less than ${maxSizePerImage}MB`
    }

    return null
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const newFiles = Array.from(fileList)
    const validFiles: File[] = []
    let errorMessage = ""

    // Check total number of images
    if (images.length + newFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    // Validate each file
    for (const file of newFiles) {
      const validation = validateFile(file)
      if (validation) {
        errorMessage = validation
        break
      }
      validFiles.push(file)
    }

    if (errorMessage) {
      setError(errorMessage)
      return
    }

    setError(null)
    onImagesChange([...images, ...validFiles])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    setError(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-[#0066cc] bg-blue-50" : "border-[#d2d2d7] hover:border-[#0066cc] hover:bg-[#f5f5f7]"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center">
              <Camera className="h-6 w-6 text-[#0066cc]" />
            </div>
          </div>

          <div>
            <p className="text-sm font-extralight text-[#1d1d1f]">Add photos to your report</p>
            <p className="text-xs text-[#86868b] mt-1">Drag and drop images here, or click to browse</p>
          </div>

          <Button
            type="button"
            onClick={openFileDialog}
            variant="outline"
            size="sm"
            className="border-[#d2d2d7] hover:bg-[#f5f5f7]"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Images
          </Button>

          <p className="text-xs text-[#86868b]">
            Maximum {maxImages} images, up to {maxSizePerImage}MB each
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-extralight text-[#1d1d1f]">
            Selected Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-[#f5f5f7] border border-[#e5e5e7]">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Upload preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* File info */}
                <div className="mt-1 text-xs text-[#86868b] truncate">{file.name}</div>
                <div className="text-xs text-[#86868b]">{(file.size / 1024 / 1024).toFixed(1)}MB</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
