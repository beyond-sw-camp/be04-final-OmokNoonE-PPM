FROM node:lts-alpine

# curl 설치(client url): 필수는 아님(postman 같은 것)
RUN apk add --no-cache curl

WORKDIR /app
COPY . ./
RUN pwd

ARG SERVER_URL
ENV VUE_APP_SERVER_URL=$SERVER_URL

RUN echo "SERVER_URL value is: $VUE_APP_SERVER_URL"

RUN npm install

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]
