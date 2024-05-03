import { Sequelize, UniqueConstraintError } from "sequelize";
import UserModel from "./model/UserModel";
import { IUserEntity, UserAttributes } from "./IUserEntity";

export default class UserSequelizeEntity implements IUserEntity{

    private readonly driver: Sequelize;
    constructor(driver: Sequelize) {
        this.driver = driver;

        UserModel.initUser(this.driver);
    }

    async insert(item: UserAttributes): Promise<boolean> {
        try {
            await UserModel.create(
                {
                    email: item.email,
                    username: item.username,
                    password: item.hashPassword
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

    async getUserByUsername(username: string): Promise<UserModel | void> {
        // try {
        //     const user = await User.findByPk(username);
        //
        //     if(!user) {
        //         return {
        //             isSuccess: false,
        //             error: "User not defind"
        //         };
        //     }
        //
        //     return {
        //         isSuccess: true,
        //         value: user
        //     };
        // }
        // catch(err: unknown) {
        //     return {
        //         isSuccess: false,
        //         error: `${err}`
        //     };
        // }
    }

    async getUserById(id: string): Promise<UserModel | void> {
        // try {
        //     const user = await User.findOne({
        //         where: {id: id}
        //     });
        //
        //     if(!user) {
        //         return {
        //             isSuccess: false,
        //             error: "User not defind"
        //         };
        //     }
        //
        //     return {
        //         isSuccess: true,
        //         value: user
        //     };
        // }
        // catch(err: unknown) {
        //     return {
        //         isSuccess: false,
        //         error: `${err}`
        //     };
        // }
    }
}
