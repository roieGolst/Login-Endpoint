import TokenModel from "./model/TokenModel";

export type TokenAttributes = {
    readonly userId: string;
    readonly token: string;
    readonly expirationDate: Date;
}

export interface ITokenEntity {
    insertRefreshToken(token: TokenAttributes): Promise<boolean>;
    getRefreshTokenListByUserId(id: string): Promise<TokenModel[]>;
    getRefreshTokenDetails(token: string): Promise<TokenModel | null>;
    activateToken(token: string, userId: string): Promise<boolean>;
    deactivateToken(userId: string): Promise<boolean>;
    hasActiveToken(id: string): Promise<boolean>;
}