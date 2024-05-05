import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import * as configs from "../../../../configs/index";

export default class ActiveTokenModel extends Model<InferAttributes<ActiveTokenModel>, InferCreationAttributes<ActiveTokenModel>> {
    readonly declare userId: string;
    readonly declare token: string;
    readonly declare expirationDate: string;

    static initModel(driver: Sequelize): void {
        ActiveTokenModel.init(
            {
                userId: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    allowNull: false,
                },

                token: {
                    type: DataTypes.STRING(configs.admin.PASSWORD_MAX_LENGTH),
                    allowNull: false
                },

                expirationDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        isDate: {
                            msg: "Must be type of 'Date'",
                            args: true
                        }
                    }
                }
            },

            {
                sequelize: driver,
                tableName: "active-tokens",
                timestamps: false
            }
        )
    }
};
