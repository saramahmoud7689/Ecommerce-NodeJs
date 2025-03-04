const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
//product id

// user id

// review

// rating

// [photos] (o)
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true , 'Review must belong to a user']
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true , 'Review must belong to a product']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
      },
    review:{
        type: String,
        required: [true , 'Review can not be empty']
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    photos: [String] //-> optional
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



// Middleware to call calcAverageRatings after saving a review
// reviewSchema.post('save', function() {
//     this.constructor.calcAverageRatings(this.tour);
// });

// Middleware to call calcAverageRatings before removing a review
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;
