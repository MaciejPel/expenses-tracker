import { dev } from "$app/environment";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "$env/dynamic/private";
import type { InferSelectModel } from "drizzle-orm";
import type { users, userSessions } from "./schema";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error("DATABASE_AUTH_TOKEN is not set");

const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
export const db = drizzle(client, {
	/* logger: true */
});

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof userSessions>;
