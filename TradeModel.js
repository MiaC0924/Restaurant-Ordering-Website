const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let tradeSchema = Schema({
    trader1name:{},
    trader1:{},
    trader2name:{},
    trader2:{},
});
module.exports = mongoose.model("Trade", tradeSchema);