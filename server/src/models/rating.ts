import mongoose from "mongoose";

export interface RatingDocument extends mongoose.Document {
  userId: string;
  rating: number;
  _doc: any;
}


const ratingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Rating = mongoose.model<RatingDocument>("Rating", ratingSchema);
export default Rating;