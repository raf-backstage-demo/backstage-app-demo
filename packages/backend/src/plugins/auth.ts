import { createRouter } from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { createGithubProvider  } from '@backstage/plugin-auth-backend';
import { DEFAULT_NAMESPACE, stringifyEntityRef } from '@backstage/catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      github: createGithubProvider({
        signIn: {
          resolver: async ({ profile: { email } }, ctx) => {
            const [id] = email?.split('@') ?? '';
            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: id,
            });
            // Fetch from an external system that returns entity claims like:
            // ['user:default/breanna.davison', ...]
            //const ent = await externalSystemClient.getUsernames(email);

            // Resolve group membership from the Backstage catalog
            const fullEnt = await ctx.catalogIdentityClient.resolveCatalogMembership({
              entityRefs: [userEntityRef],
              logger: ctx.logger,
            });
            const token = await ctx.tokenIssuer.issueToken({
              claims: { sub: userEntityRef, ent: fullEnt },
            });
            return { id, token };
          },
        }
      })
    }    
  });
}