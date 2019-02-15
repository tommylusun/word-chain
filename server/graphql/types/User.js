import { gql } from "apollo-server-express";

export default gql`
  type User {
    _id: ID
    username: String!
    email: String!
    words: [Word]
  }
  type Query {
    user(_id: ID, username: String, email: String): User
    users: [User]
  }
  type Mutation {
    registerUser( username: String!, email: String!, password: String!): String
    loginUser( email: String!, password: String!): String
    editUser(_id: ID!, username: String, email: String): User
    deleteUser(_id: ID!, username: String, email: String): User
  }
`;