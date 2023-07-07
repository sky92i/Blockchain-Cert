## Project setup
```
npm install
```

Then,
* edit `app/config/db.config.js` with correct DB credentials.
* edit `.env` with your Auth0 information or you can use mine if it is available. If you want to use your own Auth0 information, visit [here](https://developer.auth0.com/resources/code-samples/full-stack/hello-world/basic-role-based-access-control/spa/react-javascript/express-javascript) for more information about getting Auth0 domain, client ID, audience and the corresponding URLs.


If you need to use other Ethereum network, you need to
* edit `truffle-config.js` and `.env` with correct network information.

## Database setup
You may setup the PostgreSQL database using Docker.
```
sudo docker run -d --name psql -p 5432:5432 -e POSTGRES_PASSWORD=admin postgres
```
Create `testdb` database:
```
sudo docker exec -it psql psql -U postgres -c "create database testdb owner postgres"
```
If the container is stopped, run:
```
sudo docker container start psql
```

## Local Ethereum Network Setup
You can use Ganache to quickly fire up a personal Ethereum blockchain which you can use to run tests, execute commands, and inspect state while controlling how the chain operates.
Download and run Ganache: https://trufflesuite.com/ganache/

## Truffle Setup
In a terminal, use NPM to install Truffle:
```
npm install -g truffle
```
You may receive a list of warnings during installation. To confirm that Truffle was installed correctly, run:
```
truffle version
```
If you need to compile the smart contract, run this in the project directory:
```
truffle compile
```
If you need to deploy contracts to the Ethereum network, run this in the project directory:
```
truffle migrate
```

## Run the Backend
To start the backend server:
```
node server.js
```
