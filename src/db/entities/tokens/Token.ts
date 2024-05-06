import { Sequelize, UniqueConstraintError } from "sequelize";
import TokenModel from "./model/TokenModel";
import { ITokenEntity, TokenAttributes } from "./ITokenEntity";
import ActiveTokenModel from "./model/ActiveTokenModel";
import UserModel from "../user/model/UserModel";

export default class TokenEntity implements ITokenEntity {

    private readonly driver: Sequelize;

    constructor(driver: Sequelize) {
        this.driver = driver;

        TokenModel.initModel(this.driver);
        ActiveTokenModel.initModel(this.driver);

        //Set the relation between User to ActiveToken as One-To-,Many.
        UserModel.hasMany(TokenModel, {
            onDelete: "CASCADE"
        });
        TokenModel.belongsTo(UserModel);

        //Set the relation between User to ActiveToken as One-To-One.
        UserModel.hasOne(ActiveTokenModel, {
            onDelete: "CASCADE"
        });
        ActiveTokenModel.belongsTo(UserModel);
    }

    public async insertRefreshToken(token: TokenAttributes): Promise<boolean> {
        try {
            await TokenModel.create(
                {
                    userId: token.userId,
                    token: token.token,
                    expirationDate: token.expirationDate.toString()
                }
            );

            return true;
        } catch(err) {
            if(err instanceof UniqueConstraintError) {
                return false
            }
            return false
        }
    }
    public async getRefreshTokenListByUserId(id: string): Promise<TokenModel[]> {
        try {
            return await TokenModel.findAll({
                where: {
                    userId: id
                }
            });
        } catch (err) {
            return [];
        }
    }

    public async getRefreshTokenDetails(token: string): Promise<TokenModel | null> {
        try {
            return await TokenModel.findOne({
                where: {
                    token
                }
            });
        } catch (err) {
            return null;
        }
    }
     public async activateToken(token: string, userId: string): Promise<boolean> {
        try {
            await ActiveTokenModel.create(
                {
                    userId,
                    token,
                }
            )
            return true;
        } catch (err) {
            return false;
        }
    }
    public async deactivateToken(userId: string): Promise<boolean> {
        try {
            await ActiveTokenModel.destroy({
                where: {
                    userId
                }
            });

            return true;
        } catch (err ) {
            return false;
        }
    }
    public async hasActiveToken(id: string): Promise<boolean> {
        try {
            return await ActiveTokenModel.findByPk(id) !== null
        } catch (err) {
            return false
        }
    }
}