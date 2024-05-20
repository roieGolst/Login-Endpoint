import { NewUserPayload } from "../../db/entities/user/IUserEntity";

export type User = {
    readonly id: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly adminUser: boolean;
}

export interface IUserRepository {
    getUserByIdentifier(identifier: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[] | []>;

    register(requiredUser: NewUserPayload): Promise<boolean>;
    registerAdminUser(adminUser: NewUserPayload): Promise<boolean>;

    updateEmail(user: User, requiredEmail: string): Promise<boolean>;
    updatePassword(user: User, requiredPassword: string): Promise<boolean>;
    deleteUser(user: User): Promise<boolean>;

    isNotLoggedIn(user: User): Promise<boolean>;
    isRegistered(identifier: string): Promise<boolean>;
    isAdmin(user: User): Promise<boolean>;
}