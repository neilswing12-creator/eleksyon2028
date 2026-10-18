import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, signAdminSession, verifyAdminSession, getClientIP } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = signAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Record login in audit log
    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "ADMIN_LOGIN",
        entityType: "AdminUser",
        entityId: admin.id,
        details: "Administrator authenticated successfully",
        ipAddress: clientIP,
      },
    });

    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Also set HTTP-only cookie for seamless browser navigation
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin auth login error:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get("admin_session")?.value || "";
    }

    const payload = verifyAdminSession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized or session expired." }, { status: 401 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "User no longer exists." }, { status: 401 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
