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

dotenv.config();
const app = express();
const PORT = process.env.PORT || "4000";
const db = process.env.MONGO_DB_URI;

app.use(cors());
app.use(bodyParser.json());

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
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log('Disconnected Socket')
    },
    tracing: true,
});

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});