# Import image of node into container
FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]