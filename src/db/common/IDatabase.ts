import { IUserEntity } from "../entities/user/IUserEntity";
import { ITokenEntity } from "../entities/tokens/ITokenEntity";

export interface IDatabase {
    users: IUserEntity;
    tokens: ITokenEntity;
}
