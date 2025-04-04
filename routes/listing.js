const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js") 
//const upload = multer({dest:'uploads/'})
const upload = multer({storage});

//create and post new listing
router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'), wrapAsync (listingController.createListing))

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//show route and update and delete
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]') ,validateListing,wrapAsync (listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync (listingController.destroyListing))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router; 