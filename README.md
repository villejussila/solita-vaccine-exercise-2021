# Solita Vaccine exercise 2021

Live version of project here: https://arcane-plateau-40203.herokuapp.com/

## Instructions

First run **npm install** in both **server** and **client** directories

**In server directory:**

In your .env file (in server directory) you need to specify the port as 4000 if you want to run development build of the client (client proxies requests to localhost:4000): PORT=4000

To run the software add your mongodb uri in your .env file (in server directory) with the following line:
MONGODB_URI=myMongoDBdatabaseWithUsernameAndPassword.com

Your database needs to contain collections "vaccinations" and "vaccineorders".

Then to start server you can run:

### `npm run dev`

To run the tests add your mongodb test uri in your .env file (in server directory) with the following line:
TEST_MONGODB_URI=myMongoDbTestDatabaseWithUsernameAndPassword.com

Tests will automatically create collections and fill them with data.

Now you can run:

### `npm test`

If you want to use production build of the client (and you have done npm install in client folder) , you can (still in the server directory) run:

### `npm run build:ui`

You can now open http://localhost:4000 to view it in the browser

**In client directory:**

To use the client in development go to client directory and then run:

### `npm start`

You can now open http://localhost:3000 to view it in the browser. If you set the PORT in .env file in the server directory, client should be able to send requests to the server.

## Running End to End tests

First in **server** directory, compile latest ts build by running:

### `npm run tsc`

Then to start server on test e2e mode run:

### `npm run start:teste2e`

Then go to **client** directory, and run:

### `npm run test:e2e`
