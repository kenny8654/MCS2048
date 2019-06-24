var express = require('express');
var CRUD = require('../models/CRUD')
var uploadScore = express.Router();
uploadScore.post('/post',(req, res)=>{
        data={
            name : req.body.name,
            score : req.body.score
        }
        CRUD.uploadScore(data, (err, result)=>{
            if(!err){
                // res.cookie('userID', req.body.email, { path: '/', signed: true, maxAge:600000});  //set cookie
                res.json({status:"OK"})

            }
        })
})
uploadScore.get('/getscore',(req, res)=>{
        CRUD.getScore((err, result)=>{
            if(!err){
                res.json({status:"OK", message:result})

            }
        })
})
module.exports = uploadScore;
