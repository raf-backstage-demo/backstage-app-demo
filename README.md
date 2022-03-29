# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```

prepare the multistage build as in 
https://backstage.io/docs/deployment/docker#multi-stage-build

To build the docker image run:

```shell
docker build . -t quay.io/raffaelespazzoli/backstage:latest --no-cache
docker login quay.io/raffaelespazzoli/backstage
docker push quay.io/raffaelespazzoli/backstage:latest
```

note the images is already pushed to `ghcr.io/raf-backstage-demo/backstage-app-demo:main`


changes to be applied

https://backstage.io/docs/features/kubernetes/installation

https://backstage.io/docs/getting-started/configuration#setting-up-authentication

https://backstage.io/docs/integrations/github/discovery

https://github.com/backstage/backstage/tree/master/plugins/github-actions#standalone-app-requirements

https://backstage.io/docs/auth/identity-resolver#resolving-membership-through-the-catalog