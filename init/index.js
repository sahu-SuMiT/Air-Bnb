// Load environment variables
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = `pk.eyJ1Ijoic3VtaXQtc2FodSIsImEiOiJjbTh1NWJ2MG8wazRkMm1zamc3dnRpdDdqIn0.vitDzWoOs39rp8pmw2pmcg`
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Use environment variable for database URL, fallback to localhost for development
const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
const findGeometry = async (location) => {
    let response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
    })
    .send()
    console.log(response.body.features[0].geometry)
}

main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
        console.log("Cannot connect to db");
    })      
async function main(){
    await mongoose.connect(MONGO_URL);
}

//to init db
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: '67d8f67e40ea4327afc6c6e5'})) 
    for(e of initData.data){
        e.geometry = {type:'Point', coordinates:[1,1]};
    }
    await Listing.insertMany(initData.data);
    console.log("Data has been initilised________________________..............", initData.data);
}
//initDB();

const sampleListing = {
    title: "Charming Cabin in the Woods",
    description: "A peaceful retreat surrounded by nature. Great for hiking and relaxing.",
    image: {
      url: "https://example.com/cabin.jpg",
      filename: "cabin.jpg"
    },
    price: 150,
    location: "Yosemite National Park",
    country: "USA",
    reviews: [
      "661a7b3ce5f9be3cddabef01", // Example ObjectId (must be valid strings or actual ObjectIds)
      "661a7b6de5f9be3cddabef12"
    ],
    owner: "67d8f67e40ea4327afc6c6e5", // Replace with a valid User _id
    geometry: {
      type: "Point",
      coordinates: [-119.5383, 37.8651] // Longitude, Latitude (Yosemite coordinates)
    },
    category: "mountains"
  };
  
await Listing.insertOne(sampleListing)
