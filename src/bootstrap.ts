import { DependenciesInjection } from "./di";
import { network } from "./configs";

export type BootstrapArgs = {
    dbInitializer: (force?: boolean) => Promise<void>;
}

export async function bootstrap(args: BootstrapArgs): Promise<void> {
     await args.dbInitializer(true);

     const db = await DependenciesInjection.getDbInstance();
     const networkLayer = await DependenciesInjection.getNetworkLayerInstance();

     networkLayer.listen(() => {
         console.log(`Sever bounded at port: ${network.port}`);
     })

     await db.users.insert({
         password: "123123", username: "Roie", email: "roiegols@fma.com", adminUser: true
     })
}