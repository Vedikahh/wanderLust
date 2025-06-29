const JOi = require('joi');

module.exports.listingSchema = JOi.object({
  listing: JOi.object({
    title: JOi.string().required(),
    price: JOi.number().required(),
    description: JOi.string().required(),
    location: JOi.string().required().min(0),
    country: JOi.string().required(),
    image: JOi.string().allow("",null)
  }).required()
});

module.exports.reviewSchema = JOi.object({
  review: JOi.object({
    rating: JOi.number().required().min(1).max(5),
    comment: JOi.string().required(),
  }).required()
});