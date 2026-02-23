"use client"

import { useState } from "react"
import { ShieldCheck, ShieldOff, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { setUserAdmin } from "@/lib/api"
import { useUsers } from "@/lib/use-api"

export function AdminUsers() {
  const { data: users, isLoading } = useUsers()
  const [actionId, setActionId] = useState<number | null>(null)

  async function handleToggleAdmin(id: number, currentIsAdmin: boolean) {
    setActionId(id)
    try {
      await setUserAdmin(id, !currentIsAdmin)
      toast.success(
        currentIsAdmin ? "User demoted to participant" : "User promoted to admin"
      )
      mutate("users")
    } catch {
      toast.error("Failed to update user role")
    } finally {
      setActionId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Promote or demote users to admin
        </p>
      </div>

      {(!users || users.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">No Users</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No users have been registered yet.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-foreground">{user.name}</h4>
                  <Badge
                    variant={user.isAdmin ? "default" : "secondary"}
                    className={
                      user.isAdmin
                        ? "bg-primary text-primary-foreground border-0"
                        : ""
                    }
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                disabled={actionId === user.id}
              >
                {actionId === user.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : user.isAdmin ? (
                  <ShieldOff className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {user.isAdmin ? "Demote" : "Promote"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
