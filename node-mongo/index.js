const mongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;//its a library used for managing comparions and raises errors when an assertion fails
const url = 'mongodb://localhost:27017/';
const dbname = "conFusion";
const dataop = require('./operations.js');


mongoClient.connect(url)
.then((client) => {

  console.log("Connected correctly to server");
  const db = client.db(dbname);
/*Promises help in achieving a synchronous style of programming where needed while still maintaing the non-blocking IO property of JS*/
  dataop.insertDocument(db,{"name":"Mathew","description":"Test"},"dishes")// this returns a promise
      .then( result => { //result accepts the value in case the promise above is fullfilled
        console.log("Inserted Successfully");
        return dataop.findDocuments(db,"dishes")
    })
    .then( docs => {
        console.log("Found:",docs);
        return dataop.updateDocument(db,
          {"name":"Mathew","description":"Test"},
          {"name":"Rahul"},
          "dishes");
        })
    .then( updates => {
        console.log("Document Updated Successfully");
        return dataop.findDocuments(db,"dishes")
      })
    .then( result => {
        console.log("After Update:",result);
        return db.dropCollection("dishes")
      })
    .then( result => {
            console.log("Dropped thy dishes");
            return client.close();
      })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));
