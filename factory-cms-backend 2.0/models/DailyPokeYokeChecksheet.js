const mongoose = require("mongoose");

const checkItemSchema = new mongoose.Schema({
  sno: { type: Number, required: true },
  pokeYokeCheck: { type: String, required: true },
  typeOfPokeYoke: { type: String, required: true },
  verificationMethod: { type: String, required: true },
  photo: { type: String }, // image file path
});

const submissionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  results: [
    {
      sno: Number,
      okNg: { type: String, enum: ["OK", "NG"], required: true },
    },
  ],
});

const dailyPokeYokeSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  savedDate: { type: Date, default: null },
  revisedDate: { type: Date, default: null },
  machineCode: { type: String, required: true },
  checkedBy: { type: String, required: true },
  verifiedBy: { type: String, required: true },
  checkItems: [checkItemSchema],
  submissions: [submissionSchema], // per day submissions
});

module.exports = mongoose.model("DailyPokeYokeChecksheet", dailyPokeYokeSchema);
