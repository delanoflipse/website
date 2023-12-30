import { queryPlanetscale } from "@/lib/db/client/planetscale";


export const getLatestTurfs = async () => {
  const rows = await queryPlanetscale("SELECT * FROM latest_turfs");

  return rows;
}

export const getLatestTurf = async (event_name: string) => {
  const rows = await queryPlanetscale("SELECT * FROM latest_turfs WHERE event_name=?", [event_name]);
  const [entry] = rows ?? [];
  return entry?.latest_turf ?? null;
}

export const getTurfs = async (event_name: string) => {
  const rows = await queryPlanetscale("SELECT * FROM turfs WHERE event_name=?", [event_name]);
  
  return rows;
}
