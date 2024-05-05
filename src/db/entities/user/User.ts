import { Sequelize, UniqueConstraintError } from "sequelize";
import UserModel from "./model/UserModel";
import { IUserEntity, UserAttributes } from "./IUserEntity";

export default class UserEntity implements IUserEntity {

    private readonly driver: Sequelize;
    constructor(driver: Sequelize) {
        this.driver = driver;

        UserModel.initModel(this.driver);
    }

    async insert(item: UserAttributes): Promise<boolean> {
        try {
            await UserModel.create(
                {
                    email: item.email,
                    username: item.username,
                    password: item.password,
                    adminUser: item.adminUser
                }
            )

            return true;
        }
        catch(err) {
            if(err instanceof UniqueConstraintError) {
                throw err;
            }
            throw err;
        }
    }

    async getUserByUsername(username: string): Promise<UserModel | null> {
        try {
            return UserModel.findOne({
                where: {
                    username
                }
            })
        } catch (err) {
            return null;
        }
    }
    async getUserByEmail(email: string): Promise<UserModel | null> {
        try {
            return UserModel.findOne({
                where: {
                    email
                }
            })
        } catch (err) {
            return null;
        }
    }

    async getUserById(id: string): Promise<UserModel | null> {
        try {
            return UserModel.findByPk(id);
        } catch (err) {
            return null;
        }
    }
}