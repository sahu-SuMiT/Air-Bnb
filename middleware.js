const Listing = require('./models/listing')
const Review = require('./models/review')
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = async(req,res,next) =>{
    console.log(req.session);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        res.redirect("/login");
        console.log(req.session);
    }
    else
        next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing! ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    console.log(".........................",req.body,"..................");
    let {error} = listingSchema.validate(req.body);
    console.log.apply("here is the culprit");
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next()
    }
}
module.exports.validateReview = (req,res,next) => {
    console.log(".........................",req.body,"..................");
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next()
    }
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    console.log("here is the req.params: ", req.params);
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of this review! ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}