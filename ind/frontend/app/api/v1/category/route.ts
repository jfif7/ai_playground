import { NextResponse } from "next/server"
import { categories, addCategory } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name || !body.file_prefix) {
    return NextResponse.json(
      { error: "Name and file_prefix are required" },
      { status: 400 }
    )
  }
  const cat = addCategory(body.name, body.file_prefix)
  return NextResponse.json(cat, { status: 201 })
}
