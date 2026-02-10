import { NextResponse } from "next/server"
import { updateSubmissionById, deleteSubmissionById } from "@/lib/mock-data"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await request.formData()

  const updates: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === "file") continue
    if (key === "organizationId" || key === "esgDirectionId" || key === "categoryId" || key === "eventId") {
      updates[key] = Number(value)
    } else {
      updates[key] = value
    }
  }

  const file = formData.get("file") as File | null
  if (file && file.name) {
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 })
    }
    updates.fileName = file.name
  }

  const sub = updateSubmissionById(Number(id), updates)
  if (!sub) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  }
  return NextResponse.json(sub)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deleteSubmissionById(Number(id))
  if (!deleted) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
