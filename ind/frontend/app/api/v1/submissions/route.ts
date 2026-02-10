import { NextResponse } from "next/server"
import { submissions, addSubmission } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function GET() {
  // In a real app, filter by authenticated user
  return NextResponse.json(submissions)
}

export async function POST(request: Request) {
  const formData = await request.formData()

  const employeeName = formData.get("employeeName") as string
  const employeeId = formData.get("employeeId") as string
  const organizationId = Number(formData.get("organizationId"))
  const organizationName = formData.get("organizationName") as string
  const esgDirectionId = Number(formData.get("esgDirectionId"))
  const esgDirectionName = formData.get("esgDirectionName") as string
  const categoryId = Number(formData.get("categoryId"))
  const categoryName = formData.get("categoryName") as string
  const ideaName = formData.get("ideaName") as string
  const ideaSummary = formData.get("ideaSummary") as string
  const eventId = Number(formData.get("eventId"))
  const eventName = formData.get("eventName") as string
  const file = formData.get("file") as File | null

  if (!employeeName || !employeeId || !ideaName || !ideaSummary) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (ideaName.length > 50) {
    return NextResponse.json({ error: "Idea name must be under 50 characters" }, { status: 400 })
  }

  if (ideaSummary.length > 300) {
    return NextResponse.json({ error: "Idea summary must be under 300 characters" }, { status: 400 })
  }

  if (file && file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 })
  }

  const sub = addSubmission({
    eventId,
    eventName,
    employeeName,
    employeeId,
    organizationId,
    organizationName,
    esgDirectionId,
    esgDirectionName,
    categoryId,
    categoryName,
    ideaName,
    ideaSummary,
    fileName: file?.name || undefined,
  })

  return NextResponse.json(sub, { status: 201 })
}
