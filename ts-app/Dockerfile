FROM --platform=linux/amd64 node:lts-alpine as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM --platform=linux/amd64 nginx:alpine

# Copy the built app from the build stage to the nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]