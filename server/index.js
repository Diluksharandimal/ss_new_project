const express = require("express");
const mysql = require("mysql2/promise"); // Use promise-based version for better async support
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const app = express();

// Configure CORS with specific settings
app.use(
    cors({
        origin: ["http://localhost:3000", "https://ss-new-project.vercel.app"], // Allowed domains
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
        credentials: true, // Allow cookies/credentials
    })
);

// Handle preflight (OPTIONS) requests explicitly
app.options("*", cors());

// Use JSON and URL-encoded body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test database connection
db.getConnection()
    .then((connection) => {
        console.log("Successfully connected to the database.");
        connection.release();
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
    });

// Secret for JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware for token authentication
function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    jwt.verify(token.split(" ")[1], JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or Expired Token" });
        }
        req.user = user;
        next();
    });
}

// Function to log actions to the audit table
async function logAction(userId, action) {
    const sql = "INSERT INTO audit_logs (user_id, action) VALUES (?, ?)";
    try {
        await db.query(sql, [userId, action]);
    } catch (err) {
        console.error("Error logging action to the database:", err);
    }
}

// Signup route
app.post("/signup", async (req, res) => {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const allowedUserTypes = ["admin", "user"];
    if (!allowedUserTypes.includes(userType)) {
        return res.status(400).json({ error: "Invalid user type" });
    }

    const sql = "INSERT INTO signs (name, email, password, userType) VALUES (?, ?, ?, ?)";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const values = [name, email, hashedPassword, userType];
        await db.query(sql, values);

        res.json({ message: "User Registered Successfully" });
    } catch (err) {
        console.error("Error in /signup:", err);
        if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Email already exists" });
        } else {
            res.status(500).json({ error: "Error registering user" });
        }
    }
});

// Sign-in route
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT * FROM signs WHERE email = ?";
    try {
        const [data] = await db.query(sql, [email]);

        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = data[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "2h" });
        res.json({ message: "Login Successful", token });
    } catch (err) {
        console.error("Error in /signin:", err);
        res.status(500).json({ error: "Error during sign-in" });
    }
});

// API Endpoint for health check
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Test database connection
app.get("/test-db", async (req, res) => {
    try {
        const [results] = await db.query("SELECT 1");
        res.json({ message: "Database connection successful", results });
    } catch (err) {
        console.error("Database connection failed:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Start the server
const PORT = process.env.PORT || 8089; // Default port 8089
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel deployment
module.exports = app;
