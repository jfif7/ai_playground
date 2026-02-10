"use client"

import useSWR from "swr"
import {
  fetchOrganizations,
  fetchEsgDirections,
  fetchCategories,
  fetchActiveEvent,
  fetchAllEvents,
  fetchSubmissions,
  fetchAllSubmissions,
} from "./api"

export function useOrganizations() {
  return useSWR("organizations", fetchOrganizations)
}

export function useEsgDirections() {
  return useSWR("esgDirections", fetchEsgDirections)
}

export function useCategories() {
  return useSWR("categories", fetchCategories)
}

export function useActiveEvent() {
  return useSWR("activeEvent", fetchActiveEvent)
}

export function useAllEvents() {
  return useSWR("allEvents", fetchAllEvents)
}

export function useSubmissions() {
  return useSWR("submissions", fetchSubmissions)
}

export function useAllSubmissions() {
  return useSWR("allSubmissions", fetchAllSubmissions)
}
