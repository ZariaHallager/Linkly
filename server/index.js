import express from "express"; // Import express
import cors from "cors";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

config();

const port = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// MongoDB connection
const connect = async () => {
    const uri = process.env.MONGO;
    if (!uri) {
        console.error("MongoDB URI is undefined. Check your .env file!");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit on failure
    }
};

// ImageKit setup
const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// Upload endpoint
app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

// API Routes

// Create a new chat
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth; // Get userId from Clerk authentication
    const { text } = req.body;

    try {
        const newChat = new Chat({
            userId,
            history: [{ role: "user", parts: [{ text }] }],
        });
        const savedChat = await newChat.save();

        const userChats = await UserChats.findOne({ userId });
        if (!userChats) {
            // If no user chats exist, create new userChats document
            const newUserChats = new UserChats({
                userId,
                chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
            });
            await newUserChats.save();
        } else {
            // Push new chat to existing userChats
            await UserChats.updateOne(
                { userId },
                { $push: { chats: { _id: savedChat._id, title: text.substring(0, 40) } } }
            );
        }

        res.status(201).send(savedChat._id);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating chat!");
    }
});

// Get user's chats
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth; // Get userId from Clerk authentication

    try {
        const userChats = await UserChats.findOne({ userId });
        res.status(200).send(userChats ? userChats.chats : []);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching user chats!");
    }
});

// Get specific chat by ID
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth; // Get userId from Clerk authentication

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });
        if (!chat) return res.status(404).send("Chat not found!");
        res.status(200).send(chat);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching chat!");
    }
});

// Update chat with new conversation (e.g., question/answer)
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth; // Get userId from Clerk authentication
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            { $push: { history: { $each: newItems } } }
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating chat!");
    }
});

// Delete chat
app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth;

    try {
        const deletedChat = await Chat.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedChat) return res.status(404).send("Chat not found!");

        await UserChats.updateOne(
            { userId },
            { $pull: { chats: { _id: req.params.id } } }
        );

        res.status(200).send("Chat deleted successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting chat!");
    }
});

// Update chat title
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth;
    const { title } = req.body;

    try {
        const updatedChat = await UserChats.findOneAndUpdate(
            { userId, "chats._id": req.params.id },
            { $set: { "chats.$.title": title } },
            { new: true }
        );

        if (!updatedChat) return res.status(404).send("Chat not found!");
        res.status(200).send("Chat title updated successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating chat title!");
    }
});

// Delete a chat
app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const { userId } = req.auth;

    try {
        // Remove the chat
        const deletedChat = await Chat.deleteOne({ _id: req.params.id, userId });
        if (!deletedChat.deletedCount) return res.status(404).send("Chat not found!");

        // Update the user's chats
        await UserChats.updateOne(
            { userId },
            { $pull: { chats: { _id: req.params.id } } }
        );

        res.status(200).send("Chat deleted!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting chat!");
    }
});


// 404 handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send("Not Found");
});

// Serve production assets (for deployment)
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Start server
app.listen(port, () => {
    connect();
    console.log(`Server running on port ${port}`);
});
