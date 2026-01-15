import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseStorage } from "@/lib/supabase-storage";

export async function POST(req: NextRequest) {
    try {
        // 1. Auth Check
        const cookieStore = await cookies();
        const session = cookieStore.get("admin_session");

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
        try {
            await jwtVerify(session.value, secret);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // 2. Parse Form Data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 3. Upload to Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseStorage.storage
            .from('products')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError);
            return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabaseStorage.storage
            .from('products')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error("Upload Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
