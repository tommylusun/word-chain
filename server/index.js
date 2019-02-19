import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolver";
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import path from 'path';
const jwt = require('express-jwt')

dotenv.config();
const app = express();
const PORT = process.env.PORT || "4000";
const db = process.env.MONGO_DB_URI;

app.use(cors());
app.use(bodyParser.json());

app.options('*', cors());

// auth middleware
const auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
});
app.use(auth);
// Connect to MongoDB with Mongoose.
mongoose
    .connect(
        db, {
            useNewUrlParser: true
        }
    )
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: (connectionParams,webSocket,context) => {
            // return { user: ''};
        },
        onDisconnect: () => console.log('Disconnected Socket')
    },
    context: ({ req, connection}) => {
        if (connection){
            return;
        }
        // get the user token from the headers
        return req.user ? {user: req.user} : {user: ''};
      }
});

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/*', cors(), (req, res)=>{
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});