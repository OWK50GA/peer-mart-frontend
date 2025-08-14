import { NextResponse } from "next/server";
import { pinata } from '@/lib/pinata/pinata-config'

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // URL expires in 30 seconds
    })
    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error) {
    console.log("Error creating signed URL:", error);
    return NextResponse.json({ error: "Error creating upload URL" }, { status: 500 });
  }
} 