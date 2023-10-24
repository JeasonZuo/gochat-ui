FROM node:18-alpine
COPY ./ /app
WORKDIR /app
RUN yarn install && yarn build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf