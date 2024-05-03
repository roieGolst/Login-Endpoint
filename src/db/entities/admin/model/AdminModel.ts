import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export default class AdminModel extends Model<InferAttributes<AdminModel>, InferCreationAttributes<AdminModel>> {
    readonly declare id: CreationOptional<string>;
    readonly declare username: string;
    readonly declare password: string;

    static initAdmin(driver: Sequelize): void {
        AdminModel.init(
            {
                id:{
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    unique: true,
                    allowNull: false
                },

                username: {
                    type: DataTypes.STRING(16),
                    primaryKey: true,
                    allowNull: false,
                },

                password: {
                    type: DataTypes.STRING(32)
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
