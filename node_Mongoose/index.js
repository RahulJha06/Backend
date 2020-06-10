const express = require('express');
const mongoose = require('mongoose');

const Dishes = require('./models/dishes.js');

const url = "mongodb://localhost:27017";
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log("DataBase server Connected");
/*
Alternate method to inserting new values
  var newDish = Dishes({
    name:"Rahul",
    description: "test"
  });
  newDish.save()
*/
Dishes.remove({}).
then( () => {
 Dishes.create({
   name: "Rahul",
   description : "Sucks"
 })
  .then(dish => {
    console.log(dish);
    return Dishes.findByIdAndUpdate(dish._id,
      {$set: { description: 'Updated test'}},{new : true}).exec();
  })
  .then( dishes => {
    console.log(dishes);
   dishes.comments.push({
      rating: 4,
      comment: 'I\'m getting a sinking feeling',
      authod: 'Leonardo Di Caprico'
    });
    return dish.save()
  })
  .then( (dish) =>{
    console.log(dish)
    return Dishes.remove({});
  })
  .then( () =>{
    return mongoose.connection.close();
  })
  .catch((err)=> {
    console.log(err)
    return monoose.connection.close();
  });
})
.catch((err)=>{
  console.log(err);
  return monoose.connection.close();
});
})
