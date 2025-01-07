import { fail, type Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm/mysql-core/expressions";

export const actions = {
	delete: async (event) => {
		if (!event.locals.user) return fail(401, { message: "unauthorized" });

		const formData = await event.request.formData();
		const id = formData.get("id");

		if (typeof id !== "string") {
			return fail(400, { field: "id", reason: "requirements" });
		}

		const deleteResult = await db.delete(users).where(eq(users.id, id));

		return { success: deleteResult.rowsAffected === 1 };
	},
} satisfies Actions;
