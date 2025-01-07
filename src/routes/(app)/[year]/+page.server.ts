import { db } from "$lib/server/db/index.js";
import { expenses } from "$lib/server/db/schema.js";
import { error } from "@sveltejs/kit";
import { and, eq, sql, sum } from "drizzle-orm";

export const load = async ({ locals, params }) => {
	if (!locals.user) error(401, { message: "unauthorized" });

	const { year } = params;
	if (!year || Number.isNaN(Number(year)) || !/^\d{4}$/.test(year))
		error(400, { message: "invalid-year" });
	const y = Number(year);

	const monthly = await db
		.select({
			cost: sum(expenses.cost).mapWith(Number).as("cost"),
			month: sql<number>`CAST (strftime('%m', datetime(paid_at, 'unixepoch')) AS INTEGER)`.as(
				"month",
			),
		})
		.from(expenses)
		.where(
			and(
				eq(expenses.userId, locals.user.id),
				eq(sql`CAST (strftime('%Y', datetime(paid_at, 'unixepoch')) AS INTEGER)`, y),
			),
		)
		.groupBy(sql`month`)
		.orderBy(sql`month`);

	return { monthly };
};
