import { NextResponse } from "next/server";
import { getLatestTurfs } from "@/lib/db/tables/turfs";
import { queryPlanetscale } from "@/lib/db/client/planetscale";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event_name = searchParams.get("event");

  const currentTurfs = await getLatestTurfs();

  // const { rows } = await connection.execute("SELECT * FROM turfs WHERE event_name=?", [event_name]);
  return NextResponse.json(currentTurfs);
}

export async function POST(request: Request) {
  const { event_name } = await request.json();
  
  const rows = await queryPlanetscale("SELECT * FROM turfs WHERE event_name=?", [event_name]);

  return NextResponse.json(rows);
}
