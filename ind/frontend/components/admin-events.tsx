"use client"

import { useState, type FormEvent } from "react"
import { format, parseISO } from "date-fns"
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CalendarDays,
  Loader2,
  LayoutDashboard,
} from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { OptionManager } from "@/components/option-manager"
import {
  createEvent,
  deleteEvent,
  hideEvent,
  createOrganization,
  createEsgDirection,
  createCategory,
} from "@/lib/api"
import {
  useAllEvents,
  useOrganizations,
  useEsgDirections,
  useCategories,
} from "@/lib/use-api"

export function AdminEvents() {
  const { data: events, isLoading } = useAllEvents()
  const { data: orgs = [], mutate: mutateOrgs } = useOrganizations()
  const { data: dirs = [], mutate: mutateDirs } = useEsgDirections()
  const { data: cats = [], mutate: mutateCats } = useCategories()

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedOrgIds, setSelectedOrgIds] = useState<number[]>([])
  const [selectedDirIds, setSelectedDirIds] = useState<number[]>([])
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([])
  const [creating, setCreating] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)

  function toggleId(list: number[], id: number): number[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  }

  function resetForm() {
    setName("")
    setDescription("")
    setStartDate("")
    setEndDate("")
    setSelectedOrgIds([])
    setSelectedDirIds([])
    setSelectedCatIds([])
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!name || !startDate || !endDate) {
      toast.error("Name, start date, and end date are required")
      return
    }
    setCreating(true)
    try {
      await createEvent({
        name,
        description,
        startDate,
        endDate,
        organizations: orgs.filter((o) => selectedOrgIds.includes(o.id)),
        esgDirections: dirs.filter((d) => selectedDirIds.includes(d.id)),
        categories: cats.filter((c) => selectedCatIds.includes(c.id)),
      })
      toast.success("Event created")
      mutate("allEvents")
      mutate("activeEvent")
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Failed to create event")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: number) {
    setActionId(id)
    try {
      await deleteEvent(id)
      toast.success("Event deleted")
      mutate("allEvents")
      mutate("activeEvent")
    } catch {
      toast.error("Failed to delete event")
    } finally {
      setActionId(null)
    }
  }

  async function handleToggleVisibility(id: number, currentHidden: boolean) {
    setActionId(id)
    try {
      await hideEvent(id, !currentHidden)
      toast.success(currentHidden ? "Event visible" : "Event hidden")
      mutate("allEvents")
      mutate("activeEvent")
    } catch {
      toast.error("Failed to update event visibility")
    } finally {
      setActionId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Event Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage ESG award events
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {(!events || events.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">No Events</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first ESG award event to get started.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {events?.map((evt) => {
          const isActive = evt.active && !evt.hidden
          return (
            <Card
              key={evt.id}
              className={`transition-all ${evt.hidden ? "opacity-60" : ""}`}
            >
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {evt.name}
                    </h4>
                    {isActive && (
                      <Badge className="bg-primary text-primary-foreground border-0">
                        Active
                      </Badge>
                    )}
                    {evt.hidden && (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </div>
                  {evt.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {evt.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {format(parseISO(evt.startDate), "MMM d, yyyy")} -{" "}
                    {format(parseISO(evt.endDate), "MMM d, yyyy")}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleToggleVisibility(evt.id, !!evt.hidden)
                    }
                    disabled={actionId === evt.id}
                  >
                    {actionId === evt.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : evt.hidden ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {evt.hidden ? "Show event" : "Hide event"}
                    </span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete event</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{evt.name}
                          &quot;? This will permanently remove the event.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(evt.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Create Event Dialog */}
      <Dialog
        open={showCreate}
        onOpenChange={(open) => {
          if (!open) resetForm()
          setShowCreate(open)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Set up a new ESG award event with its details and available
              options.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="eventName" className="text-sm font-medium text-foreground">
                Event Name
              </Label>
              <Input
                id="eventName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ESG Awards 2026"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="eventDesc" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="eventDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event and its goals"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="endDate" className="text-sm font-medium text-foreground">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <Separator />

            <OptionManager
              label="Organization"
              allOptions={orgs}
              selectedIds={selectedOrgIds}
              onToggle={(id) =>
                setSelectedOrgIds(toggleId(selectedOrgIds, id))
              }
              onAdd={async (data) => {
                await createOrganization(data)
                mutateOrgs()
              }}
            />

            <OptionManager
              label="ESG Direction"
              allOptions={dirs}
              selectedIds={selectedDirIds}
              onToggle={(id) =>
                setSelectedDirIds(toggleId(selectedDirIds, id))
              }
              onAdd={async (data) => {
                await createEsgDirection(data)
                mutateDirs()
              }}
            />

            <OptionManager
              label="Award Category"
              allOptions={cats}
              selectedIds={selectedCatIds}
              onToggle={(id) =>
                setSelectedCatIds(toggleId(selectedCatIds, id))
              }
              onAdd={async (data) => {
                await createCategory({
                  name: data.name,
                  file_prefix: data.file_prefix || "",
                })
                mutateCats()
              }}
              showFilePrefix
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreate(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Event
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
