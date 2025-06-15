"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: string[]
  alt?: string
}

export default function ImageGallery({ images, alt = "Report image" }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Don't render anything if no images
  if (!images || images.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }

  return (
    <>
      {/* Image Grid */}
      <div className="mt-3">
        <div
          className={`grid gap-2 ${
            images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2"
          }`}
        >
          {images.slice(0, 4).map((imageUrl, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-[#f5f5f7] border border-[#e5e5e7] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 150px, 200px"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=200"
                }}
              />

              {/* Show count overlay for 4+ images */}
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">+{images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length > 0 && (
          <p className="text-xs text-[#86868b] mt-2">
            {images.length} image{images.length !== 1 ? "s" : ""} • Click to view full size
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  variant="ghost"
                  size="sm"
                  className="absolute right-16 z-10 bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`${alt} ${selectedImage + 1}`}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=800&width=800"
                }}
              />
            </div>

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} of {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
