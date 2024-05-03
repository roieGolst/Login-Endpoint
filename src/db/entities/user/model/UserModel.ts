import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export default class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    readonly declare id: CreationOptional<string>;
    readonly declare email: string;
    readonly declare username: string;
    readonly declare password: string;

    static initUser(driver: Sequelize): void {
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
                    type: DataTypes.STRING(16),
                    primaryKey: true,
                    allowNull: false,
                },

                password: {
                    type: DataTypes.STRING(32),
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