import jwt from "jsonwebtoken";
import { RefreshToken, Tokens, UserSign } from "./common/types";
import { ITokenEntity } from "../../db/entities/tokens/ITokenEntity";
import TokenModel from "../../db/entities/tokens/model/TokenModel";
import { loginUseCase } from "../../configs";

const secret = "secr3t"; //TODO: Replace with inject secret

export class TokenRepository {
    private static INSTANCE: TokenRepository;
    private tokenDb: ITokenEntity;

    private constructor() {
    }

    public static getInstance(): TokenRepository {
        if(!TokenRepository.INSTANCE) {
            TokenRepository.INSTANCE = new TokenRepository();
        }

        return TokenRepository.INSTANCE;
    }

    public init(db: ITokenEntity) {
        this.tokenDb = db;
    }

    private safaRun(): void {
        if(!this.tokenDb) {
            throw new Error("Must init the class before");
        }
    }

    public async generateTokens(sign: UserSign): Promise<Tokens> {
        this.safaRun();

        const token = this.generateToken(sign);
        const refreshToken = this.generateRefreshToken(sign);

         await this.tokenDb.insertRefreshToken({
            userId: sign.id,
            token: refreshToken.refreshToken,
            expirationDate: refreshToken.expr
        });
        return {
            token,
            refreshToken: refreshToken.refreshToken
        }
    }

    private generateToken(userSing: UserSign): string {
        this.safaRun();
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
        this.safaRun();
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
        this.safaRun();

        await this.authRefreshToken(refreshToken);
        return jwt.sign(userSign, secret);
    }

    private async authRefreshToken(refreshToken: string): Promise<boolean> {
        this.safaRun();

        const token = await this.tokenDb.getRefreshTokenDetails(refreshToken);

        if(!token) {
            return false;
        }

        const isExpired = this.expiredCheck(token);

        return !isExpired;
    }

    public authToken(token: string): UserSign | undefined {
        this.safaRun();

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