import UserModel from "./model/UserModel";

export type UserAttributes = {
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly adminUser?: boolean;
}

export interface IUserEntity {
    insert(user: UserAttributes): Promise<boolean>;
    getUserByUsername(username: string): Promise<UserModel | null>;
    getAllUsers(): Promise<UserModel[] | []>;
    getUserById(id: string): Promise<UserModel | null>;
    getUserByEmail(email: string): Promise<UserModel | null>;
    updateUserEmail(user: UserModel, updatedEmail: string): Promise<boolean>;
    updateUserPassword(user: UserModel, updatedPassword: string): Promise<boolean>;
    deleteUser(user: UserModel): Promise<boolean>;
}
