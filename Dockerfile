# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Remove the default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your static website files to Nginx's html directory
COPY . /usr/share/nginx/html

# Expose port 80 to be accessible from the host
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]