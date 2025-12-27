import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      address: body.address,
      age: Number(body.age),
    },
  });

  return NextResponse.json(user);
}
