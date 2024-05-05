import { DependenciesInjection } from "./di";

export type BootstrapArgs = {
    dbInitializer: (force?: boolean) => Promise<void>;
}

export async function bootstrap(args: BootstrapArgs): Promise<void> {
     await args.dbInitializer(true);

     const db = await DependenciesInjection.getDbInstance();

     // await db.users.insert({
     //     hashPassword: "123123", username: "Roie", email: "roiegols@fma.com", adminUser: true
     // })
}
