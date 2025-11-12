import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000/api",
  secretKey: process.env.BETTER_AUTH_SECRET || "super-secret-key",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [process.env.TRUSTED_ORIGIN || "http://localhost:3000"],
  emailAndPassword: { enabled: true, autoSignIn: true, minPasswordLength: 8 },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      username: { type: "string", unique: true, required: false },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    openAPI(),
   
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
