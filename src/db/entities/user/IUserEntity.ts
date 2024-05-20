import UserModel from "./model/UserModel";

export type NewUserPayload = {
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly adminUser: boolean;
}

export type NullableUser = UserModel | null;

export interface IUserEntity {
    insert(user: NewUserPayload): Promise<boolean>;

    getUserByUsername(username: string): Promise<NullableUser>;
    getUserById(id: string): Promise<NullableUser>;
    getUserByEmail(email: string): Promise<NullableUser>;
    getAllUsers(): Promise<UserModel[]>;

    updateUserEmail(user: UserModel, updatedEmail: string): Promise<boolean>;
    updateUserPassword(user: UserModel, updatedPassword: string): Promise<boolean>;
    deleteUser(user: UserModel): Promise<boolean>;
}
