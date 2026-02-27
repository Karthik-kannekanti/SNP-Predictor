FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build step omitted here for quick dev simulation, but would be `npm run build` in production
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
