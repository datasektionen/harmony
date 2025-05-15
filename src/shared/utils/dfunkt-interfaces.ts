export type User = {
	id?: number;
	first_name: string;
	last_name: string;
	email: string | null;
	kthid: string;
	ugkthid: string;
	admin?: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type Role = {
	id?: number;
	title: string;
	description?: string;
	identifier: string;
	email: string;
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;
	GroupId?: number;
	Group?: Group;
	Mandates?: Mandate[];
};

export type Group = {
	id?: number;
	name: string;
	identifier: string;
	createdAt?: string;
	updatedAt?: string;
};

export type Mandate = {
	start: string;
	end: string;
	User?: User;
	Role?: Role;
};

export type Roles = Role[];

export type RoleMandates = {
	role: Role;
	mandates: Mandate[];
};

export type UserMandates = {
	user: User;
	mandates: Mandate[];
};

export type Users = User[];
