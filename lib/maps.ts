import { Client, TravelMode } from "@googlemaps/google-maps-services-js";
import { env } from "./env";
import type { ResolvedPlace, TransportMode } from "./types";

// Google Maps Platform (server key). Handles: findPlace/geocode, Distance Matrix,
// and Discover search. The LLM never does this — real data only (design doc D1).

let _client: Client | null = null;
function maps(): Client | null {
  if (!env.googleMapsServerKey) return null;
  if (!_client) _client = new Client({});
  return _client;
}

/** Text (place name, or "Name, City") -> enriched place. Null on miss. */
export async function findPlaceByText(query: string): Promise<ResolvedPlace | null> {
  const client = maps();
  if (!client) return null; // no key in dev -> caller falls to needs_review
  try {
    const res = await client.findPlaceFromText({
      params: {
        input: query,
        inputtype: "textquery" as never,
        fields: ["name", "place_id", "geometry", "formatted_address", "rating"],
        key: env.googleMapsServerKey,
      },
    });
    const c = res.data.candidates?.[0];
    if (!c) return null;
    return {
      name: c.name ?? query,
      city: null,
      category: null,
      placeId: c.place_id ?? null,
      lat: c.geometry?.location.lat ?? null,
      lng: c.geometry?.location.lng ?? null,
      address: c.formatted_address ?? null,
      rating: c.rating ?? null,
    };
  } catch {
    return null;
  }
}

/** Discover: popular places for a city + category (task T16). */
export async function discoverPlaces(
  city: string,
  category: string
): Promise<ResolvedPlace[]> {
  const client = maps();
  if (!client) return [];
  try {
    const res = await client.textSearch({
      params: { query: `${category} in ${city}`, key: env.googleMapsServerKey },
    });
    return (res.data.results ?? []).slice(0, 12).map((r) => ({
      name: r.name ?? "",
      city,
      category,
      placeId: r.place_id ?? null,
      lat: r.geometry?.location.lat ?? null,
      lng: r.geometry?.location.lng ?? null,
      address: r.formatted_address ?? null,
      rating: r.rating ?? null,
    }));
  } catch {
    return [];
  }
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** Real pairwise travel-time matrix (seconds) for a transport mode. */
export async function travelMatrix(
  points: LatLng[],
  mode: TransportMode
): Promise<number[][]> {
  const client = maps();
  const n = points.length;
  const empty = Array.from({ length: n }, () => Array(n).fill(0));
  if (!client || n === 0) return empty;
  try {
    const res = await client.distancematrix({
      params: {
        origins: points,
        destinations: points,
        mode: mapMode(mode),
        key: env.googleMapsServerKey,
      },
    });
    return res.data.rows.map((row) =>
      row.elements.map((e) => e.duration?.value ?? 0)
    );
  } catch {
    return empty;
  }
}

function mapMode(mode: TransportMode): TravelMode {
  return mode === "drive"
    ? TravelMode.driving
    : mode === "walk"
      ? TravelMode.walking
      : TravelMode.transit;
}
