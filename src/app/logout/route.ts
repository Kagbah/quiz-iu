export const runtime = "edge";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const requestUrl = new URL(request.url);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(requestUrl.origin + "/login");
  } else {
    await supabase.auth.signOut();
    return NextResponse.redirect(requestUrl.origin + "/login");
  }
}
