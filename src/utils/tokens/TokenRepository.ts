import jwt from "jsonwebtoken";
import { RefreshToken, Tokens, UserSign } from "./common/types";
import { ITokenEntity } from "../../db/entities/tokens/ITokenEntity";
import TokenModel from "../../db/entities/tokens/model/TokenModel";

const secret = "secr3t";

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
            secret, //TODO: inject secret
            { expiresIn: "10m" }//TODO: Replace with configuration
        );
    }

    private generateRefreshToken(userSing: UserSign): RefreshToken {
        this.safaRun();
        const expr = new Date();
        expr.setMonth(expr.getMonth() + 6); //TODO: Replace with configuration.

        return {
             refreshToken: jwt.sign(
                 {
                     userName: userSing.username,
                     id: userSing.id
                 },
                 secret, //TODO: Replace with inject secret
             ),
            expr
        }
    }

    public async getNewToken(userSign: UserSign, refreshToken: string): Promise<string> {
        this.safaRun();

        await this.authRefreshToken(refreshToken);
        return jwt.sign(userSign, secret);
    }

    private async authRefreshToken(refreshToken: string): Promise<void> {
        this.safaRun();

        const token = await this.tokenDb.getRefreshTokenDetails(refreshToken);

        if(!token) {
            //TODO: replace with error handling.
            throw new Error();
        }

        const isExpired = this.expiredCheck(token);

        if(isExpired) {
            //TODO: replace with error handling.
            throw new Error();
        }
    }

    public authToken(token: string): UserSign {
        this.safaRun();

        try {
            return jwt.verify(token, secret) as UserSign
        } catch (err) {
            //TODO: Replace with error handling
            throw new Error();
        }
    }

    private expiredCheck(token:  TokenModel): boolean {
        const nowTime = new Date();
        const exprTime = new Date(token.expirationDate);


        if(nowTime.toISOString() > exprTime.toISOString()){
            return false;
        }

        return true;
    }
}