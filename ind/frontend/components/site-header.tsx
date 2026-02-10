"use client"

import { Leaf, Shield, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { role, setRole, isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-foreground">
              ESG Awards
            </h1>
            <p className="text-xs text-muted-foreground leading-none">
              Registration Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
            <Button
              variant={role === "participant" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRole("participant")}
              className="gap-1.5 text-xs"
            >
              <User className="h-3.5 w-3.5" />
              Participant
            </Button>
            <Button
              variant={isAdmin ? "default" : "ghost"}
              size="sm"
              onClick={() => setRole("admin")}
              className="gap-1.5 text-xs"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
