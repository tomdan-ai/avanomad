"use client"
import { Phone } from "@/components/Phone"
import { NavBar, Footer } from "@/components"

export default function USSDInterface() {
  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-muted/30 py-32">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Try Our USSD Interface</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Experience how Avanomad works on feature phones. Dial a USSD code (try *123#) to simulate the service.
          </p>
          <div className="flex items-center justify-center">
            <Phone />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}