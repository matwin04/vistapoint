import postgres from "postgres";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import getPort from "get-port";
import {engine} from "express-handlebars";
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const app = express();
const PORT = process.env.PORT;

// Serve static files from "public" without needing multiple routes
app.use(express.static("public"));

// Configure Handlebars
app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");
app.set("views", "views");


async function setupDB() {
    await sql`
        CREATE TABLE IF NOT EXISTS pois (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            lat DOUBLE PRECISION NOT NULL,
            lng DOUBLE PRECISION NOT NULL,
            category TEXT
        );
    `;
    console.log("✅ POIs table ready");
}
setupDB();
// Home Route
app.get("/", (req, res) => {
    res.render("index", { title: "VISTAPOINT" });
});
console.log("BRUH");
// ✅ FIXED: Get All POIs
app.get("/api/pois",async(req,res)=>{
    try {
        const pois = await sql `SELECT * FROM pois`;
        res.json(pois);
    } catch (err) {
        res.status(500).json({error:"FAILED TO LOAD POIS"});
    }
});
app.post("/api/pois",async(req,res)=>{
    try {
        const { name, description,lat,lng,category} = req.body;
        if (!name || lat === undefined || lng === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newPoi = await sql`
            INSERT INTO pois (name,description,lat,lng,category)
            VALUES (${name},${description},${lat},${lng},${category})
            RETURNING *;
        `;
        res.json(newPoi[0]);
    } catch(err) {
        res.status(500).json({err:"FAILED RO SAVE POI"});

    }
});

app.listen(PORT);
export default app;