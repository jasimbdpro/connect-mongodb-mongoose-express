const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Apply CORS middleware correctly
app.use(cors());

// App Express JSON parse
app.use(express.json())

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

app.get('/findusers/:id', async (req, res) => {
    try {
        // Find a single document by _id
        const userData = await UserModel.findById(req.params.id); // Use findById method

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userData);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).send("Error fetching data");
    }
});

app.delete('/findusers/:id', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});



app.put('/findusers/:id', async (req, res) => {
    const { title, age } = req.body; // Adjust these fields based on your user model

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { title, age }, // Fields to update
            { new: true, runValidators: true } // Options
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});



app.post('/', async (req, res) => {
    const { title, age } = req.body; // Adjust these fields based on your user model

    try {
        // Create a new user instance
        const newUser = new UserModel({ title, age });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});