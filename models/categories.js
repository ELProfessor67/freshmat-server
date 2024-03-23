import mongoose from 'mongoose';


// Define the User schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    }
});



// Create models
const categoryModel = mongoose.model('categoty', categorySchema);

export default categoryModel;
