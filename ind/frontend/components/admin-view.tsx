"use client"

import { CalendarDays, ClipboardList } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminEvents } from "@/components/admin-events"
import { AdminSubmissions } from "@/components/admin-submissions"

export function AdminView() {
  return (
    <Tabs defaultValue="events" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="events" className="gap-1.5">
          <CalendarDays className="h-4 w-4" />
          Events
        </TabsTrigger>
        <TabsTrigger value="submissions" className="gap-1.5">
          <ClipboardList className="h-4 w-4" />
          All Submissions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="events" className="mt-6">
        <AdminEvents />
      </TabsContent>
      <TabsContent value="submissions" className="mt-6">
        <AdminSubmissions />
      </TabsContent>
    </Tabs>
  )
}
