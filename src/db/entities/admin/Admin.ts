import { Sequelize, UniqueConstraintError } from "sequelize";
import AdminModel from "./model/AdminModel";
import { IAdminEntity, AdminAttributes } from "./IAdminEntity";

export default class AdminEntity implements IAdminEntity{

    private readonly driver: Sequelize;
    constructor(driver: Sequelize) {
        this.driver = driver;

        AdminModel.initModel(this.driver);
    }

    async insert(item: AdminAttributes): Promise<boolean> {
        try {
            await AdminModel.create(
                {
                    username: item.username,
                    password: item.hashPassword
                }
            )

            return true;
        }
        catch(err) {
            if(err instanceof UniqueConstraintError) {
                return false
            }
            return false
        }
    }

    async getUserByUsername(username: string): Promise<AdminModel | void> {
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

    async getUserById(id: string): Promise<AdminModel | void> {
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
