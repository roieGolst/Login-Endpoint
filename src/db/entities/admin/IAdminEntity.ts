import AdminModel from "./model/AdminModel";

export type AdminAttributes = {
    readonly username: string;
    readonly hashPassword: string;
}

export interface IAdminEntity {
    insert(user: AdminAttributes): Promise<boolean>;
    getAdminByUsername(username: string): Promise<AdminModel | null>;
    getAdminById(id: string): Promise<AdminModel | null>;
}
