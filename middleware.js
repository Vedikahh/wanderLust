const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // store the URL to redirect after login
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // optional: clear it after using
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
        let listing = await Listing.findById(id); // <-- FIXED
        if (listing.owner.toString() !== res.locals.currUser._id.toString()) { // <-- FIXED
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

module.exports.validateListing = (req, res, next) => {
    // Ensure image is always an object for Joi validation
    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: ""
        };
    }
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId); // <-- FIXED
        if (review.author.toString() !== res.locals.currUser._id.toString()) { // <-- FIXED
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};