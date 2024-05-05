import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import * as configs from "../../../../configs/index";

export default class AdminModel extends Model<InferAttributes<AdminModel>, InferCreationAttributes<AdminModel>> {
    readonly declare id: CreationOptional<string>;
    readonly declare username: string;
    readonly declare password: string;

    static initModel(driver: Sequelize): void {
        AdminModel.init(
            {
                id:{
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    unique: true,
                    allowNull: false
                },

                username: {
                    type: DataTypes.STRING(configs.admin.USERNAME_MAX_LENGTH),
                    primaryKey: true,
                    allowNull: false,
                },

                password: {
                    type: DataTypes.STRING(configs.admin.PASSWORD_MAX_LENGTH)
                }
            },

            {
                sequelize: driver,
                tableName: "Admin",
                timestamps: false
            }
        )
    }
};
