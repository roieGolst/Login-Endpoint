import { DependenciesInjection } from "./di";
import { network } from "./configs";
import { IDatabase } from "./db/common/IDatabase";

export type BootstrapArgs = {
    dbInitializer: (force?: boolean) => Promise<IDatabase>;
}

export async function bootstrap(args: BootstrapArgs): Promise<void> {

     await DependenciesInjection.init(
         await args.dbInitializer(true)
     );

     const networkLayer = DependenciesInjection.provideNetworkLayer();

     networkLayer.listen(() => {
         console.log(`Sever bounded at port: ${network.port}`);
     });
}