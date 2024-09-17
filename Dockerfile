# Use an official Node.js 22 base image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the rest of the application files into the working directory
COPY . .

# Create the .svelte-kit directory if it does not exist
RUN mkdir -p .svelte-kit

# Copy the tsconfig.json file into the .svelte-kit directory
COPY tsconfig.json .svelte-kit/tsconfig.json

# Check for the presence of the .svelte-kit/tsconfig.json file
RUN if [ ! -f .svelte-kit/tsconfig.json ]; then echo ".svelte-kit/tsconfig.json not found"; exit 1; fi

# Build the production version of the application
RUN npm run build

# Expose the port on which the application will listen
EXPOSE 3000

# Define the default command to run the production version of the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
