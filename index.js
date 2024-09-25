const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not defined
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Apply CORS middleware correctly
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

// Connect to MongoDB Atlas
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('DB connected successfully');
    })
    .catch((err) => {
        console.error('DB connection error:', err);
    });

const userSchema = new mongoose.Schema({
    title: String,
    age: Number,
});

const UserModel = mongoose.model("collection-1", userSchema);

app.get('/', async (req, res) => {
    try {
        const userData = await UserModel.find({});
        res.json(userData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

app.get('/getUsers/:id', async (req, res) => {
    try {
        const userData = await UserModel.findById(req.params.id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userData);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send("Error fetching data");
    }
});

// Export the Express app as a serverless functionssss
module.exports = app;
