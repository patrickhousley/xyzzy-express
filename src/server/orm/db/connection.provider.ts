import { interfaces } from 'inversify';
import { BlackCard } from 'src/server/orm/entities/BlackCard';
import { CardSet } from 'src/server/orm/entities/CardSet';
import { WhiteCard } from 'src/server/orm/entities/WhiteCard';
import { registry } from 'src/server/orm/registry';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

/* tslint:disable:ban-types */
export const connectionProvider: interfaces.ProviderCreator<Connection> =
  (context: interfaces.Context) => {
    return async () => {
      if (context.container.isBound(registry.ORMConnection)) {
        return context.container.get(registry.ORMConnection) as Connection;
      }

      const options: ConnectionOptions = context.container.get(
        registry.ORMConnectionOptions
      ) as ConnectionOptions;
      const connection = await createConnection({
        entities: [
          BlackCard,
          WhiteCard,
          CardSet
        ],
        ...options
      });
      context.container.bind(registry.ORMConnection).toConstantValue(connection);

      return connection;
    };
  };
