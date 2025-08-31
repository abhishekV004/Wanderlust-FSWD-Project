if(process.env.NODE_ENV != "production") {// Check if the environment is not production
  // If not in production, load environment variables from .env file    
    require('dotenv').config();
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate'); // ejsmate helps to create boilerplate template . 
const ExpressError= require("./utils/ExpressError");
const session=require("express-session");
const MongoStore=require('connect-mongo'); // MongoStore is used to store session data in MongoDB
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js"); // Importing the user model


const listingRouter=require("./routes/listing.js");// Importing the listing routes
const reviewRouter=require("./routes/review.js");// Importing the review routes
const userRouter=require("./routes/user.js");


// Connecting the database 
// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL; // Using the environment variable for the database URL

// const MONGO_URL='mongodb+srv://<username>r:<password>@cluster0.mongodb.net/wanderlust?retryWrites=true&w=majority';
main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET, // Secret for encrypting session data
    },
    touchAfter: 24 * 3600 // Time in seconds after which the session will be updated
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET, // Secret for the session
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}




app.use(session(sessionOptions));
app.use(flash());

// Authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// Using the local strategy for authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());// Serializing and deserializing the user


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; // Making the current user available in all templates
    res.locals.mapToken = process.env.MAPTILER_KEY;
    next();
})

// Home page 
app.get("/",(req,res)=>{
    res.redirect("listings");
})

app.use("/listings",listingRouter);// Using the listing routes
app.use("/listings/:id/reviews",reviewRouter);// Using the review routes
app.use("/",userRouter);



app.use((req,res,next) =>{
    // console.log("All Bad");
    next(new ExpressError(404,"Page Not Found!"));
});

// Custome Error handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
    // res.send("something went wrong!");
});

app.listen(8080,()=>{
    console.log("App is listening on port 8080");
});