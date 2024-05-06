import { Model, DataTypes, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize";
import * as configs from "../../../../configs/index";

export default class TokenModel extends Model<InferAttributes<TokenModel>, InferCreationAttributes<TokenModel>> {
    readonly declare userId: string;
    readonly declare token: string;
    readonly declare expirationDate: string;

    static initModel(driver: Sequelize): void {
        TokenModel.init(
            {
                userId: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    allowNull: false,
                },

                token: {
                    type: DataTypes.STRING,
                    allowNull: false
                },

                expirationDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        isDate: {
                            msg: "Must be type of 'Data'",
                            args: true
                        }
                    }
                }
            },

            {
                sequelize: driver,
                tableName: "tokens",
                timestamps: true
            }
        )
    }
};
