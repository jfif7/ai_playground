import { NextResponse } from "next/server"
import { organizations, addOrganization } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(organizations)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  const org = addOrganization(body.name)
  return NextResponse.json(org, { status: 201 })
}
