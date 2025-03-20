import postgres from "postgres";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import getPort from "get-port";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const app = express();

// ✅ Enable JSON parsing for API requests
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

// ✅ Home Route
app.get("/", (req, res) => {
    res.render("index", { title: "VISTAPOINT" });
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

// ✅ Start Server on Available Port
app.listen(process.env.PORT || 3002, () => {
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 3002}`);
});

// 

export default app;