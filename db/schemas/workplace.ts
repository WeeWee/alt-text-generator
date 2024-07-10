import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, primaryKey, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./user";
import z from "zod";
export const workplaces = sqliteTable("workplaces", {
	id: text("id")
		.primaryKey()
		.default(sql`(uuid4())`)
		.unique(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	owner: text("owner")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: text("created_at")
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updateAt: text("updated_at").$onUpdate(() => new Date().toISOString()),
});
export const integrations = sqliteTable("integrations", {
	id: text("id")
		.primaryKey()
		.default(sql`(uuid4())`)
		.unique(),
	title: text("title").notNull(),
	endpoint: text("endpoint").notNull(),
	apiKey: text("api_key").notNull(),
	apiSecret: text("api_secret").notNull(),
	workplaceId: text("workplace_id")
		.notNull()
		.references(() => workplaces.id, { onDelete: "cascade" }),
	createdAt: text("created_at")
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updateAt: text("updated_at").$onUpdate(() => new Date().toISOString()),
});
export const memberOfWorkplace = sqliteTable(
	"member_of_workplace",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
				onUpdate: "no action",
			}),
		role: text("role", { enum: ["admin", "member"] })
			.notNull()
			.default("member"),
		workplaceId: text("workplace_id")
			.notNull()
			.references(() => workplaces.id, {
				onDelete: "cascade",
				onUpdate: "no action",
			}),
	},
	(table) => {
		return {
			workplaceMemberPkey: primaryKey({
				columns: [table.workplaceId, table.userId],
				name: "workplace_member_pkey",
			}),
		};
	}
);
export const invitations = sqliteTable(
	"workplace_invitations",
	{
		email: text("email").notNull(),
		workplaceId: text("workplace_id").references(() => workplaces.id, {
			onDelete: "cascade",
			onUpdate: "restrict",
		}),
		invitedById: text("invited_by_id").references(() => users.id, {
			onDelete: "cascade",
		}),
		createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	},
	(table) => {
		return {
			invitationWorkplaceIdEmailKey: unique(
				"invitation_unique_workplace_id_email_key"
			).on(table.workplaceId, table.email),
		};
	}
);
export const workplaceRelations = relations(workplaces, ({ one, many }) => ({
	memberOfWorkplaces: many(memberOfWorkplace),
	integrations: many(integrations),
	invitations: many(invitations),
	owner: one(users, {
		fields: [workplaces.owner],
		references: [users.id],
	}),
}));
export const invitationRelations = relations(invitations, ({ one }) => ({
	workplace: one(workplaces, {
		fields: [invitations.workplaceId],
		references: [workplaces.id],
	}),
	invitedBy: one(users, {
		fields: [invitations.invitedById],
		references: [users.id],
	}),
}));
export const integrationRelations = relations(integrations, ({ one }) => ({
	workplace: one(workplaces, {
		fields: [integrations.workplaceId],
		references: [workplaces.id],
	}),
}));
export const memberOfWorkplaces = relations(memberOfWorkplace, ({ one }) => ({
	user: one(users, {
		fields: [memberOfWorkplace.userId],
		references: [users.id],
	}),
	workplace: one(workplaces, {
		fields: [memberOfWorkplace.workplaceId],
		references: [workplaces.id],
	}),
}));
export const insertWorkplaceSchema = createInsertSchema(workplaces, {
	id: z.string().optional(),
	name: z.string().min(3).max(20),
	description: z.string().min(5).max(30),
	owner: z.string(),
	createdAt: z.string().optional(),
	updateAt: z.string().optional(),
});
