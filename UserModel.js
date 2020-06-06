const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	name: {
		type: String, 
		required: true,
		minlength: 1,
		maxlength: 30,
		match: /[A-Za-z]+/,
		trim: true
    },
    password: { type: String, required: true },
	cards: [],
	friends:[],
	pendingfriends:[],
	trade:[],
});

//Instance method finds purchases of this user
// userSchema.methods.findPurchases = function(callback){
// 	this.model("Purchase").find()
// 	.where("buyer").equals(this._id)
// 	.populate("product")
// 	.exec(callback);
// };

module.exports = mongoose.model("User", userSchema);