const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    description: String,
    image: {
        url:String,
        filename:String
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{type:Schema.Types.ObjectId,ref:"Review"}],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
        coordinates: {
            type: [Number],
            required: true
          }
    },
    category: {
        type:[String],
        enum: ["mountains", "arctic", "farms", "deserts", "room", "iconic cities", "castles", "pools", "camping", "trending", "domes", "boats"]
    }
})
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}}) 
    }
})
listingSchema.pre("deleteMany", async function (next) {
    const listings = await this.model.find(this.getQuery()); // Fetch listings that are about to be deleted

    if (listings.length) {
        const reviewIds = listings.flatMap((listing) => listing.reviews); // Extract review IDs
        await Review.deleteMany({ _id: { $in: reviewIds } });
    }

    next();
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

