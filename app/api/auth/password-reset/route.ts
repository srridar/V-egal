import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/services/auth.services";
import { connectToDatabase } from "@/lib/db";


export async function POST(request: NextRequest) {
    try {

        await connectToDatabase();
        const body = await request.json();
        const result = await resetPassword(body);
        return NextResponse.json(result, {
            status: result.status,
        });

    } catch (error: any) {
        return NextResponse.json(
            {    message: error.message, },
            {
                status: 400,
            }
        );
    }
}