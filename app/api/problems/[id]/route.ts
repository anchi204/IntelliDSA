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

    const data: any = {
      ...body,
    };

    // --------------------------------
    // SOLVED / UNSOLVED
    // --------------------------------

    if (typeof body.solved === "boolean") {
      if (body.solved) {
        const solvedAt = new Date();

        data.solvedAt = solvedAt;
        data.revisionCount = 0;

        // Medium → 3 revisions, every 4 days
        if (body.difficulty === "Medium") {
          data.maxRevisions = 3;

          const revisionDate = new Date(solvedAt);
          revisionDate.setDate(revisionDate.getDate() + 4);

          data.revisionDate = revisionDate;
        }

        // Hard → 5 revisions, every 4 days
        else if (body.difficulty === "Hard") {
          data.maxRevisions = 5;

          const revisionDate = new Date(solvedAt);
          revisionDate.setDate(revisionDate.getDate() + 4);

          data.revisionDate = revisionDate;
        }

        // Easy → no revision
        else {
          data.maxRevisions = 0;
          data.revisionDate = null;
        }
      } else {
        // Problem marked unsolved

        data.solvedAt = null;
        data.revisionDate = null;
        data.revisionCount = 0;
        data.maxRevisions = 0;
      }
    }

    // --------------------------------
    // REVISION DONE
    // --------------------------------

    if (body.revisionDone === true) {
      const currentProblem = await prisma.problem.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!currentProblem) {
        return NextResponse.json(
          { message: "Problem not found" },
          { status: 404 }
        );
      }

      // No revision is currently scheduled
      if (!currentProblem.revisionDate) {
        return NextResponse.json(
          { message: "No revision scheduled" },
          { status: 400 }
        );
      }

      const nextRevisionCount = currentProblem.revisionCount + 1;

      data.revisionCount = nextRevisionCount;

      // Maximum revisions completed
      if (nextRevisionCount >= currentProblem.maxRevisions) {
        data.revisionDate = null;
      }

      // More revisions remaining
      else {
        const nextRevisionDate = new Date(
          currentProblem.revisionDate
        );

        nextRevisionDate.setDate(
          nextRevisionDate.getDate() + 4
        );

        data.revisionDate = nextRevisionDate;
      }
    }

    // --------------------------------
    // UPDATE DATABASE
    // --------------------------------

    const updatedProblem = await prisma.problem.update({
      where: {
        id: Number(id),
      },
      data,
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update problem",
      },
      { status: 500 }
    );
  }
}