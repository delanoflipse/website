import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get the latest turf entry for a specific event
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event_name = searchParams.get("event");

  const sql = neon(process.env.DATABASE_URL ?? "");

  const data =
    await sql`SELECT * FROM turfs WHERE event=${event_name} ORDER BY time DESC LIMIT 1;`;
  const response = data[0] ?? null;
  return NextResponse.json(response);
}

// Create a new turf entry
export async function POST(request: Request) {
  const { event_name } = await request.json();

  const sql = neon(process.env.DATABASE_URL ?? "");
  const rows =
    await sql`INSERT INTO turfs (event) VALUES (${event_name}) RETURNING *;`;

  return NextResponse.json(rows[0] ?? null);
}
