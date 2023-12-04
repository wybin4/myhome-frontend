FROM node:20-alpine as build
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
ENV NODE_ENV production
RUN npm run build

FROM node:20-alpine
WORKDIR /opt/app
COPY --from=build /opt/app/.next ./.next
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/public ./public
CMD ["npm", "start"]
EXPOSE 3000