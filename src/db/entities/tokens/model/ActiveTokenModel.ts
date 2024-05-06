import { Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize";
import * as configs from "../../../../configs/index";

export default class ActiveTokenModel extends Model<InferAttributes<ActiveTokenModel>, InferCreationAttributes<ActiveTokenModel>> {
    readonly declare userId: string;
    readonly declare token: string;

    static initModel(driver: Sequelize): void {
        ActiveTokenModel.init(
            {
                userId: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    allowNull: false,
                },

                token: {
                    type: DataTypes.STRING,
                    allowNull: false
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
