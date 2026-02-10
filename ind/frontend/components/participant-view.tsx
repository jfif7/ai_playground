"use client"

import { CalendarDays, ClipboardList } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParticipantEventView } from "@/components/participant-event-view"
import { SubmissionsList } from "@/components/submissions-list"

export function ParticipantView() {
  return (
    <Tabs defaultValue="event" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="event" className="gap-1.5">
          <CalendarDays className="h-4 w-4" />
          Current Event
        </TabsTrigger>
        <TabsTrigger value="submissions" className="gap-1.5">
          <ClipboardList className="h-4 w-4" />
          My Submissions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="event" className="mt-6">
        <ParticipantEventView />
      </TabsContent>
      <TabsContent value="submissions" className="mt-6">
        <SubmissionsList />
      </TabsContent>
    </Tabs>
  )
}
