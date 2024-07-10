import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { memberOfWorkplace, workplaces } from "./workplace";

export const users = sqliteTable("users", {
	token: text("token").notNull(),
	id: text("id").notNull().primaryKey().unique(),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	picture: text("picture").notNull(),
	provider: text("provider").notNull(),
	createdAt: text("created_at")
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
	memberOfWorkplace: many(memberOfWorkplace),
	ownerOfWorkplace: many(workplaces),
}));

export const insertUserSchema = createInsertSchema(users);
