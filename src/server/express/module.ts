import * as express from 'express';
import { ContainerModule, interfaces } from 'inversify';
import { CardSetController } from 'src/server/express/controllers/CardSet';
import { CardSetControllerAttributes } from 'src/server/express/controllers/CardSet.interface';
import { expressConfigFactory } from 'src/server/express/factories/express-config';
import { expressErrorConfigFactory } from 'src/server/express/factories/express-error-config';
import { registry } from 'src/server/registry';

export const module = new ContainerModule(bind => {
  /**
   * Express Web Controllers
   * whenTargetNamed must be given a sting equal to the class name of the controller
   */
  bind<CardSetControllerAttributes>(CardSetController).toSelf();

  /**
   * Express configurations
   */
  bind<interfaces.Factory<express.Application>>(
    registry.ExpressConfig
  ).toFactory(expressConfigFactory);

  bind<interfaces.Factory<express.Application>>(
    registry.ExpressErrorConfig
  ).toFactory(expressErrorConfigFactory);
});
