import { db } from "$lib/server/db/index.js";
import { expenses } from "$lib/server/db/schema.js";
import { error } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";

export const load = async ({ locals, params }) => {
	if (!locals.user) error(401, { message: "unauthorized" });

	const { year, month } = params;
	if (!year || Number.isNaN(Number(year)) || !/^\d{4}$/.test(year))
		error(400, { message: "invalid-year" });
	if (!month || Number.isNaN(Number(month)) || !/^(1[0-2]|[1-9])$/.test(month))
		error(400, { message: "invalid-month" });
	const [y, m] = [Number(year), Number(month)];

	const data = await db
		.select({
			id: expenses.id,
			name: expenses.name,
			cost: expenses.cost,
			category: expenses.category,
			note: expenses.note,
			paidAt: expenses.paidAt,
		})
		.from(expenses)
		.where(
			and(
				eq(expenses.userId, locals.user.id),
				eq(sql`CAST (strftime('%m', datetime(paid_at, 'unixepoch')) AS INTEGER)`, m),
				eq(sql`CAST (strftime('%Y', datetime(paid_at, 'unixepoch')) AS INTEGER)`, y),
			),
		)
		.orderBy(expenses.paidAt);

	return { expenses: data };
};
