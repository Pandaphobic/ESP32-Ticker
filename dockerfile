FROM node:16-slim
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app/
CMD ["yarn", "start"]