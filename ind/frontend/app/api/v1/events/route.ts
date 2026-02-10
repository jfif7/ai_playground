import { NextResponse } from "next/server"
import { events, addEvent } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name || !body.startDate || !body.endDate) {
    return NextResponse.json(
      { error: "name, startDate, and endDate are required" },
      { status: 400 }
    )
  }
  const evt = addEvent(body)
  return NextResponse.json(evt, { status: 201 })
}
