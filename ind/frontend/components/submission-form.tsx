"use client"

import { useState, useRef, type FormEvent } from "react"
import { Upload, Info, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { createSubmission, updateSubmission } from "@/lib/api"
import { useOrganizations, useEsgDirections, useCategories } from "@/lib/use-api"
import type { EsgEvent, Submission } from "@/lib/types"

interface SubmissionFormProps {
  event: EsgEvent
  submission?: Submission | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function SubmissionForm({
  event,
  submission,
  onSuccess,
  onCancel,
}: SubmissionFormProps) {
  const { data: allOrgs } = useOrganizations()
  const { data: allDirs } = useEsgDirections()
  const { data: allCats } = useCategories()

  const orgs = event.organizations?.length
    ? event.organizations
    : allOrgs || []
  const dirs = event.esgDirections?.length
    ? event.esgDirections
    : allDirs || []
  const cats = event.categories?.length
    ? event.categories
    : allCats || []

  const [employeeName, setEmployeeName] = useState(submission?.employeeName || "")
  const [employeeId, setEmployeeId] = useState(submission?.employeeId || "")
  const [organizationId, setOrganizationId] = useState(
    submission?.organizationId?.toString() || ""
  )
  const [esgDirectionId, setEsgDirectionId] = useState(
    submission?.esgDirectionId?.toString() || ""
  )
  const [categoryId, setCategoryId] = useState(
    submission?.categoryId?.toString() || ""
  )
  const [ideaName, setIdeaName] = useState(submission?.ideaName || "")
  const [ideaSummary, setIdeaSummary] = useState(submission?.ideaSummary || "")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!submission

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (ideaName.length > 50) {
      toast.error("Idea name must be under 50 characters")
      return
    }
    if (ideaSummary.length > 300) {
      toast.error("Idea summary must be under 300 characters")
      return
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB")
      return
    }

    const selectedOrg = orgs.find((o) => o.id === Number(organizationId))
    const selectedDir = dirs.find((d) => d.id === Number(esgDirectionId))
    const selectedCat = cats.find((c) => c.id === Number(categoryId))

    const formData = new FormData()
    formData.append("employeeName", employeeName)
    formData.append("employeeId", employeeId)
    formData.append("organizationId", organizationId)
    formData.append("organizationName", selectedOrg?.name || "")
    formData.append("esgDirectionId", esgDirectionId)
    formData.append("esgDirectionName", selectedDir?.name || "")
    formData.append("categoryId", categoryId)
    formData.append("categoryName", selectedCat?.name || "")
    formData.append("ideaName", ideaName)
    formData.append("ideaSummary", ideaSummary)
    formData.append("eventId", event.id.toString())
    formData.append("eventName", event.name)
    if (file) formData.append("file", file)

    setLoading(true)
    try {
      if (isEdit && submission) {
        await updateSubmission(submission.id, formData)
        toast.success("Submission updated successfully")
      } else {
        await createSubmission(formData)
        toast.success("Submission created successfully")
      }
      mutate("submissions")
      mutate("allSubmissions")
      onSuccess?.()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save submission"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employeeName" className="text-sm font-medium text-foreground">
              Employee Name
            </Label>
            <Input
              id="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employeeId" className="text-sm font-medium text-foreground">
              Employee ID
            </Label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. EMP001"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-foreground">Organization</Label>
          <Select value={organizationId} onValueChange={setOrganizationId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {orgs.map((org) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">ESG Direction</Label>
            <Select
              value={esgDirectionId}
              onValueChange={setEsgDirectionId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                {dirs.map((dir) => (
                  <SelectItem key={dir.id} value={dir.id.toString()}>
                    {dir.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">Award Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {cats.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="ideaName" className="text-sm font-medium text-foreground">
              Idea Name
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum 50 characters</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="ideaName"
            value={ideaName}
            onChange={(e) => setIdeaName(e.target.value)}
            placeholder="Give your idea a concise name"
            maxLength={50}
            required
          />
          <p className="text-xs text-muted-foreground text-right">
            {ideaName.length}/50
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="ideaSummary" className="text-sm font-medium text-foreground">
              Idea Summary
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum 300 characters</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="ideaSummary"
            value={ideaSummary}
            onChange={(e) => setIdeaSummary(e.target.value)}
            placeholder="Describe your idea and its expected ESG impact"
            maxLength={300}
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground text-right">
            {ideaSummary.length}/300
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-foreground">Presentation File</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum file size: 5MB</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.pptx,.ppt,.doc,.docx"
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
            }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted"
          >
            <Upload className="h-4 w-4" />
            {file ? (
              <span className="text-foreground">{file.name}</span>
            ) : submission?.fileName ? (
              <span className="text-foreground">
                Current: {submission.fileName} (click to replace)
              </span>
            ) : (
              <span>Click to upload a presentation file</span>
            )}
          </div>
          {file && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start gap-1 text-xs text-muted-foreground"
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
            >
              <X className="h-3 w-3" />
              Remove file
            </Button>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Submit Proposal"}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  )
}
