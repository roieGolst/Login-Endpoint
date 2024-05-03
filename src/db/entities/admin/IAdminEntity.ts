import AdminModel from "./model/AdminModel";

export type AdminAttributes = {
    readonly username: string;
    readonly hashPassword: string;
}

export interface IAdminEntity {
    insert(user: AdminAttributes): Promise<boolean>;
    getUserByUsername(username: string): Promise<AdminModel | void>;
    getUserById(id: string): Promise<AdminModel | void>;
}
