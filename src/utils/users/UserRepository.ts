import { IUserEntity, UserAttributes } from "../../db/entities/user/IUserEntity";
import UserModel from "../../db/entities/user/model/UserModel";
import { ITokenEntity } from "../../db/entities/tokens/ITokenEntity";
import { DependenciesInjection } from "../../di";
import bcrypt from "bcrypt";
import { loginUseCase } from "../../configs";

export class UserRepository {
    private static INSTANCE: UserRepository;
    private userDb: IUserEntity;
    private tokenDb: ITokenEntity;

    private constructor() {
    }

    public static getInstance(): UserRepository {
        if(!UserRepository.INSTANCE) {
            UserRepository.INSTANCE = new UserRepository();
        }

        return UserRepository.INSTANCE;
    }

    public init(userDb: IUserEntity, tokenDb: ITokenEntity) {
        this.userDb = userDb;
        this.tokenDb = tokenDb;
    }

    private safaRun(): void {
        if(!this.userDb) {
            throw new Error("Must init the class before");
        }
    }

    public async getUser(identifier: string): Promise<UserModel | null> {
        return this.findByIdentifier(identifier);
    }

    public async getAllUsers(): Promise<UserModel[] | []> {
        return this.userDb.getAllUsers();
    }

    public async register(requiredUser: UserAttributes): Promise<boolean> {
       try {
           if(await this.isRegistered(requiredUser.email) || await this.isRegistered(requiredUser.username)) {
               return false;
           }

           return  await this.userDb.insert({
               username: requiredUser.username,
               email: requiredUser.email,
               password: this.hashPassword(requiredUser.password)
           });
       } catch (err) {
           return false
       }
    }

    public async registerAdminUser(adminUser: UserAttributes): Promise<boolean> {
        return  await this.userDb.insert({
            username: adminUser.username,
            email: adminUser.email,
            password: bcrypt.hashSync(adminUser.password, loginUseCase.PASSWORD_SALT_ROUNDS),
            adminUser: true
        });
    }

    public async isSafaLogin(identifier: string): Promise<UserModel | never> {
        this.safaRun();

        const user = await this.findByIdentifier(identifier);

        if (!(user && await this.isNotLoggedIn(user.id))) {
            throw new Error()//TODO: Replace with error handling
        }

        return user;
    }

    private async findByIdentifier(identifier: string): Promise<UserModel | null> {
        try {
            const userByName = await this.userDb.getUserByUsername(identifier);
            const userByEmail = await this.userDb.getUserByEmail(identifier);

            return userByName || userByEmail
        } catch (err: unknown) {
            return null;
        }
    }

    public async isRegistered(identifier: string): Promise<boolean> {
        try {
             const userByName = await this.userDb.getUserByUsername(identifier);
             const userByEmail = await this.userDb.getUserByEmail(identifier);

            return (userByName || userByEmail) != null;
        } catch (err: unknown) {
            return false;
        }
    }

    private async isNotLoggedIn(userId: string): Promise<boolean> {
        return !await this.tokenDb.hasActiveToken(userId);
    }

    public async isAdmin(userId: string): Promise<boolean> {
        try {
            const user = await this.userDb.getUserById(userId);

            if(!user) {
                return false;
            }

            return user.adminUser;
        } catch (err) {
            return false;
        }
    }

    public async updateEmail(username: string, requiredEmail: string): Promise<boolean> {
        try {
            const user = await this.userDb.getUserByUsername(username);

            if(!user) {
                return false;
            }

            return await this.userDb.updateUserEmail(user, requiredEmail);
        } catch (err) {
            return false;
        }
    }
    public async updatePassword(identifier: string, requiredPassword: string): Promise<boolean> {
        try {
            const user = await this.findByIdentifier(identifier);

            if(!user) {
                return false;
            }

            return await this.userDb.updateUserPassword(user, this.hashPassword(requiredPassword));
        } catch (err) {
            return false;
        }
    }
    public async deleteUser(userId: string): Promise<boolean> {
        try {
            const user = await this.userDb.getUserById(userId);

            if(!user) {
                return false;
            }

            return await this.userDb.deleteUser(user);
        } catch (err) {
            return false;
        }
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, loginUseCase.PASSWORD_SALT_ROUNDS);
    }
}