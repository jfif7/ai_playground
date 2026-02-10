import { NextResponse } from "next/server"
import { events, deleteEventById } from "@/lib/mock-data"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deleteEventById(Number(id))
  if (!deleted) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const idx = events.findIndex((e) => e.id === Number(id))
  if (idx === -1) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }
  events[idx] = { ...events[idx], ...body }
  return NextResponse.json(events[idx])
}
