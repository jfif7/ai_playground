import type { Organization, EsgDirection, Category, EsgEvent, Submission } from "./types"

let nextOrgId = 4
let nextDirId = 4
let nextCatId = 4
let nextEventId = 3
let nextSubmissionId = 4

export const organizations: Organization[] = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Operations" },
]

export const esgDirections: EsgDirection[] = [
  { id: 1, name: "Environmental" },
  { id: 2, name: "Social" },
  { id: 3, name: "Governance" },
]

export const categories: Category[] = [
  { id: 1, name: "Green Innovation", file_prefix: "GI" },
  { id: 2, name: "Community Impact", file_prefix: "CI" },
  { id: 3, name: "Ethical Leadership", file_prefix: "EL" },
]

export const events: EsgEvent[] = [
  {
    id: 1,
    name: "ESG Awards 2025",
    description:
      "Submit your innovative ideas that drive sustainability and positive impact across our organization. The best proposals will be recognized and awarded at our annual ESG ceremony.",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    active: true,
    hidden: false,
    organizations: [organizations[0], organizations[1], organizations[2]],
    esgDirections: [esgDirections[0], esgDirections[1], esgDirections[2]],
    categories: [categories[0], categories[1], categories[2]],
  },
  {
    id: 2,
    name: "ESG Awards 2024",
    description: "Last year's ESG Award event.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    active: false,
    hidden: false,
    organizations: [organizations[0], organizations[1]],
    esgDirections: [esgDirections[0], esgDirections[1]],
    categories: [categories[0], categories[1]],
  },
]

export const submissions: Submission[] = [
  {
    id: 1,
    eventId: 1,
    eventName: "ESG Awards 2025",
    employeeName: "Jane Smith",
    employeeId: "EMP001",
    organizationId: 1,
    organizationName: "Engineering",
    esgDirectionId: 1,
    esgDirectionName: "Environmental",
    categoryId: 1,
    categoryName: "Green Innovation",
    ideaName: "Solar-Powered Office Initiative",
    ideaSummary:
      "A comprehensive plan to convert 50% of office energy consumption to solar power within 2 years, reducing carbon footprint by an estimated 200 tons annually.",
    fileName: "solar_initiative.pdf",
    createdAt: "2025-06-15T10:30:00Z",
  },
  {
    id: 2,
    eventId: 1,
    eventName: "ESG Awards 2025",
    employeeName: "John Doe",
    employeeId: "EMP002",
    organizationId: 2,
    organizationName: "Marketing",
    esgDirectionId: 2,
    esgDirectionName: "Social",
    categoryId: 2,
    categoryName: "Community Impact",
    ideaName: "Digital Literacy Program",
    ideaSummary:
      "Launch a free digital skills training program for underserved communities, targeting 500 participants in the first year.",
    fileName: "digital_literacy.pptx",
    createdAt: "2025-07-20T14:15:00Z",
  },
  {
    id: 3,
    eventId: 2,
    eventName: "ESG Awards 2024",
    employeeName: "Jane Smith",
    employeeId: "EMP001",
    organizationId: 1,
    organizationName: "Engineering",
    esgDirectionId: 3,
    esgDirectionName: "Governance",
    categoryId: 3,
    categoryName: "Ethical Leadership",
    ideaName: "Transparent Supply Chain",
    ideaSummary:
      "Implement blockchain-based supply chain tracking to ensure ethical sourcing across all vendor partnerships.",
    fileName: "supply_chain.pdf",
    createdAt: "2024-05-10T09:00:00Z",
  },
]

export function addOrganization(name: string): Organization {
  const org: Organization = { id: nextOrgId++, name }
  organizations.push(org)
  return org
}

export function addEsgDirection(name: string): EsgDirection {
  const dir: EsgDirection = { id: nextDirId++, name }
  esgDirections.push(dir)
  return dir
}

export function addCategory(name: string, file_prefix: string): Category {
  const cat: Category = { id: nextCatId++, name, file_prefix }
  categories.push(cat)
  return cat
}

export function addEvent(data: Partial<EsgEvent>): EsgEvent {
  const evt: EsgEvent = {
    id: nextEventId++,
    name: data.name || "",
    description: data.description || "",
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    active: false,
    hidden: false,
    organizations: data.organizations || [],
    esgDirections: data.esgDirections || [],
    categories: data.categories || [],
  }
  // Determine if active
  const now = new Date()
  const start = new Date(evt.startDate)
  const end = new Date(evt.endDate)
  if (now >= start && now <= end) {
    events.forEach((e) => (e.active = false))
    evt.active = true
  }
  events.push(evt)
  return evt
}

export function addSubmission(data: Omit<Submission, "id" | "createdAt">): Submission {
  const sub: Submission = {
    ...data,
    id: nextSubmissionId++,
    createdAt: new Date().toISOString(),
  }
  submissions.push(sub)
  return sub
}

export function updateSubmissionById(
  id: number,
  data: Partial<Submission>
): Submission | null {
  const idx = submissions.findIndex((s) => s.id === id)
  if (idx === -1) return null
  submissions[idx] = { ...submissions[idx], ...data, updatedAt: new Date().toISOString() }
  return submissions[idx]
}

export function deleteSubmissionById(id: number): boolean {
  const idx = submissions.findIndex((s) => s.id === id)
  if (idx === -1) return false
  submissions.splice(idx, 1)
  return true
}

export function deleteEventById(id: number): boolean {
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) return false
  events.splice(idx, 1)
  return true
}

export function toggleEventHidden(id: number, hidden: boolean): EsgEvent | null {
  const evt = events.find((e) => e.id === id)
  if (!evt) return null
  evt.hidden = hidden
  return evt
}
