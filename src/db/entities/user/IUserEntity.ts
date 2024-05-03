import UserModel from "./model/UserModel";

export type UserAttributes = {
    readonly email: string;
    readonly username: string;
    readonly hashPassword: string;
}

export interface IUserEntity {
    insert(user: UserAttributes): Promise<boolean>;
    getUserByUsername(username: string): Promise<UserModel | void>;
    getUserById(id: string): Promise<UserModel | void>;
}
