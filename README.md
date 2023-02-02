# Activity Tracker (aka Managed Services Report)

A report generator to aggregate activity from Support, Advertising, and SEO teams.

## Build Setup

This is a full stack application template. It contains a Node/Express server and a Nuxt/Vue frontend. Nuxt uses Server rendered pages (SSR) and we run it as a single page application (SPA). We found it a lot easier to develop the API using SPA mode.

After cloning the repo, create a .env file from the .env.TEMPLATE file.

- Database connections can be direct with GCP Cloud SQL with installed SSL certs. Those will need to be present and the production server's IP whitelisted.

## Development

``` bash
npm i
npm run dev
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
Built Using [Cloud Native JS](https://www.cloudnativejs.io/)

## Deployment

Deployments for the Audit Service are managed by Helm and deployed using `npm run deploy`.

> Make sure to run the command from the root of the project.
> Make sure you are on the branch and commit that you want to deploy.
> Make sure you set the kubectl context you want to deploy to.

You can override some of these settings using the shell script directly.

```
./upgrade.sh -t <tag> -d <deployment> -p <project>

-t    <tag> is the branch-sha combo tagged to the docker image in Codefresh. Ex. ci-plan-87432e
-d    <deployment> is the name of the app you are deploying. Default is "activity".
-p    <project> is the project name, aka the context, you are deploying to. Ex. opex-staging-b877
```