// Core domain types for Trav v1. Mirrors the Supabase schema (supabase/migrations).

export type Platform = "google_maps" | "instagram" | "tiktok" | "trav" | "manual";

export type ChipStatus = "resolving" | "resolved" | "needs_review";

export type TransportMode = "drive" | "walk" | "transit";

/** A saved place. Lives in the Unfiled inbox until filed into folder(s). */
export interface Chip {
  id: string;
  userId: string;
  sourceUrl: string | null;
  platform: Platform;
  status: ChipStatus;
  name: string | null;
  address: string | null;
  city: string | null;
  category: string | null;
  placeId: string | null; // Google Places place_id
  lat: number | null;
  lng: number | null;
  hours: OpeningHours | null;
  photoUrl: string | null;
  rating: number | null;
  createdAt: string;
}

export interface OpeningHours {
  // Keyed 0=Sun..6=Sat → list of {open, close} in local "HH:mm".
  [day: number]: { open: string; close: string }[];
}

/** What a resolver returns for one link. Geocode + persist are shared downstream. */
export interface ResolvedPlace {
  name: string;
  city: string | null;
  category: string | null;
  placeId?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  hours?: OpeningHours | null;
  photoUrl?: string | null;
  rating?: number | null;
}

export type ResolveResult =
  | { ok: true; place: ResolvedPlace }
  | { ok: false; reason: "needs_review" | "unsupported"; note?: string };

export interface Folder {
  id: string;
  userId: string;
  name: string;
  coverUrl: string | null;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  folderId: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  transport: TransportMode;
  createdAt: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  chipId: string;
  day: number; // 1-based
  order: number; // within the day
  startTime: string | null; // "HH:mm"
  endTime: string | null;
}
