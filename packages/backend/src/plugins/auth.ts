import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
// import { createGithubProvider  } from '@backstage/plugin-auth-backend';
// import { DEFAULT_NAMESPACE, stringifyEntityRef } from '@backstage/catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    // logger: env.logger,
    // config: env.config,
    // database: env.database,
    // discovery: env.discovery,
    // tokenManager: env.tokenManager,
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,
      github: providers.github.create({
        signIn: {
          resolver: async (info, ctx) => {
            const {
              profile: { email },
            } = info;
            // Profiles are not always guaranteed to to have an email address.
            // You can also find more provider-specific information in `info.result`.
            // It typically contains a `fullProfile` object as well as ID and/or access
            // tokens that you can use for additional lookups.
            if (!email) {
              throw new Error('User profile contained no email');
            }

            // You can add your own custom validation logic here.
            // Logins can be prevented by throwing an error like the one above.
            //myEmailValidator(email);

            // This example resolver simply uses the local part of the email as the name.
            const [name] = email.split('@');

            // This helper function handles sign-in by looking up a user in the catalog.
            // The lookup can be done either by reference, annotations, or custom filters.
            //
            // The helper also issues a token for the user, using the standard group
            // membership logic to determine the ownership references of the user.
            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
        },
      }),
    },
  });
}    
    // providerFactories: {
    //   github: createGithubProvider({
    //     signIn: {
    //       resolver: async ({ profile: { email } }, ctx) => {
    //         if (email===undefined) throw TypeError("undefined email")
    //         const [id] = email.split('@');
    //         const userEntityRef = stringifyEntityRef({
    //           kind: 'User',
    //           namespace: DEFAULT_NAMESPACE,
    //           name: id,
    //         });
    //         // Fetch from an external system that returns entity claims like:
    //         // ['user:default/breanna.davison', ...]
    //         //const ent = await externalSystemClient.getUsernames(email);

    //         // Resolve group membership from the Backstage catalog
    //         const fullEnt = await ctx.catalogIdentityClient.resolveCatalogMembership({
    //           entityRefs: [userEntityRef],
    //           logger: ctx.logger,
    //         });
    //         const token = await ctx.tokenIssuer.issueToken({
    //           claims: { sub: userEntityRef, ent: fullEnt },
    //         });
    //         return { id, token };
    //       },
    //     }
    //   })
    // }    
//   });
// }