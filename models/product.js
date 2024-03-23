import mongoose from 'mongoose';


// Define the User schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    shortdescription: {
        type: String,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0 // Default quantity is 0
    },
    images: [
        {
          type: String // Array of image URLs
        }
    ],
    reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to User model for user who left the rating
          },
          rating: {
            type: Number,
            min: 1,
            max: 5
          },
          comment: String
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});



// Create models
const productModel = mongoose.model('product', productSchema);

export default productModel;
