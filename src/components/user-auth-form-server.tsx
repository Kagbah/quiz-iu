"use server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    if (error.status == 400) {
      return redirect("/login?message=invalid-credentials");
    }
    return redirect("/login?message=generic");
  }
  return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error.code == "over_email_send_rate_limit" && error.status === 429) {
      return redirect("/login?message=rate-limit");
    }
    if (
      error.status === 400 &&
      error.message.includes("User already registered")
    ) {
      return redirect("/signup?message=email-already-exists");
    }
    return redirect("/login?message=generic");
  }
  return redirect("/login?message=ckeck-email");
}
