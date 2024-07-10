import { integrations, invitations, users, workplaces } from "db/schemas/index";

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertWorkplace = typeof workplaces.$inferInsert;
export interface SelectWorkplace
	extends Omit<typeof workplaces.$inferSelect, "owner"> {
	owner: SelectUser;
}
export interface Workplace extends SelectWorkplace {
	integrations: SelectIntegration[];
	memberOfWorkplaces: MemberOfWorkplaces;
	invitations: Invitations;
}

export interface MemberOfWorkplace {
	userId: string;
	workplaceId: string;
	user: SelectUser;
	role: "admin" | "member";
	workplace: SelectWorkplace;
}
export interface MemberOfWorkplaces extends Array<MemberOfWorkplace> {}

export interface Workplaces extends Array<Workplace> {}

export type InsertIntegration = typeof integrations.$inferInsert;
export type SelectIntegration = typeof integrations.$inferSelect;

export type SelectInvitation = typeof invitations.$inferSelect & {
	invitedBy: SelectUser | null;
};
export type Invitations = Array<SelectInvitation>;
