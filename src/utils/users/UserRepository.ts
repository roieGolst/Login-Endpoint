import { IUserEntity, UserAttributes } from "../../db/entities/user/IUserEntity";
import UserModel from "../../db/entities/user/model/UserModel";
import { ITokenEntity } from "../../db/entities/tokens/ITokenEntity";

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

    public init(db: IUserEntity) {
        this.userDb = db;
    }

    private safaRun(): void {
        if(!this.userDb) {
            throw new Error("Must init the class before");
        }
    }

    public async isSafaLogin(identifier: string): Promise<UserModel | never> {
        this.safaRun();

        const user = await this.isRegistered(identifier);

        if (!(user && this.isNotLoggedIn(user.id))) {
            throw new Error()//TODO: Replace with error handling
        }

        return user;
    }

    private async isRegistered(identifier: string): Promise<UserModel | null> {
        try {
             const userByName = await this.userDb.getUserByUsername(identifier);
             const userByEmail = await this.userDb.getUserByEmail(identifier);

            return userByEmail || userByEmail;
        } catch (err: unknown) {
            //TODO: Replace with error handling.
            return null;
        }
    }

    private isNotLoggedIn(userId: string): boolean {
        return !this.tokenDb.hasActiveToken(userId);
    }

    public async isAdmin(userId: string): Promise<boolean> {
        try {
            const user = await this.userDb.getUserById(userId);

            if(!user) {
                //TODO: Replace with error handling
                throw new Error();
            }

            return user.adminUser;
        } catch (err) {
            return false;
        }
    }
}