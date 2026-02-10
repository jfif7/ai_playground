import type {
  Organization,
  EsgDirection,
  Category,
  EsgEvent,
  Submission,
} from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1"

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error")
    throw new Error(`API error ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// Organizations
export const fetchOrganizations = () =>
  request<Organization[]>("/org/")

export const createOrganization = (data: { name: string }) =>
  request<Organization>("/org/", {
    method: "POST",
    body: JSON.stringify(data),
  })

// ESG Directions
export const fetchEsgDirections = () =>
  request<EsgDirection[]>("/esgDir/")

export const createEsgDirection = (data: { name: string }) =>
  request<EsgDirection>("/esgDir/", {
    method: "POST",
    body: JSON.stringify(data),
  })

// Categories
export const fetchCategories = () =>
  request<Category[]>("/category/")

export const createCategory = (data: { name: string; file_prefix: string }) =>
  request<Category>("/category/", {
    method: "POST",
    body: JSON.stringify(data),
  })

// Events
export const fetchActiveEvent = () =>
  request<EsgEvent>("/events/active/")

export const fetchAllEvents = () =>
  request<EsgEvent[]>("/events")

export const createEvent = (data: Partial<EsgEvent>) =>
  request<EsgEvent>("/events", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const updateEvent = (id: number, data: Partial<EsgEvent>) =>
  request<EsgEvent>(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

export const deleteEvent = (id: number) =>
  request<void>(`/events/${id}`, { method: "DELETE" })

export const hideEvent = (id: number, hidden: boolean) =>
  request<EsgEvent>(`/events/${id}/visibility`, {
    method: "PATCH",
    body: JSON.stringify({ hidden }),
  })

// Submissions
export const fetchSubmissions = () =>
  request<Submission[]>("/submissions/")

export const fetchAllSubmissions = () =>
  request<Submission[]>("/submissions/all")

export const createSubmission = (formData: FormData) =>
  request<Submission>("/submissions", {
    method: "POST",
    body: formData,
  })

export const updateSubmission = (id: number, formData: FormData) =>
  request<Submission>(`/submissions/${id}`, {
    method: "PUT",
    body: formData,
  })

export const deleteSubmission = (id: number) =>
  request<void>(`/submissions/${id}`, { method: "DELETE" })
