export interface User {
  id?: number
  first_name: string
  last_name: string
  email: string | null
  kthid: string
  ugkthid: string
  admin?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Role {
  id?: number
  title: string
  description?: string
  identifier: string
  email: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
  GroupId?: number
  Group?: Group
  Mandates?: Mandate[]
}

export interface Group {
  id?: number
  name: string
  identifier: string
  createdAt?: string
  updatedAt?: string
}

export interface Mandate {
  start: string
  end: string
  User?: User
  Role?: Role
}

export type Roles = Role[]

export interface RoleMandates {
  role: Role
  mandates: Mandate[]
}

export interface UserMandates {
  user: User
  mandates: Mandate[]
}

export type Users = User[]