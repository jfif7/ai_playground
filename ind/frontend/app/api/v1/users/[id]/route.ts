import { NextResponse } from "next/server"
import { setUserAdmin } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
  }

  const body = await request.json()
  if (typeof body.isAdmin !== "boolean") {
    return NextResponse.json({ error: "isAdmin (boolean) is required" }, { status: 400 })
  }

  const updated = setUserAdmin(id, body.isAdmin)
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(updated)
}
