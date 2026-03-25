import { Zone, Encounter } from "./types";
import { zones } from "./zones";

export function getZone(zoneId: number): Zone | null {
  return zones.find((z) => z.id === zoneId) ?? null;
}

export function getEncounter(zoneId: number, position: number): Encounter | null {
  const zone = getZone(zoneId);
  if (!zone) return null;
  return zone.encounters.find((e) => e.position === position) ?? null;
}

export function getZoneEncounterCount(zoneId: number): number {
  const zone = getZone(zoneId);
  return zone ? zone.encounters.length : 0;
}

export function getTotalEncounters(): number {
  return zones.reduce((sum, z) => sum + z.encounters.length, 0);
}

export function getTotalZones(): number {
  return zones.length;
}

/** Get global encounter index (1-based) across all zones */
export function getGlobalEncounterIndex(zoneId: number, position: number): number {
  let count = 0;
  for (const zone of zones) {
    if (zone.id === zoneId) {
      return count + position;
    }
    count += zone.encounters.length;
  }
  return count;
}
