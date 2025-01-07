import { db } from "$lib/server/db/index.js";
import { expenses } from "$lib/server/db/schema.js";
import { error, fail, type Actions } from "@sveltejs/kit";
import { desc, eq, sql, sum, and } from "drizzle-orm";

export const load = async ({ locals }) => {
	if (!locals.user) error(401, { message: "unauthorized" });

	const yearly = await db
		.select({
			total: sum(expenses.cost).mapWith(Number),
			year: sql<number>`strftime('%Y', datetime(paid_at, 'unixepoch')) year`.mapWith(Number),
		})
		.from(expenses)
		.where(eq(expenses.userId, locals.user.id))
		.groupBy(sql`year`)
		.orderBy(desc(sql`year`));

	return { yearly };
};

export const actions = {
	add: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { field: "other", reason: "unauthorized" });

		const formData = await request.formData();
		const [name, cost, paidAt, category, note] = [
			formData.get("name"),
			formData.get("cost"),
			formData.get("paid_at"),
			formData.get("category"),
			formData.get("note"),
		];

		if (typeof name !== "string" || name.length > 64) {
			return fail(400, { field: "name", reason: "requirements" });
		}
		if (typeof cost !== "string" || !cost || Number.isNaN(Number(cost))) {
			return fail(400, { field: "cost", reason: "requirements" });
		}
		if (typeof category !== "string" || !category) {
			return fail(400, { field: "category", reason: "requirements" });
		}
		if (typeof note !== "string" || note.length > 256) {
			return fail(400, { field: "note", reason: "requirements" });
		}
		if (typeof paidAt !== "string" || !paidAt) {
			return fail(400, { field: "paid_at", reason: "requirements" });
		}

		const insertResult = await db.insert(expenses).values({
			userId: locals.user.id,
			name,
			cost: Number(cost),
			category: category as typeof expenses.$inferSelect.category,
			note,
			paidAt: new Date(paidAt),
		});

		return { success: insertResult.rowsAffected === 1 };
	},
	edit: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { field: "other", reason: "unauthorized" });

		const formData = await request.formData();
		const [id, name, cost, paidAt, category, note] = [
			formData.get("id"),
			formData.get("name"),
			formData.get("cost"),
			formData.get("paid_at"),
			formData.get("category"),
			formData.get("note"),
		];

		if (typeof id !== "string" || !/\d$/.test(id)) {
			return fail(400, { field: "id", reason: "requirements" });
		}
		if (typeof name !== "string" || name.length > 64) {
			return fail(400, { field: "name", reason: "requirements" });
		}
		if (typeof cost !== "string" || !cost || Number.isNaN(Number(cost))) {
			return fail(400, { field: "cost", reason: "requirements" });
		}
		if (typeof category !== "string" || !category) {
			return fail(400, { field: "category", reason: "requirements" });
		}
		if (typeof note !== "string" || note.length > 256) {
			return fail(400, { field: "note", reason: "requirements" });
		}
		if (typeof paidAt !== "string" || !paidAt) {
			return fail(400, { field: "paid_at", reason: "requirements" });
		}

		const insertResult = await db
			.update(expenses)
			.set({
				name,
				cost: Number(cost),
				paidAt: new Date(paidAt),
				category: category as typeof expenses.$inferSelect.category,
				note,
				userId: locals.user.id,
			})
			.where(and(eq(expenses.userId, locals.user.id), eq(expenses.id, Number(id))));

		return { success: insertResult.rowsAffected === 1 };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { field: "other", reason: "unauthorized" });

		const formData = await request.formData();
		const id = formData.get("id");

		if (typeof id !== "string" || !/\d$/.test(id)) {
			return fail(400, { field: "id", reason: "requirements" });
		}

		const deleteResult = await db
			.delete(expenses)
			.where(and(eq(expenses.userId, locals.user.id), eq(expenses.id, Number(id))));

		if (!deleteResult.rowsAffected) {
			return fail(404, { field: "other", reason: "not-found" });
		}

		return { success: true };
	},
} satisfies Actions;
