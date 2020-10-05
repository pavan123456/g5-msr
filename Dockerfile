FROM node:12
ARG NPM_TOKEN
RUN mkdir -p /usr/src/opex
WORKDIR /usr/src/opex

ENV BROWSER_URL=activity.g5marketingcloud.com

COPY . /usr/src/opex
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
RUN npm install
RUN rm -f .npmrc
RUN npm run build

ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE ${PORT}

CMD [ "npm", "start" ]
