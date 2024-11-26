export type User = {
  id: number
  name: string
  email: string
  role: string
  status: "Active" | "Inactive"
}

export type PermissionLevel = "low" | "medium" | "high"

export type Permission = {
  name: string
  level: PermissionLevel | null
}

export type Role = {
  id: number
  name: string
  permissions: Record<string, Permission>
}

export type SortOrder = "asc" | "desc"
export type SortBy = "name" | "email" | "role" | "status"

export type AuditLog = {
  id: number
  timestamp: string
  activityType: string
  description: string
  performedBy: string
}

