const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



// Signup route
router.route("/signup")
  .get(userController.renderSignupForm)//Using the renderSignupForm method from the userController
  .post(wrapAsync(userController.signup) );// Using the signup method from the userController



// Login route
router.route("/login")
    .get( userController.renderLoginForm) // Using the renderLoginForm method from the userController
    .post(saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,}),
    userController.login );// Using the login method from the userController



// Logout route
router.get("/logout", userController.logout); // Using the logout method from the userController

module.exports = router;



// passport.authenticate middleware =>It is used to authenticate the user before allowing access to the next middleware or route handler.
// yeh databse mein exist user se verify karta hai

// failureRedirect => If authentication fails, the user is redirected to the login page with an error message.
// failureFlash => If authentication fails, an error message is flashed to the user.
