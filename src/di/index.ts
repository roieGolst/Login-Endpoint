import { IDatabase } from "../db/common/IDatabase";
import DBInstance from "../db";

export class DependenciesInjection {
    private static dbInstance: IDatabase;

    static async getDbInstance(): Promise<IDatabase> {
        if(!DependenciesInjection.dbInstance) {
            DependenciesInjection.dbInstance = DBInstance.getInstance();
        }

        return  DependenciesInjection.dbInstance;
    }
}
