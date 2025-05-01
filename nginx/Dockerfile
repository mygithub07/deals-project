# Use the official Nginx image
FROM nginx:latest

# Copy the custom Nginx config file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
