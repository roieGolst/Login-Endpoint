import { IUserEntity, NewUserPayload, NullableUser } from "../../db/entities/user/IUserEntity";
import { ITokenEntity } from "../../db/entities/tokens/ITokenEntity";
import bcrypt from "bcrypt";
import { loginUseCase } from "../../configs";
import { IUserRepository, User } from "./IUserRepository";



export class DefaultUserRepository implements IUserRepository {
    private readonly userDb: IUserEntity;
    private tokenDb: ITokenEntity;

    constructor(userDb: IUserEntity, tokenDb: ITokenEntity) {
        this.userDb = userDb;
        this.tokenDb = tokenDb;
    }

    public async getUserByIdentifier(identifier: string): Promise<User | null> {
        try {
            const userByName: NullableUser = await this.userDb.getUserByUsername(identifier);
            const userByEmail: NullableUser = await this.userDb.getUserByEmail(identifier);

            return userByName || userByEmail;
        } catch (err: unknown) {
            return null;
        }
    }
    public async getUserById(id: string): Promise<User | null> {
        return await this.userDb.getUserById(id) as User;
    }

    public async getAllUsers(): Promise<User[] | []> {
        return this.userDb.getAllUsers();
    }

    public async register(requiredUser: NewUserPayload): Promise<boolean> {
       try {
           if(await this.isRegistered(requiredUser.email) || await this.isRegistered(requiredUser.username)) {
               return false;
           }

           return  await this.userDb.insert({
               username: requiredUser.username,
               email: requiredUser.email,
               password: this.hashPassword(requiredUser.password),
               adminUser: false
           });
       } catch (err) {
           return false
       }
    }

    public async registerAdminUser(adminUser: NewUserPayload): Promise<boolean> {
        return  await this.userDb.insert({
            username: adminUser.username,
            email: adminUser.email,
            password: bcrypt.hashSync(adminUser.password, loginUseCase.PASSWORD_SALT_ROUNDS),
            adminUser: true
        });
    }

    public async isRegistered(identifier: string): Promise<boolean> {
        try {
             const userByName: NullableUser = await this.userDb.getUserByUsername(identifier);
             const userByEmail: NullableUser = await this.userDb.getUserByEmail(identifier);

            return (userByName || userByEmail) != null;
        } catch (err: unknown) {
            return false;
        }
    }

    public async isNotLoggedIn(user: User): Promise<boolean> {
        return !await this.tokenDb.hasActiveToken(user.id);
    }

    public async isAdmin(user: User): Promise<boolean> {
        try {
            const queriedUser: NullableUser = await this.userDb.getUserById(user.id);

            if(!queriedUser) {
                return false;
            }

            return queriedUser.adminUser;
        } catch (err) {
            return false;
        }
    }

    public async updateEmail(user: User, requiredEmail: string): Promise<boolean> {
        try {
            const queriedUser: NullableUser = await this.userDb.getUserByUsername(user.username);

            if(!queriedUser) {
                return false;
            }

            return await this.userDb.updateUserEmail(queriedUser, requiredEmail);
        } catch (err) {
            return false;
        }
    }
    public async updatePassword(user: User, requiredPassword: string): Promise<boolean> {
        try {
            const queriedUser: NullableUser = await this.userDb.getUserById(user.id);

            if(!queriedUser) {
                return false;
            }

            return await this.userDb.updateUserPassword(queriedUser, this.hashPassword(requiredPassword));
        } catch (err) {
            return false;
        }
    }
    public async deleteUser(user: User): Promise<boolean> {
        try {
            const queriedUser: NullableUser = await this.userDb.getUserById(user.id);

            if(!queriedUser) {
                return false;
            }

            return await this.userDb.deleteUser(queriedUser);
        } catch (err) {
            return false;
        }
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, loginUseCase.PASSWORD_SALT_ROUNDS);
    }
}