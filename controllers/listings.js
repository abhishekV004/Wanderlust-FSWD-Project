// const Listing=require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken});


// module.exports.index=async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   }


// module.exports.renderNewForm= (req, res) => {
//   console.log(req.user);
//   res.render("listings/new.ejs");
// }


// module.exports.showListing=async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id)
//       .populate({
//         path: "reviews",
//         populate: {
//           path: "author",
//         },
//       })
//       .populate("owner");
//     if (!listing) {
//       req.flash("error", "Listing you requested for does not exist!");
//       return res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing });
//   }


// module.exports.createListing=async (req, res, next) => {
// let response=  await geocodingClient.forwardGeocode({
//   query:req.body.listing.location,
//   limit: 1,
// })
//   .send()

 

//   let url=req.file.path;
//   let filename=req.file.filename;  
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image={url,filename};

//   newListing.geometry= response.body.features[0].geometry;
  
//   let savedisting=await newListing.save();

//   console.log(savedListing);
//   req.flash("success", " New Listing Created!");
//   res.redirect("/listings");
//   }


//   module.exports.renderEditForm=async (req, res) => {
//       let { id } = req.params;
//       const listing = await Listing.findById(id);
//       if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         return res.redirect("/listings");
//       }

//       let originalImageUrl  = listing.image.url;
//       originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
//       res.render("listings/edit.ejs", { listing ,originalImageUrl});
//     }

// module.exports.updateListing=async (req, res) => {
//     let { id } = req.params;
//     let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//     if(typeof req.file !== "undefined"){
//     let url=req.file.path;
//     let filename=req.file.filename;  
//     listing.image={url,filename};
//     await listing.save();
//     }
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
//   }

// module.exports.destroyListing=async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings");
//   }

const axios = require("axios");
const Listing = require("../models/listing");
const fetch = require("node-fetch"); // Use fetch for MapTiler

// Load MapTiler key from environment
const maptilerKey = process.env.MAPTILER_KEY;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Call MapTiler Geocoding API
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(
        req.body.listing.location
      )}.json?key=${maptilerKey}`
    );

    const geoData = await response.json();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // ✅ Save full GeoJSON Point object
    if (geoData.features && geoData.features.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: geoData.features[0].geometry.coordinates, // [lng, lat]
      };
    } else {
      req.flash("error", "Could not find coordinates for this location");
      return res.redirect("/listings/new");
    }

    let savedListing = await newListing.save();

    console.log("Saved listing:", savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Geocoding error:", err);
    req.flash("error", "Could not create listing. Please try again.");
    res.redirect("/listings");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250"
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  // ✅ If location field changed, fetch new coordinates from MapTiler
  if (updatedData.location) {
    const geoRes = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(updatedData.location)}.json`,
      { params: { key: process.env.MAPTILER_KEY } }
    );

    if (geoRes.data.features && geoRes.data.features.length > 0) {
      updatedData.geometry = geoRes.data.features[0].geometry; // { type: "Point", coordinates: [lng, lat] }
    }
  }

  const listing = await Listing.findByIdAndUpdate(id, { ...updatedData }, { new: true });

  req.flash("success", "Successfully updated listing!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
