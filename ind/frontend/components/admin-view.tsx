"use client"

import { CalendarDays, ClipboardList, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminEvents } from "@/components/admin-events"
import { AdminSubmissions } from "@/components/admin-submissions"
import { AdminUsers } from "@/components/admin-users"

export function AdminView() {
  return (
    <Tabs defaultValue="events" className="w-full">
      <TabsList className="grid w-full max-w-lg grid-cols-3">
        <TabsTrigger value="events" className="gap-1.5">
          <CalendarDays className="h-4 w-4" />
          Events
        </TabsTrigger>
        <TabsTrigger value="submissions" className="gap-1.5">
          <ClipboardList className="h-4 w-4" />
          All Submissions
        </TabsTrigger>
        <TabsTrigger value="users" className="gap-1.5">
          <Users className="h-4 w-4" />
          Users
        </TabsTrigger>
      </TabsList>
      <TabsContent value="events" className="mt-6">
        <AdminEvents />
      </TabsContent>
      <TabsContent value="submissions" className="mt-6">
        <AdminSubmissions />
      </TabsContent>
      <TabsContent value="users" className="mt-6">
        <AdminUsers />
      </TabsContent>
    </Tabs>
  )
}
