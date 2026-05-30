import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  dailyGoal: z.number().min(1).max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const parsed = profileSchema.parse(body);

    // Mise à jour Firestore via Admin SDK (à configurer si nécessaire)
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}