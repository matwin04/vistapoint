const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const fs = require("fs");

const dataFile = "./data/pois.json";
const app = express();
const PORT = process.env.PORT || 3001;

// Configure Handlebars
app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.render("index", { title: "VISTAPOINT" });
});

// ✅ FIXED: Get All POIs
app.get("/api/pois", (req, res) => {
    fs.readFile(dataFile, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load POIs" });
        res.json(JSON.parse(data));
    });
});

// ✅ FIXED: Add a New POI (POST)
app.post("/api/pois", (req, res) => {
    const { name, description, lat, lng, category } = req.body;

    if (!name || !lat || !lng) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    fs.readFile(dataFile, "utf8", (err, data) => {
        const pois = err ? [] : JSON.parse(data);
        const newPoi = { id: pois.length + 1, name, description, lat, lng, category };
        pois.push(newPoi);

        fs.writeFile(dataFile, JSON.stringify(pois, null, 2), "utf8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to save POI" });
            res.json(newPoi);
        });
    });
});

// Start server
module.exports = app;

// Start server locally
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}