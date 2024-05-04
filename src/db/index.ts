import { IDatabase } from "./common/IDatabase";
import { Sequelize } from "sequelize";
import UserEntity from "./entities/user/User";
import AdminEntity from "./entities/admin/Admin";
import * as configs from "../configs/index";

const dbConfigs = configs.db;

export default class DBInstance {

    private static instance: IDatabase;

    public static async init(force: boolean = false) {
            const driver = new Sequelize(
                dbConfigs.database,
                dbConfigs.auth.username,
                dbConfigs.auth.password
                ,{
                host: dbConfigs.server.host,
                port: dbConfigs.server.port,
                dialect: "mysql"
            });

            DBInstance.instance = {
                users: new UserEntity(driver),
                admins: new AdminEntity(driver)
            };

            await driver.authenticate();
            await driver.sync({force});
    }

    public static getInstance(): IDatabase {
        if(!DBInstance.instance) {
            throw new Error("Can't access to 'Instance' before init function");
        }
        return DBInstance.instance;
    }

}
