import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: { orderDate: "desc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const entry = await prisma.entry.create({
      data: {
        name: body.name,
        author: body.author,
        note: body.note || "",
        rating: body.rating,
        orderDate: new Date(body.orderDate),
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
  }
}
