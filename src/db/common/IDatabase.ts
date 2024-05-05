import { IUserEntity } from "../entities/user/IUserEntity";
import { IAdminEntity } from "../entities/admin/IAdminEntity";
import { ITokenEntity } from "../entities/tokens/ITokenEntity";

export interface IDatabase {
    users: IUserEntity;
    admins: IAdminEntity;
    tokens: ITokenEntity;
}
