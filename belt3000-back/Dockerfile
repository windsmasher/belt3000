FROM node:14.16.1

WORKDIR /belt3000-back

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 5001

CMD ["yarn", "start"]