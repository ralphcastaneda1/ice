import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"


export const metadata = {
  title: "ICE Location Tracker",
  description: "Report and track ICE presence in your community",
  generator: "v0.dev",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Maps API */}
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCvRMQVrNFP5pcgSjLkwqGrhhMu5q7woG4&libraries=visualization`}
        ></script>
      </head>
      <body className="font-sf-pro">
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
