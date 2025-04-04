const Review = require("../models/review")
const Listing = require("../models/listing")

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save(); //save is also used for modifying existing database
    req.flash("success","New Review Created!")
    console.log("new review saved newReview:",newReview);
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;

   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId)
   req.flash("success","Review Deleted!")
   res.redirect(`/listings/${id}`);
}