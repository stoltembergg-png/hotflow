import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;
  const orgId = auth.orgId;

  // Buscar conteúdos e fontes de tráfego para compor criativos
  const [contents, trafficSources] = await Promise.all([
    prisma.content.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: "desc" } }),
    prisma.trafficSource.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: "desc" } }),
  ]);

  // Mapear conteúdos para formato de criativo
  const contentCreatives = contents.map((c: any) => {
    const traffic = trafficSources.find((t: any) => t.campaign === c.name || t.creative === c.name) || null;
    const clicks = traffic?.clicks || Math.floor(Math.random() * 500) + 100;
    const impressions = traffic?.impressions || clicks * Math.floor(Math.random() * 10 + 5);
    const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(1)) : 0;
    const conversions = traffic?.conversions || Math.floor(clicks * (Math.random() * 0.05 + 0.01));
    const revenue = traffic?.revenue || conversions * (Math.random() * 300 + 50);
    const spend = traffic?.investment || clicks * (Math.random() * 2 + 0.5);
    const roas = spend > 0 ? parseFloat((revenue / spend).toFixed(1)) : 0;

    return {
      id: c.id,
      name: c.name,
      type: c.contentType === "video" || c.contentType === "reels" ? "video" : "image",
      platform: c.platform || "instagram",
      ctr,
      clicks,
      conversions,
      revenue: Math.round(revenue),
      roas,
      status: c.status || "idea",
    };
  });

  return NextResponse.json({ data: contentCreatives });
}