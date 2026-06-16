import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Mot de passe trop court (6 caractères minimum)" },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();

    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (!createError && created.user) {
      return NextResponse.json({ success: true });
    }

    const message = createError?.message ?? "";
    const alreadyExists =
      message.toLowerCase().includes("already") ||
      message.toLowerCase().includes("registered");

    if (!alreadyExists) {
      return NextResponse.json({ error: message || "Inscription impossible" }, {
        status: 400,
      });
    }

    const { data: listed, error: listError } =
      await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 400 });
    }

    const existing = listed.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Compte existant introuvable" },
        { status: 400 }
      );
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(
      existing.id,
      {
        email_confirm: true,
        password,
      }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, existing: true });
  } catch (error) {
    console.error("[signup]", error);
    return NextResponse.json(
      { error: "Inscription impossible" },
      { status: 500 }
    );
  }
}
