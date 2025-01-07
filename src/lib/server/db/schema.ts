import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	id: text("id", { length: 32 }).primaryKey(),
	email: text("email", { length: 64 }).notNull().unique(),
	passwordHash: text("password_hash", { length: 2048 }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(userSessions),
	expenses: many(expenses),
}));

export const userSessions = sqliteTable("user_session", {
	id: text("id", { length: 64 }).primaryKey(),
	userId: text("user_id", { length: 32 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const userSessionRelations = relations(userSessions, ({ one }) => ({
	user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));

export const expenses = sqliteTable("expense", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id", { length: 32 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: text("name", { length: 64 }).notNull(),
	cost: real("cost").notNull(),
	category: text("category", { enum: ["tax", "grocery", "tech", "gift", "other"] }).notNull(),
	note: text("note", { length: 256 }).notNull(),
	paidAt: integer("paid_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const expensesRelations = relations(expenses, ({ one }) => ({
	user: one(users, { fields: [expenses.userId], references: [users.id] }),
}));
