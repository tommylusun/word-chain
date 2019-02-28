# word-chain
A simple word matching game, where any number of users can join and play.
This project was started as a learning experience to implement GraphQL.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
NodeJs
```

### Run client and server with hot reload

Install and start server:
```
cd server
npm install
npm run dev
```

Install and start React client:
```
cd frontend
npm install
npm start
```

Make sure the client is pointing to the correct hostname/port of the server (default is localhost:4000)
To update it, open file /frontend/src/index.js:
```
if (process.env.NODE_ENV==='development'){
  httpURI = 'http://localhost:4000/graphql';  # update this based on where your server is
  wsURI = 'ws://localhost:4000/graphql';  # update this based on where your server is
}
```

## Deployment

Deploying on production:

In root directory, run:
```
npm run heroku-postbuild
```
This will build the frontend React client into static assets, and can be served directly from the server.

Then, you only need to start the server:
In root directory, run:
```
npm start
```

## Built With

* [React 16.8] - Latest React version, using their latest Hooks mechanism
* [GraphQL]- Data query language for APIs
* [Apollo Server and Client] - GraphQL Tooling and Framework
* [Express] - Node web framework
* [Mongoose]- Popular object data modeling library for Mongo
* [MongoDB]- Popular NoSQL DB


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
