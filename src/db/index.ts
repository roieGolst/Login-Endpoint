import { IDatabase } from "./common/IDatabase";
import { Sequelize } from "sequelize";
import UserEntity from "./entities/user/User";
import TokenEntity from "./entities/tokens/Token";
import * as configs from "../configs/index";

const dbConfigs = configs.db;


export default class DbHelper {
    public static async init(force: boolean = false): Promise<IDatabase> {
        const driver = new Sequelize(
            dbConfigs.database,
            dbConfigs.auth.username,
            dbConfigs.auth.password
            ,{
            host: "localhost",
            port: dbConfigs.server.port,
            dialect: "mysql"
        });

        await driver.sync({alter: force});

        return {
            users: new UserEntity(driver),
            tokens: new TokenEntity(driver)
        };
    }
}
