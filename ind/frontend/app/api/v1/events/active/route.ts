import { NextResponse } from "next/server"
import { events } from "@/lib/mock-data"

export async function GET() {
  const active = events.find((e) => e.active && !e.hidden)
  if (!active) {
    return NextResponse.json(
      { error: "No active event found" },
      { status: 404 }
    )
  }
  return NextResponse.json(active)
}

export const dynamic = "force-dynamic"
