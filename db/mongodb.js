
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://denis:LXKBPJRHuEcIpL9r@cluster0-x8op1.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});