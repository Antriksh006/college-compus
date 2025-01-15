import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {TeacherAnnouncementModel} from "@/model/User";


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        { error: 'User is not teacher' },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json(
        {error: 'No id found.'},
        {status: 400}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {error: 'Invalid club id'},
        {status: 400}
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const announcement = await TeacherAnnouncementModel.findOne({_id: objectId, teacherId: userId})

    if (!announcement) {
      return NextResponse.json(
        {error: "No announcement found."},
        {status: 404}
      )
    }

    return NextResponse.json(announcement, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        { error: 'User is not teacher' },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json(
        {error: 'No id found.'},
        {status: 400}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {error: 'Invalid club id'},
        {status: 400}
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const { subjectCode, announcementText } = await req.json();

    if (!subjectCode.trim() || !announcementText.trim()) {
      return NextResponse.json(
        {error: "data not found"},
        {status: 403}
      )
    }

    const announcement = await TeacherAnnouncementModel.findOneAndUpdate(
      { _id: objectId, teacherId: userId},
      {
      subjectCode,
      announcementText,
    })

    if (!announcement) {
      return NextResponse.json(
        {error: "No announcement found."},
        {status: 404}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        { error: 'User is not teacher' },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json(
        {error: 'No id found.'},
        {status: 400}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {error: 'Invalid club id'},
        {status: 400}
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const announcement = await TeacherAnnouncementModel.findOneAndDelete({ _id: objectId, teacherId: userId});

    if (!announcement) {
      return NextResponse.json(
        {error: "No announcement found."},
        {status: 404}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}