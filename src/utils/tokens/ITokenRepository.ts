import { Tokens, UserSign } from "./common/types";

export interface ITokenRepository {
    authToken(token: string): UserSign | undefined
    generateTokens(sign: UserSign): Promise<Tokens>;
    getNewToken(userSign: UserSign, refreshToken: string): Promise<string>
}