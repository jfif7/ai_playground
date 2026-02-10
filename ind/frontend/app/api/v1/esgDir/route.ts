import { NextResponse } from "next/server"
import { esgDirections, addEsgDirection } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(esgDirections)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  const dir = addEsgDirection(body.name)
  return NextResponse.json(dir, { status: 201 })
}
