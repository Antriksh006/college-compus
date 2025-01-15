/* eslint-disable */

import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {AnnouncementModel} from "@/model/User";


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {error: 'Invalid club id'},
        {status: 400}
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const announcement = await AnnouncementModel.findById(objectId)

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

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {error: 'Invalid club id'},
        {status: 400}
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const { department, announcementText } = await req.json();

    if (!department.trim() || !announcementText.trim() || !announcementText.trim()) {
      return NextResponse.json(
        {error: "data not found"},
        {status: 403}
      )
    }

    const announcement = await AnnouncementModel.findByIdAndUpdate(objectId, {
      department,
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

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

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

    const announcement = await AnnouncementModel.findByIdAndDelete(objectId)

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