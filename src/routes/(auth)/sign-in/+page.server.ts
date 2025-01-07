import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

export const load = async ({ locals }) => {
	if (locals.user) redirect(302, "/");
};

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email");
		const password = formData.get("password");

		if (
			typeof email !== "string" ||
			email.length < 3 ||
			email.length > 32 ||
			!/^[A-Za-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)
		) {
			return fail(400, { field: "email", reason: "requirements" });
		}
		if (typeof password !== "string" || password.length < 8 || password.length > 64) {
			return fail(400, { field: "password", reason: "requirements" });
		}

		const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
		if (!existingUser.length) {
			return fail(400, { field: "other", reason: "general" });
		}

		const validPassword = await new Argon2id().verify(existingUser[0].passwordHash, password);
		if (!validPassword) {
			return fail(400, { field: "other", reason: "general" });
		}

		const token = generateSessionToken();
		const session = await createSession(token, existingUser[0].id);
		setSessionTokenCookie(event, token, session.expiresAt);

		const redirectCookie = event.cookies.get("redirect");
		event.cookies.delete("redirect", { path: "/" });

		redirect(302, redirectCookie || "/");
	},
} satisfies Actions;
