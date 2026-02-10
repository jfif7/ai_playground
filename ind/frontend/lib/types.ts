export type UserRole = "participant" | "admin"

export interface Organization {
  id: number
  name: string
}

export interface EsgDirection {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
  file_prefix: string
}

export interface EsgEvent {
  id: number
  name: string
  description?: string
  startDate: string
  endDate: string
  active: boolean
  hidden?: boolean
  organizations?: Organization[]
  esgDirections?: EsgDirection[]
  categories?: Category[]
}

export interface Submission {
  id: number
  eventId: number
  eventName?: string
  employeeName: string
  employeeId: string
  organizationId: number
  organizationName?: string
  esgDirectionId: number
  esgDirectionName?: string
  categoryId: number
  categoryName?: string
  ideaName: string
  ideaSummary: string
  fileName?: string
  fileUrl?: string
  createdAt?: string
  updatedAt?: string
}
