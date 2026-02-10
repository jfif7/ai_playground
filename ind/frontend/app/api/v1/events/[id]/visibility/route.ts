import { NextResponse } from "next/server"
import { toggleEventHidden } from "@/lib/mock-data"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const evt = toggleEventHidden(Number(id), body.hidden)
  if (!evt) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }
  return NextResponse.json(evt)
}
