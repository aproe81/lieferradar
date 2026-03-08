import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();

    const entry = await prisma.entry.update({
      where: { id: params.id },
      data: {
        name: body.name,
        author: body.author,
        note: body.note || "",
        rating: body.rating,
        orderDate: new Date(body.orderDate),
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await prisma.entry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
