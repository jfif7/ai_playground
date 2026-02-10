"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import {
  FileText,
  Pencil,
  Trash2,
  Loader2,
  ClipboardList,
} from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { SubmissionForm } from "@/components/submission-form"
import { deleteSubmission } from "@/lib/api"
import { useSubmissions, useActiveEvent } from "@/lib/use-api"
import type { Submission } from "@/lib/types"

export function SubmissionsList() {
  const { data: submissions, isLoading } = useSubmissions()
  const { data: activeEvent } = useActiveEvent()
  const [editSub, setEditSub] = useState<Submission | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await deleteSubmission(id)
      toast.success("Submission deleted")
      mutate("submissions")
      mutate("allSubmissions")
    } catch {
      toast.error("Failed to delete submission")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            No Submissions Yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You haven{"'"}t submitted any proposals yet. Go to the event page to
            submit your first idea.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {submissions.map((sub) => (
          <Card
            key={sub.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
            onClick={() => setEditSub(sub)}
          >
            <CardContent className="flex items-start justify-between gap-4 py-4">
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{sub.eventName}</span>
                  <span>{sub.organizationName}</span>
                  <span>{sub.esgDirectionName}</span>
                  {sub.fileName && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {sub.fileName}
                    </span>
                  )}
                  {sub.createdAt && (
                    <span>
                      {format(parseISO(sub.createdAt), "MMM d, yyyy")}
                    </span>
                  )}
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
                  <span className="sr-only">Edit submission</span>
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
                      <span className="sr-only">Delete submission</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{sub.ideaName}
                        &quot;? This action cannot be undone.
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editSub} onOpenChange={(open) => !open && setEditSub(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
            <DialogDescription>
              Modify your submission details below.
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
              The event associated with this submission is no longer active. Editing
              is disabled.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
