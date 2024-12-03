const express = require("express");
const mysql = require("mysql2/promise"); // Use promise-based version for better async support
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");

const app = express();

// Allow specific origins in CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'https://www.infolock.live', // Update with the actual allowed origin in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connection pool for the database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
db.getConnection()
    .then(() => {
        console.log("Successfully connected to the database.");
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
    });

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware for token authentication
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer ')) return res.status(401).json({ error: "Access Denied: No Token Provided" });

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid Token" });
        }
        req.user = user;
        next();
    });
}

// Unified log action function
async function logAction(userId, action) {
    const sql = "INSERT INTO audit_logs (user_id, action) VALUES (?, ?)";
    try {
        await db.query(sql, [userId, action]);
    } catch (err) {
        console.error("Error logging action to the database:", err);
    }
}

// Signup route
// Signup route
app.post("/signup", async (req, res) => {
    const { name, email, password, userType } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !password || !userType) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // SQL query to insert a new user
    const sql = "INSERT INTO signs (name, email, password, userType) VALUES (?, ?, ?, ?)";

    try {
        // Check if the user already exists
        const checkUserSql = "SELECT * FROM signs WHERE email = ?";
        const [existingUser] = await db.query(checkUserSql, [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        const values = [name, email, hashedPassword, userType];

        // Insert the new user into the database
        await db.query(sql, values);

        // Optionally, create a JWT token for the user
        // const token = jwt.sign({ email }, 'your-jwt-secret', { expiresIn: '1h' });

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        console.error("Error in /signup:", err);
        res.status(500).json({ error: "Error registering user" });
    }
});

// Sign-in route
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM signs WHERE email = ?";

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        const [data] = await db.query(sql, [email]);

        if (data.length === 0) {
            await logAction(null, `Login Failed for email: ${email}`);
            return res.status(401).json({ error: "Login Failed" });
        }

        const user = data[0];

        // Compare the password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            await logAction(user.id, "Login Failed");
            return res.status(401).json({ error: "Login Failed" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
        await logAction(user.id, "Signed in");

        res.json({ message: "Login Successful", token });
    } catch (err) {
        console.error("Error in /signin:", err);
        res.status(500).json({ error: "Error during sign-in" });
    }
});

// Logout route
app.post("/logout", authenticateToken, async (req, res) => {
    if (req.user && req.user.id) {
        await logAction(req.user.id, "Signed out");
        res.json({ message: "Logout Successful" });
    } else {
        res.status(400).json({ message: "User ID not found" });
    }
});

// Fetch user data route
app.get("/users", authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM signs WHERE id = ?";

    try {
        const [data] = await db.query(sql, [req.user.id]);

        await logAction(req.user.id, "Viewed own data");

        if (data.length > 0) {
            return res.json(data[0]);
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Error fetching data" });
    }
});

// API endpoint to retrieve all user activities
app.get('/userActivities', async (req, res) => {
    const sql = 'SELECT * FROM audit_logs';

    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (error) {
        console.error("Database query failed:", error);
        return res.status(500).json({ error: 'Database query failed' });
    }
});

// API Endpoint to Get All Users
app.get('/viewUsers', async (req, res) => {
    const query = 'SELECT * FROM signs';

    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send('Server Error');
    }
});

// Health check route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Test database connection endpoint
app.get("/test-db", async (req, res) => {
    try {
        const [results] = await db.query("SELECT 1");
        res.json({ message: "Database connection successful", results });
    } catch (err) {
        console.error("Database connection failed:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
});

// Start server
const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export app for Vercel
module.exports = app;
