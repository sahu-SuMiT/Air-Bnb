const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

const mapToken = `pk.eyJ1Ijoic3VtaXQtc2FodSIsImEiOiJjbTh1NWJ2MG8wazRkMm1zamc3dnRpdDdqIn0.vitDzWoOs39rp8pmw2pmcg`;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Function to find geometry using Mapbox
const findGeometry = async (location) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        return response.body.features[0].geometry;
    } catch (error) {
        console.error("Error fetching geometry:", error);
        return null; // Return null in case of an error
    }
};

// Database Initialization
const initDb = async () => {
    try {
        console.log("Initializing database...");

        // Step 1: Connect to MongoDB
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");

        // Step 2: Delete existing Listings, Reviews, and Users
        await Listing.deleteMany();
        console.log("All previous listings deleted");

        await Review.deleteMany();
        console.log("All previous reviews deleted");

        await User.deleteMany();
        console.log("All previous users deleted");

        // Step 3: Insert Sample Reviews
        const reviewAuthor = await User.register(new User({ username: "Jane", email: "Jane@example.com" }), "Jane");
        let reviews = initData.data.sampleReviews.map((r) => ({ ...r, author: reviewAuthor._id }));
        
        let newReviews = await Review.insertMany(reviews);
        let revIds = newReviews.map(review => review._id); // Store inserted review IDs
        
        // Step 4: Create a sample User
        const newUser = new User({ username: "TATA", email: "TATA@example.com" });
        const registeredUser = await User.register(newUser, "TATA");
        //console.log("User created successfully:", registeredUser);

        // Step 5: Insert Sample Listings with Geometry
        let listings = await Promise.all(
            initData.data.sampleListings.map(async (e) => ({
                ...e,
                owner: registeredUser._id,
                reviews: revIds,
                geometry: await findGeometry(e.location) || { type: "Point", coordinates: [0, 0] } // Default in case of failure
            }))
        );

        await Listing.insertMany(listings);
        console.log("Sample listings inserted successfully.");

        // Step 6: Close DB connection and exit
        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0); // 🚀 Ensures clean exit

    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1); // Exit with error code
    }
};

// Run Initialization
initDb();
