import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {FriendRequestModel} from "@/model/User";

export async function DELETE(req: NextRequest )  {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const studentId = segments.slice(-2);

    if (!studentId || studentId.length < 2) {
      return NextResponse.json(
        {error: "student id not found"},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(studentId[0]) || !mongoose.Types.ObjectId.isValid(studentId[1])) {
      return NextResponse.json(
        { error: "student id is not valid" },
        { status: 403 }
      );
    }

    const from = new mongoose.Types.ObjectId(studentId[0]);
    const to = new mongoose.Types.ObjectId(studentId[1]);

    const deleteRequest = await FriendRequestModel.deleteOne({from, to})

    if (!deleteRequest) {
      return NextResponse.json(
        {error: "failed to delete friend request"},
        {status: 500}
      )
    }

    return NextResponse.json(
      {status: 200},
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while accepting request.' }, { status: 500 });
  }
}