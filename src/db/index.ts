import { IDatabase } from "./common/IDatabase";
import { Sequelize } from "sequelize";
import UserSequelizeEntity from "./entities/user/User";
import AdminSequelizeEntity from "./entities/admin/Admin";

export default class DBInstance {

    private static instance: IDatabase;

    public static async init(force: boolean = false) {
            const driver = new Sequelize(
                "LoginEndpoint",
                "root",
                "" //TODO: Replace with secret
                ,{
                host: "localhost",
                port: 3306,
                dialect: "mysql"
            });

            DBInstance.instance = {
                users: new UserSequelizeEntity(driver),
                admins: new AdminSequelizeEntity(driver)
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
