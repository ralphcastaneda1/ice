"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { submitReport } from "@/lib/reports"
import { uploadImages } from "@/lib/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { MapPin, CheckCircle, AlertTriangle, Upload } from "lucide-react"
import ImageUpload from "./image-upload"

const formSchema = z.object({
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().min(10, { message: "Please provide a brief description" }).max(500),
})

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      latitude: 34.0522, // Default to LA coordinates
      longitude: -118.2437,
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSubmitError(null)
    setUploadProgress("")

    try {
      console.log("Submitting report:", values)
      console.log("Selected images before upload:", selectedImages) // LOG 1: Check selected images

      let imageUrls: string[] = []

      // Upload images if any are selected
      if (selectedImages.length > 0) {
        setUploadProgress(`Uploading ${selectedImages.length} image${selectedImages.length > 1 ? "s" : ""}...`)
        try {
          imageUrls = await uploadImages(selectedImages)
          setUploadProgress("Images uploaded successfully!")
          console.log("Image URLs received from uploadImages:", imageUrls) // LOG 2: Check URLs after upload
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError)
          setUploadProgress("Image upload failed, submitting report without images...")
          // Continue with report submission even if image upload fails
        }
      }

      const result = await submitReport({
        ...values,
        timestamp: new Date().toISOString(),
        images: imageUrls, // Pass the actual uploaded URLs, not the File objects
      })

      console.log("Report submitted successfully:", result)

      form.reset({
        location: "",
        latitude: 34.0522,
        longitude: -118.2437,
        description: "",
      })

      setSelectedImages([])
      setJustSubmitted(true)
      setUploadProgress("")

      toast({
        title: "Report submitted successfully",
        description: `Thank you for contributing to community awareness.${imageUrls.length > 0 ? ` ${imageUrls.length} image${imageUrls.length > 1 ? "s" : ""} uploaded.` : ""}`,
      })

      // Reset the success state after 3 seconds
      setTimeout(() => setJustSubmitted(false), 3000)
    } catch (error) {
      console.error("Submit error:", error)
      const errorMessage = error.message || "Failed to submit report"
      setSubmitError(errorMessage)
      setUploadProgress("")

      toast({
        title: "Error submitting report",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setUseCurrentLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude)
          form.setValue("longitude", position.coords.longitude)
          setUseCurrentLocation(false)
          toast({
            title: "Location obtained",
            description: "Your current location has been set.",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location error",
            description: "Could not get your current location. Please enter coordinates manually.",
            variant: "destructive",
          })
          setUseCurrentLocation(false)
        },
      )
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Please enter coordinates manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-xl text-[#1d1d1f] mb-6 font-extralight">Report ICE Sighting</h2>

      {justSubmitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 text-sm">Report submitted successfully!</span>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
          <div>
            <span className="text-red-800 text-sm font-medium">Submission Error</span>
            <p className="text-red-700 text-sm mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {uploadProgress && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <Upload className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-blue-800 text-sm">{uploadProgress}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1d1d1f]">Location Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Hollywood & Highland, Downtown LA"
                    {...field}
                    className="rounded-lg border-[#d2d2d7] focus:border-[#0066cc] focus:ring-[#0066cc]"
                  />
                </FormControl>
                <FormDescription className="text-[#86868b]">Enter a descriptive LA area location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1d1d1f]">Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="34.0522"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      className="rounded-lg border-[#d2d2d7] focus:border-[#0066cc] focus:ring-[#0066cc]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1d1d1f]">Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="-118.2437"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      className="rounded-lg border-[#d2d2d7] focus:border-[#0066cc] focus:ring-[#0066cc]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="button"
            onClick={getCurrentLocation}
            disabled={useCurrentLocation}
            className="w-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5e7] rounded-lg h-11"
          >
            {useCurrentLocation ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1d1d1f] mr-2"></span>
                Getting location...
              </span>
            ) : (
              <span className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Use my current location
              </span>
            )}
          </Button>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1d1d1f]">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what you observed (vehicle types, number of officers, activities, etc.)"
                    className="min-h-[120px] rounded-lg border-[#d2d2d7] focus:border-[#0066cc] focus:ring-[#0066cc]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-[#86868b]">
                  Provide details that would be helpful for others in the LA community
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#1d1d1f]">Photos (Optional)</label>
            <ImageUpload images={selectedImages} onImagesChange={setSelectedImages} maxImages={3} maxSizePerImage={5} />
            <p className="text-xs text-[#86868b]">
              Adding photos helps verify reports and provides valuable context for the community.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0066cc] hover:bg-[#0055b3] rounded-lg h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {uploadProgress || "Submitting..."}
              </span>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
