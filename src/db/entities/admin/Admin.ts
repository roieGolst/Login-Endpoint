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

    async getAdminByUsername(username: string): Promise<AdminModel | null> {
        try {
            return await AdminModel.findOne({
                where: {
                    username
                }
            });
        } catch (err) {
            //TODO: Replace with error handling
            return null
        }
    }

    async getAdminById(id: string): Promise<AdminModel | null> {
        try {
            return await AdminModel.findByPk(id);
        } catch (err) {
            //TODO: Replace with error handling
            return null
        }
    }
}
