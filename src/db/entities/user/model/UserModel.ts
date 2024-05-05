import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import * as configs from "../../../../configs/index";

export default class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    readonly declare id: CreationOptional<string>;
    readonly declare email: string;
    readonly declare username: string;
    readonly declare password: string;
    readonly declare adminUser: CreationOptional<boolean>;

    static initModel(driver: Sequelize): void {
        UserModel.init(
            {
                id:{
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    unique: true,
                    allowNull: false
                },

                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: {
                            msg: "Must be a valid email address"
                        }
                    }
                },

                username: {
                    type: DataTypes.STRING(configs.user.USERNAME_MAX_LENGTH),
                    primaryKey: true,
                    allowNull: false,
                },

                password: {
                    type: DataTypes.STRING(configs.user.PASSWORD_MAX_LENGTH),
                    allowNull: false
                },

                adminUser: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            },

            {
                sequelize: driver,
                tableName: "Users",
                timestamps: false
            }
        )
    }
};
