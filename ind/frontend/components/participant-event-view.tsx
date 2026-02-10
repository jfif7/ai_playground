"use client"

import { CalendarDays, Clock, Leaf } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SubmissionForm } from "@/components/submission-form"
import { useActiveEvent } from "@/lib/use-api"

export function ParticipantEventView() {
  const { data: event, isLoading, error } = useActiveEvent()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading event...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            No Active Event
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There is no event currently open for registration. Please check back
            later.
          </p>
        </div>
      </div>
    )
  }

  const startDate = parseISO(event.startDate)
  const endDate = parseISO(event.endDate)
  const now = new Date()
  const daysRemaining = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Event Header */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground">
                  {event.name}
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-primary/10 text-primary border-0"
                  >
                    <CalendarDays className="h-3 w-3" />
                    {format(startDate, "MMM d, yyyy")} -{" "}
                    {format(endDate, "MMM d, yyyy")}
                  </Badge>
                  {daysRemaining > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {daysRemaining} days remaining
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        {event.description && (
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Submission Form */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            Submit Your Proposal
          </h2>
          <Separator className="flex-1" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <SubmissionForm
              event={event}
              onSuccess={() => {
                // Form resets handled inside
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
