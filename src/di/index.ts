import { IDatabase } from "../db/common/IDatabase";
import DBInstance from "../db";
import { NetworkLayer } from "../networkLayer";
import { UserRepository } from "../utils/users/UserRepository";
import { TokenRepository } from "../utils/tokens/TokenRepository";

export class DependenciesInjection {
    private static dbInstance: IDatabase;
    private static networkLayerInstance: NetworkLayer;
    private static userRepository: UserRepository;
    private static tokenRepository: TokenRepository;

    static async getDbInstance(): Promise<IDatabase> {
        if(!DependenciesInjection.dbInstance) {
            DependenciesInjection.dbInstance = DBInstance.getInstance();
        }

        return  DependenciesInjection.dbInstance;
    }
    static async getNetworkLayerInstance(): Promise<NetworkLayer> {
        if(!DependenciesInjection.networkLayerInstance) {
            DependenciesInjection.networkLayerInstance = NetworkLayer.getInstance();
            await DependenciesInjection.networkLayerInstance.init();
        }

        return  DependenciesInjection.networkLayerInstance;
    }

    static async getUserRepositoryInstance(): Promise<UserRepository> {
        if(!DependenciesInjection.userRepository) {
            //Initialize the database instance first.
            await DependenciesInjection.getDbInstance();

            DependenciesInjection.userRepository = UserRepository.getInstance();

            DependenciesInjection.userRepository.init(
                DependenciesInjection.dbInstance.users,
                DependenciesInjection.dbInstance.tokens,
                );
        }

        return DependenciesInjection.userRepository;
    }

    static async getTokenRepositoryInstance(): Promise<TokenRepository> {
        if(!DependenciesInjection.tokenRepository) {
            //Initialize the database instance first.
            await DependenciesInjection.getDbInstance();

            DependenciesInjection.tokenRepository = TokenRepository.getInstance();
            DependenciesInjection.tokenRepository.init(DependenciesInjection.dbInstance.tokens);
        }

        return DependenciesInjection.tokenRepository;
    }
}
