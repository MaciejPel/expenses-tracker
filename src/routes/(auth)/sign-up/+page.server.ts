import { fail, redirect } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { users } from "$lib/server/db/schema";
import { alphabet, generateRandomString } from "oslo/crypto";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, "/");
};

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const [email, password, repeatPassword] = [
			formData.get("email"),
			formData.get("password"),
			formData.get("repeat-password"),
		];

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
		if (typeof repeatPassword !== "string" || repeatPassword !== password) {
			return fail(400, { field: "repeat-password", reason: "no-match" });
		}

		const alreadyExistingUsers = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, email.toLowerCase()));
		if (alreadyExistingUsers.length) {
			return fail(400, { field: "email", reason: "taken" });
		}

		const userId = generateRandomString(32, alphabet("0-9", "a-z"));
		const passwordHash = await new Argon2id().hash(password);

		const insertResult = await db.insert(users).values({
			id: userId,
			email,
			passwordHash,
		});
		if (!insertResult.rowsAffected) return fail(500, { error: "insert-error" });

		redirect(302, "/sign-in");
	},
};
