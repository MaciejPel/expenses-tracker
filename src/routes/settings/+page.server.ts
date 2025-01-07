import { fail, redirect, type Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm/mysql-core/expressions";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";

export const actions = {
	delete: async (event) => {
		if (!event.locals.user || !event.locals.session)
			return fail(401, { field: "other", reason: "unauthorized" });

		const deleteResult = await db.delete(users).where(eq(users.id, event.locals.user.id));

		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);

		if (!deleteResult.rowsAffected) return fail(404, { field: "other", reason: "not-found" });
		redirect(302, "/sign-in");
	},
} satisfies Actions;
