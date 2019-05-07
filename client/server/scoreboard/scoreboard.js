const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/scoreboard", {
  useNewUrlParser: true
});
const scoreboardSchema = new mongoose.Schema({
  user: String,
  score: Number
});
const scoreboard = mongoose.model("score", scoreboardSchema);
const incrementScore = user => {
  scoreboard.findOneAndUpdate(
    { user },
    { $inc: { score: 1 } },
    { upsert: true },
    (err, doc) => {
      console.log(err, doc);
    }
  );
};
const findTop50 = callback => {
  scoreboard
    .find({})
    .sort({ score: "desc" })
    .limit(50)
    .then(res => callback(null, res))
    .catch(err => callback(err));
};
module.exports = {
  incrementScore,
  findTop50
};
