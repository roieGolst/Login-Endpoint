import { IUserEntity } from "../entities/user/IUserEntity";
import { IAdminEntity } from "../entities/admin/IAdminEntity";

export interface IDatabase {
    users: IUserEntity;
    admins: IAdminEntity;
}
