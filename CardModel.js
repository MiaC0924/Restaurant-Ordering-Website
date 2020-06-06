const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let cardSchema = Schema({
    name:{},
    attack:{},
    health:{},
    cardClass:{},
    faction:{},
    howToEarnGolden:{},
    rarity:{},
});
module.exports = mongoose.model("Card", cardSchema);