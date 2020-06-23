FROM node:8-alpine

# Set env variable
ARG MODE=pwa
ENV MODE=$MODE

# Config container
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
RUN npm install --only=production
RUN npm run build -- --prod

# Run the web service on container startup.
EXPOSE 3000
CMD [ "npm", "run", "serve", "--", "--prod" ]