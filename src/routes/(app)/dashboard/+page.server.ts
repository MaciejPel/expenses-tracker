import { db } from "$lib/server/db/index.js";
import { expenses } from "$lib/server/db/schema.js";
import { error, fail, type Actions } from "@sveltejs/kit";
import { desc, eq, sql, sum } from "drizzle-orm";

export const load = async ({ locals }) => {
	if (!locals.user) error(401, { message: "unauthorized" });

	const yearly = await db
		.select({
			total: sum(expenses.cost).mapWith(Number),
			year: sql<number>`strftime('%Y', datetime(paid_at, 'unixepoch')) year`.mapWith(Number),
		})
		.from(expenses)
		.where(eq(expenses.userId, locals.user?.id))
		.groupBy(sql`year`)
		.orderBy(desc(sql`year`));

	return { yearly };
};

export const actions = {
	add: async (event) => {
		if (!event.locals.user) return fail(401, { message: "unauthorized" });

		const formData = await event.request.formData();
		const [name, cost, paidAt, category, note] = [
			formData.get("name"),
			formData.get("cost"),
			formData.get("paid_at"),
			formData.get("category"),
			formData.get("note"),
		];

		if (typeof name !== "string") {
			return fail(400, { field: "name", reason: "requirements" });
		}
		if (typeof cost !== "string" || !cost || Number.isNaN(Number(cost))) {
			return fail(400, { field: "cost", reason: "requirements" });
		}
		if (typeof category !== "string" || !category) {
			return fail(400, { field: "category", reason: "requirements" });
		}
		if (typeof note !== "string") {
			return fail(400, { field: "note", reason: "requirements" });
		}
		if (typeof paidAt !== "string" || !paidAt) {
			return fail(400, { field: "paid_at", reason: "requirements" });
		}

		const insertResult = await db.insert(expenses).values({
			name,
			cost: Number(cost),
			paidAt: new Date(paidAt),
			category: category as typeof expenses.$inferSelect.category,
			note,
			userId: event.locals.user.id,
		});

		return { success: insertResult.rowsAffected === 1 };
	},
	edit: async (event) => {
		if (!event.locals.user) return fail(401, { message: "unauthorized" });

		const formData = await event.request.formData();
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
		if (typeof name !== "string") {
			return fail(400, { field: "name", reason: "requirements" });
		}
		if (typeof cost !== "string" || !cost || Number.isNaN(Number(cost))) {
			return fail(400, { field: "cost", reason: "requirements" });
		}
		if (typeof category !== "string" || !category) {
			return fail(400, { field: "category", reason: "requirements" });
		}
		if (typeof note !== "string") {
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
				userId: event.locals.user.id,
			})
			.where(eq(expenses.id, Number(id)));

		return { success: insertResult.rowsAffected === 1 };
	},

	delete: async (event) => {
		if (!event.locals.user) return fail(401, { message: "unauthorized" });

		const formData = await event.request.formData();
		const id = formData.get("id");

		if (typeof id !== "string" || !/\d$/.test(id)) {
			return fail(400, { field: "id", reason: "requirements" });
		}

		const deleteResult = await db.delete(expenses).where(eq(expenses.id, Number(id)));

		return { success: deleteResult.rowsAffected === 1 };
	},
} satisfies Actions;
