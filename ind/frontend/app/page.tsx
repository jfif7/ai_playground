"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { SiteHeader } from "@/components/site-header"
import { ParticipantView } from "@/components/participant-view"
import { AdminView } from "@/components/admin-view"

function AppContent() {
  const { isAdmin } = useAuth()
  console.log("[v0] AppContent rendering, isAdmin:", isAdmin)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {isAdmin ? <AdminView /> : <ParticipantView />}
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
