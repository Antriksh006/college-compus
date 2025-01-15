import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {IssueModel} from "@/model/User";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const issueId = segments[segments.length - 1];

    if (!issueId) {
      return NextResponse.json(
        {error: "issue id not provided."},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return NextResponse.json(
        {error: "issue id is invalid."},
        {status: 403}
      )
    }

    const issueObjectId = new mongoose.Types.ObjectId(issueId);

    const issue = await IssueModel.updateOne(
      { _id: issueObjectId },
      { $pull: { votes: userId } }
    );


    if (!issue.modifiedCount) {
      return NextResponse.json(
        {error: "failed to delete vote"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while upadting issue.' }, { status: 500 });
  }
}