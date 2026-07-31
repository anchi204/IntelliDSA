import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.problem.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to delete problem",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedProblem = await prisma.problem.update({
      where: {
        id: Number(id),
      },
      data: body,
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update problem" },
      { status: 500 }
    );
  }
}