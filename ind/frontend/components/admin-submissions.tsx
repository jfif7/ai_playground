"use client"

import { useState, useMemo } from "react"
import { format, parseISO } from "date-fns"
import {
  FileText,
  Pencil,
  Trash2,
  Loader2,
  ClipboardList,
  Search,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SubmissionForm } from "@/components/submission-form"
import { deleteSubmission } from "@/lib/api"
import { useAllSubmissions, useActiveEvent, useAllEvents } from "@/lib/use-api"
import type { Submission } from "@/lib/types"

export function AdminSubmissions() {
  const { data: submissions, isLoading } = useAllSubmissions()
  const { data: activeEvent } = useActiveEvent()
  const { data: allEvents } = useAllEvents()
  const [editSub, setEditSub] = useState<Submission | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEvent, setFilterEvent] = useState<string>("all")

  const filtered = useMemo(() => {
    if (!submissions) return []
    return submissions.filter((sub) => {
      const matchesSearch =
        !searchTerm ||
        sub.ideaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEvent =
        filterEvent === "all" || sub.eventId === Number(filterEvent)
      return matchesSearch && matchesEvent
    })
  }, [submissions, searchTerm, filterEvent])

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await deleteSubmission(id)
      toast.success("Submission deleted")
      mutate("allSubmissions")
      mutate("submissions")
    } catch {
      toast.error("Failed to delete submission")
    } finally {
      setDeletingId(null)
    }
  }

  // Get unique events from submissions for filter
  const eventOptions = useMemo(() => {
    if (!allEvents) return []
    return allEvents
  }, [allEvents])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          All Submissions
        </h2>
        <p className="text-sm text-muted-foreground">
          View and manage submissions across all events
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by idea name, employee name or ID..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterEvent} onValueChange={setFilterEvent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {eventOptions.map((evt) => (
                <SelectItem key={evt.id} value={evt.id.toString()}>
                  {evt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No Submissions Found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || filterEvent !== "all"
                ? "Try adjusting your filters."
                : "No submissions have been made yet."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground">Idea</TableHead>
                      <TableHead className="text-foreground">Employee</TableHead>
                      <TableHead className="text-foreground">Organization</TableHead>
                      <TableHead className="text-foreground">ESG Direction</TableHead>
                      <TableHead className="text-foreground">Category</TableHead>
                      <TableHead className="text-foreground">Event</TableHead>
                      <TableHead className="text-foreground">File</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                      <TableHead className="text-right text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((sub) => (
                      <TableRow key={sub.id} className="cursor-pointer" onClick={() => setEditSub(sub)}>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="font-medium text-foreground truncate">
                              {sub.ideaName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {sub.ideaSummary}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-foreground">{sub.employeeName}</p>
                            <p className="text-xs text-muted-foreground">
                              {sub.employeeId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{sub.organizationName}</TableCell>
                        <TableCell className="text-sm">{sub.esgDirectionName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {sub.categoryName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sub.eventName}
                        </TableCell>
                        <TableCell>
                          {sub.fileName && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              {sub.fileName}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {sub.createdAt &&
                            format(parseISO(sub.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditSub(sub)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                >
                                  {deletingId === sub.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Submission
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Delete &quot;{sub.ideaName}&quot; by{" "}
                                    {sub.employeeName}? This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(sub.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Mobile card view */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((sub) => (
              <Card
                key={sub.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                onClick={() => setEditSub(sub)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {sub.ideaName}
                        </h4>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {sub.categoryName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {sub.ideaSummary}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          {sub.employeeName} ({sub.employeeId})
                        </span>
                        <span>{sub.organizationName}</span>
                        <span>{sub.esgDirectionName}</span>
                        <span>{sub.eventName}</span>
                      </div>
                    </div>
                    <div
                      className="flex shrink-0 items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditSub(sub)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            {deletingId === sub.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Submission
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete &quot;{sub.ideaName}&quot; by{" "}
                              {sub.employeeName}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(sub.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editSub} onOpenChange={(open) => !open && setEditSub(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
            <DialogDescription>
              Modify the submission details below.
            </DialogDescription>
          </DialogHeader>
          {editSub && activeEvent && (
            <SubmissionForm
              event={activeEvent}
              submission={editSub}
              onSuccess={() => setEditSub(null)}
              onCancel={() => setEditSub(null)}
            />
          )}
          {editSub && !activeEvent && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No active event. Editing requires an active event context.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
