const express = require("express");
const app = express();
const path = require("path");
const connect  = require("./database/connectdb");
require("dotenv").config();

const {ApolloServer , gql}= require("apollo-server")
const typeDefs= require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

console.log(process.env.MongoURL);
app.use("/img", express.static(path.resolve(__dirname, "img")));

connect();


const Server =new ApolloServer({typeDefs , resolvers})

Server.listen().then(({url})=>{
  console.log(`Server ready at ${url}`).catch(err=>{
      console.log(err)
  })
})