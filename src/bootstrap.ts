import { DependenciesInjection } from "./di";
import { network } from "./configs";

export type BootstrapArgs = {
    dbInitializer: (force?: boolean) => Promise<void>;
}

export async function bootstrap(args: BootstrapArgs): Promise<void> {
     await args.dbInitializer();

     const db = await DependenciesInjection.getDbInstance();
     const networkLayer = await DependenciesInjection.getNetworkLayerInstance();

     networkLayer.listen(() => {
         console.log(`Sever bounded at port: ${network.port}`);
     });
}