const mongoose = require("mongoose");
const TripSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:false},
  title:{type:String, default:""},
  destination:{type:String, required:true},
  startDate:{type:String, required:true},
  endDate:{type:String, required:true},
  interests:{type:[String], default:[]},
  budget:{type:String, default:"medium"},
  itinerary:[{ day:Number, activities:[String], tip:String }],
  public:{type:Boolean, default:false},
  weatherCache: { type: Array, default: [] }
},{timestamps:true});
module.exports = mongoose.model("Trip", TripSchema);
