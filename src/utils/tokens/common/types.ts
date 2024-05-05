export type UserSign = {
    id: string;
    username: string;
};

export type Tokens = {
    token: string;
    refreshToken: string;
};

export type RefreshToken = {
    refreshToken: string;
    expr: Date;
}