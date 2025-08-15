import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinata/pinata-config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Please select a valid image file (JPEG, JPG, or PNG)" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Upload to Pinata
    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);

    // Return the IPFS URI
    const ipfsUri = `ipfs://${cid}`;
    console.log(url);

    return NextResponse.json({
      success: true,
      cid: cid,
      uri: ipfsUri,
      url: url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

  } catch (error) {
    console.error("File upload error:", error);
    console.error(`Error: `)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}