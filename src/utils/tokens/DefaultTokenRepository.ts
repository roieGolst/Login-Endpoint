import jwt from "jsonwebtoken";
import { RefreshToken, Tokens, UserSign } from "./common/types";
import { ITokenEntity } from "../../db/entities/tokens/ITokenEntity";
import TokenModel from "../../db/entities/tokens/model/TokenModel";
import { loginUseCase } from "../../configs";
import { ITokenRepository } from "./ITokenRepository";

const secret = "secr3t"; //TODO: Replace with inject secret

export class DefaultTokenRepository implements ITokenRepository{
    private tokenDb: ITokenEntity;

    constructor(db: ITokenEntity) {
        this.tokenDb = db;
    }

    public async generateTokens(sign: UserSign): Promise<Tokens> {
        const token = this.generateToken(sign);
        const refreshToken = this.generateRefreshToken(sign);

         await this.tokenDb.insertRefreshToken({
            userId: sign.id,
            token: refreshToken.refreshToken,
            expirationDate: refreshToken.expr
        });

         await this.tokenDb.activateToken(token, sign.id);
        return {
            token,
            refreshToken: refreshToken.refreshToken
        };
    }

    private generateToken(userSing: UserSign): string {
        return jwt.sign(
            {
            userName: userSing.username,
            id: userSing.id
            },
            secret,
            { expiresIn: loginUseCase.TOKEN_MINUTES_VALIDITY }
        );
    }

    private generateRefreshToken(userSing: UserSign): RefreshToken {
        const expr = new Date();
        expr.setMonth(expr.getMonth() + loginUseCase.REFRESH_TOKEN_MONTH_VALIDITY);

        return {
             refreshToken: jwt.sign(
                 {
                     userName: userSing.username,
                     id: userSing.id
                 },
                 secret,
             ),
            expr
        }
    }

    public async getNewToken(userSign: UserSign, refreshToken: string): Promise<string> {
        await this.authRefreshToken(refreshToken);

        //Deactivate the previous token first
        await this.tokenDb.deactivateToken(userSign.id);

        //Generating a new access token and assigning as active
        const token = this.generateToken(userSign);
        await this.tokenDb.activateToken(token, userSign.id)

        return token;
    }

    private async authRefreshToken(refreshToken: string): Promise<boolean> {
        const token = await this.tokenDb.getRefreshTokenDetails(refreshToken);

        if(!token) {
            return false;
        }

        const isExpired = this.expiredCheck(token);

        return !isExpired;
    }

    public authToken(token: string): UserSign | undefined {
        try {
            return jwt.verify(token, secret) as UserSign
        } catch (err) {
            return undefined;
        }
    }

    private expiredCheck(token:  TokenModel): boolean {
        const nowTime = new Date();
        const exprTime = new Date(token.expirationDate);


        return nowTime.toISOString() <= exprTime.toISOString();
    }
}

