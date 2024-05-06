import { Sequelize, UniqueConstraintError } from "sequelize";
import UserModel from "./model/UserModel";
import { IUserEntity, UserAttributes } from "./IUserEntity";

export default class UserEntity implements IUserEntity {

    private readonly driver: Sequelize;
    constructor(driver: Sequelize) {
        this.driver = driver;

        UserModel.initModel(this.driver);
    }

    public async insert(item: UserAttributes): Promise<boolean> {
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

    public async getUserByUsername(username: string): Promise<UserModel | null> {
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

    public async getAllUsers(): Promise<UserModel[] | []> {
        try {
            return UserModel.findAll();
        } catch (err) {
            return [];
        }
    }

    public async getUserByEmail(email: string): Promise<UserModel | null> {
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

    public async getUserById(id: string): Promise<UserModel | null> {
        try {
            return await UserModel.findOne({
                where: {
                    id
                }
            });
        } catch (err) {
            return null;
        }
    }
    public async updateUserEmail(user: UserModel, updatedEmail: string): Promise<boolean> {
        try {
            await user.update("email", updatedEmail);
            return true;
        } catch (err) {
            return false;
        }
    }
    public async updateUserPassword(user: UserModel, updatedPassword: string): Promise<boolean> {
        try {
            await user.update("password", updatedPassword);
            return true;
        } catch (err) {
            return false;
        }
    }
    public async deleteUser(user: UserModel): Promise<boolean> {
        try {
            await user.destroy();
            return true;
        } catch (err) {
            return false;
        }
    }
}