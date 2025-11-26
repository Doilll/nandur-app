import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";


export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  const url = req.nextUrl.clone();

  // Kalau user login tapi username masih empty → redirect ke setup
  if (
    session?.user &&
    !session.user.username &&
    !url.pathname.startsWith("/setup-profile")
  ) {
    url.pathname = "/setup-profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|api).*)",
  ],
};
