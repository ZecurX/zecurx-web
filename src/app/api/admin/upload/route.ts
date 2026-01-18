import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { uploadToS3, generateS3Key } from "@/lib/s3";
import { getJwtSecret } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("admin_session");

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await jwtVerify(session.value, getJwtSecret());
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const key = generateS3Key(file.name, "products");

        const result = await uploadToS3(buffer, key, file.type);

        return NextResponse.json({ url: result.url });

    } catch (error) {
        console.error("Upload Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
