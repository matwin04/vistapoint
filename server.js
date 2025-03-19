import { neon } from "@neondatabase/serverless";
import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const sql = neon(process.env.DATABASE_URL);

// Configure Handlebars
app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");
app.set("views", path.join(process.cwd(), "views"));

// Serve static files
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());

async function setupDatabase() {
    try {
        const schema = await fs.readFile("schema.sql","utf8");
        await sql(schema);
        console.log("MOZELTOV DB SETUP COMPLETE");
    } catch (error) {
        console.log("DB SETUP FAILED: ",error);
    }
}
setupDatabase();
// Home Route
app.get("/", (req, res) => {
    res.render("index", { title: "VISTAPOINT" });
});

// ✅ FIXED: Get All POIs
app.get("/api/pois",async(req,res)=>{
    try {
        const pois = await sql `SELECT * FROM pois`;
        res.json(pois);
    } catch (err) {
        res.status(500).json({error:"FAILED TO LOAD POIS"});
    }
});
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
  
export default app;