const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
    await Listing.insertMany(initData.data);
    console.log("Data has been initilised");
}

initDB();

