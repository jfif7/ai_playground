"use client"

import { useState, type KeyboardEvent } from "react"
import { Plus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface OptionItem {
  id: number
  name: string
  file_prefix?: string
}

interface OptionManagerProps {
  label: string
  allOptions: OptionItem[]
  selectedIds: number[]
  onToggle: (id: number) => void
  onAdd: (data: { name: string; file_prefix?: string }) => Promise<void>
  showFilePrefix?: boolean
}

export function OptionManager({
  label,
  allOptions,
  selectedIds,
  onToggle,
  onAdd,
  showFilePrefix = false,
}: OptionManagerProps) {
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPrefix, setNewPrefix] = useState("")
  const [adding, setAdding] = useState(false)

  async function handleAdd() {
    if (!newName.trim()) return
    if (showFilePrefix && !newPrefix.trim()) {
      toast.error("File prefix is required for categories")
      return
    }
    setAdding(true)
    try {
      await onAdd({
        name: newName.trim(),
        ...(showFilePrefix ? { file_prefix: newPrefix.trim() } : {}),
      })
      setNewName("")
      setNewPrefix("")
      setShowNew(false)
      toast.success(`${label} added`)
    } catch {
      toast.error(`Failed to add ${label.toLowerCase()}`)
    } finally {
      setAdding(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Checkbox
              checked={selectedIds.includes(opt.id)}
              onCheckedChange={() => onToggle(opt.id)}
            />
            <Badge
              variant={selectedIds.includes(opt.id) ? "default" : "outline"}
              className="cursor-pointer"
            >
              {opt.name}
              {opt.file_prefix && (
                <span className="ml-1 opacity-60">({opt.file_prefix})</span>
              )}
            </Badge>
          </label>
        ))}
      </div>

      {showNew ? (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`New ${label.toLowerCase()} name`}
              className="h-8 text-sm"
              autoFocus
            />
            {showFilePrefix && (
              <Input
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="File prefix"
                className="h-8 w-28 text-sm"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="h-7 text-xs"
            >
              {adding && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNew(false)
                setNewName("")
                setNewPrefix("")
              }}
              className="h-7 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowNew(true)}
          className="self-start gap-1 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add new {label.toLowerCase()}
        </Button>
      )}
    </div>
  )
}
