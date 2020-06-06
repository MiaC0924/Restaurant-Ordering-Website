const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const Card = require("./CardModel");
const express = require('express');
let router = express.Router();

router.get("/:id", sendSingleCard);

router.param("id", function(req, res, next, value){
	let oid;
	console.log("Finding card by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("card ID " + value + " does not exist.");
		return;
	}
	
	Card.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading card.");
			return;
		}
		
		if(!result){
			res.status(404).send("card ID " + value + " does not exist.");
			return;
		}
		req.card = result;
		//console.log("Result:");
        console.log(result);
        res.render("card",
         {  card: req.card.name, 
            attack:req.card.attack,
            health:result.health,
            cardClass:result.cardClass,
            rarity:result.rarity,
        });
	});
});
function sendSingleCard(req, res, next){
    //res.render("card", {card: req});
	// res.format({
	// 	"application/json": function(){
	// 		res.status(200).json(req.user);
	// 	},
	// 	"text/html": () => { res.render("user", {user: req.user}); }
	// });
	//res.status(200).json(req.user);
	next();
}


module.exports = router;