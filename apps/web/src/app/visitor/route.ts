import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const geo = geolocation(request);

  const userAgent = request.headers.get("user-agent");
  const referrer = request.headers.get("referer");

  console.log("========== VISITOR ==========");
  console.log({
    time: new Date().toISOString(),

    location: {
      city: geo.city,
      region: geo.countryRegion,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      postalCode: geo.postalCode,
    },

    userAgent,
    referrer,
    path: request.nextUrl.pathname,
  });
  console.log("=============================");

  return NextResponse.json({ success: true, geo });
}
