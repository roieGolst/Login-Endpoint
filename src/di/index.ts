import { IDatabase } from "../db/common/IDatabase";
import { NetworkLayer } from "../networkLayer";
import { IUserRepository } from "../utils/users/IUserRepository";
import { ITokenRepository } from "../utils/tokens/ITokenRepository";
import { DefaultUserRepository } from "../utils/users/DefaultUserRepository";
import { DefaultTokenRepository } from "../utils/tokens/DefaultTokenRepository";

export class DependenciesInjection {
    private static dbInstance: IDatabase;
    private static networkLayer: NetworkLayer;
    private static userRepository: IUserRepository;
    private static tokenRepository: ITokenRepository;
    private static isInit: boolean;

    public static async init(db: IDatabase): Promise<void> {
        if(!DependenciesInjection.isInit) {
            DependenciesInjection.dbInstance = db;

            DependenciesInjection.userRepository = new DefaultUserRepository(
                DependenciesInjection.dbInstance.users,
                DependenciesInjection.dbInstance.tokens,
            );

            DependenciesInjection.tokenRepository = new DefaultTokenRepository(
                DependenciesInjection.dbInstance.tokens
            );


            DependenciesInjection.networkLayer = NetworkLayer.getInstance();
            await DependenciesInjection.networkLayer.init();

            DependenciesInjection.isInit = true;
        }
    }

    public static provideDb(): IDatabase {
        return  DependenciesInjection.dbInstance;
    }

    public static provideNetworkLayer(): NetworkLayer {
        return  DependenciesInjection.networkLayer;
    }

    public static provideUserRepository(): IUserRepository {
        return DependenciesInjection.userRepository;
    }

    public static provideTokenRepository(): ITokenRepository {
        return DependenciesInjection.tokenRepository;
    }
}
