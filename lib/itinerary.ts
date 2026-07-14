import type { LatLng } from "./maps";

/**
 * Deterministic stop ordering (design doc D1 / task T3).
 * Nearest-neighbor over a real travel-time matrix. Pure + unit-testable — no LLM,
 * no network. Open/close-hours windowing is layered on top at build time (TODO T3).
 *
 * @param matrix seconds[i][j] from travelMatrix()
 * @param startIndex which stop to begin from (default 0)
 * @returns the visiting order as indices into the input
 */
export function orderStops(matrix: number[][], startIndex = 0): number[] {
  const n = matrix.length;
  if (n <= 1) return n === 1 ? [0] : [];
  const visited = new Set<number>([startIndex]);
  const order = [startIndex];
  let current = startIndex;
  while (visited.size < n) {
    let best = -1;
    let bestCost = Infinity;
    for (let j = 0; j < n; j++) {
      if (visited.has(j)) continue;
      const cost = matrix[current][j];
      if (cost < bestCost) {
        bestCost = cost;
        best = j;
      }
    }
    if (best === -1) break;
    visited.add(best);
    order.push(best);
    current = best;
  }
  return order;
}

/**
 * Cluster stops into `days` groups by geography (task T7).
 * Placeholder: even split preserving input order. TODO(T7): k-means/geo-cluster on
 * lat/lng so each day is a coherent area, then orderStops within each day.
 */
export function clusterIntoDays<T extends LatLng>(points: T[], days: number): T[][] {
  const d = Math.max(1, days);
  const out: T[][] = Array.from({ length: d }, () => []);
  const per = Math.ceil(points.length / d);
  points.forEach((p, i) => out[Math.min(d - 1, Math.floor(i / per))].push(p));
  return out;
}
