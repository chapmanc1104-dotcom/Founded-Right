import { createClient } from "@supabase/supabase-js";
import { type Request, type Response, type NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { SESSION_COOKIE } from "../lib/auth";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
    }

    interface Request {
      isAuthenticated(): this is AuthedRequest;
      user?: User | undefined;
    }

    export interface AuthedRequest {
      user: User;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.isAuthenticated = function (this: Request) {
    return this.user != null;
  } as Request["isAuthenticated"];

  // Clear legacy Replit session cookies if present
  if (req.cookies?.[SESSION_COOKIE]) {
    res.clearCookie(SESSION_COOKIE, { path: "/" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      next();
      return;
    }

    const fullName: string = (user.user_metadata?.full_name as string) || "";
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || null;
    const lastName = parts.slice(1).join(" ") || null;

    await db
      .insert(usersTable)
      .values({
        id: user.id,
        email: user.email || null,
        firstName,
        lastName,
        profileImageUrl: (user.user_metadata?.avatar_url as string) || null,
      })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          email: user.email || null,
          updatedAt: new Date(),
        },
      });

    req.user = {
      id: user.id,
      email: user.email || null,
      firstName,
      lastName,
      profileImageUrl: (user.user_metadata?.avatar_url as string) || null,
    };

    next();
  } catch {
    next();
  }
}
