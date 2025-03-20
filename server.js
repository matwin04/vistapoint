import postgres from "postgres";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import session from "express-session";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Fix path issues
app.set("views", path.join(__dirname, "views"));

// ✅ Serve static files from "public"
app.use("/styles", express.static(path.join(__dirname, "public/styles")));
app.use("/scripts", express.static(path.join(__dirname, "public/scripts")));
// ✅ Configure Handlebars
app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");

// ✅ Ensure the POIs table exists
// ✅ Ensure the Users & POIs Table Exist
async function setupDB() {
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pois (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            lat DOUBLE PRECISION NOT NULL,
            lng DOUBLE PRECISION NOT NULL,
            category TEXT
        );
    `;
    console.log("✅ Users & POIs tables ready");
}
setupDB();

// HOME ROUTE
app.get("/", (req, res) => {
    res.render("index", { title: "VISTAPOINT" });
});
app.get("/", (req,res)=>{
    res.render("signup",{ title: "Sign Up"});
})
// User Sign Up
app.post("/api/signup",async(req,res)=>{
    const {username,email,password}=req.body;
    if (!username||!email||!password)return res.status(400).json({error:"Missing Fields"});
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        await sql`INSERT INTO users (username,email,password_hash) VALUES (${username},${email},${hashedPassword})`;
        res.status(201).json({message:"User Created"});
    } catch (err) {
        res.status(400).json({error:"User Allready Created"});
    }
});

// ✅ Get All POIs
app.get("/api/pois", async (req, res) => {
    try {
        const pois = await sql`SELECT * FROM pois`;
        res.json(pois);
    } catch (err) {
        res.status(500).json({ error: "FAILED TO LOAD POIS" });
    }
});

// ✅ Add New POI
app.post("/api/pois", async (req, res) => {
    try {
        const { name, description, lat, lng, category } = req.body;
        if (!name || lat === undefined || lng === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newPoi = await sql`
            INSERT INTO pois (name, description, lat, lng, category)
            VALUES (${name}, ${description}, ${lat}, ${lng}, ${category})
            RETURNING *;
        `;
        res.json(newPoi[0]);
    } catch (err) {
        res.status(500).json({ error: "FAILED TO SAVE POI" });
    }
});


if (!process.env.VERCEL && !process.env.NOW_REGION) {
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}

// ✅ Export the Expres
// ✅ Export the app for Vercel
export default app;