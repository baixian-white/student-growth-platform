FROM node:18-alpine as build
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy all files and build
COPY . .
RUN npm run build

# Production server setup
FROM nginx:alpine
# Copy built assets to Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
