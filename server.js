const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Static folders */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

/* Session */
app.use(session({

    secret: "secretkey",

    resave: false,

    saveUninitialized: false,

    cookie:{

        maxAge: 1000 * 60 * 60 * 24
        // 24 hours
    }
}));

/* =========================
   MONGODB
========================= */

mongoose.connect("mongodb://127.0.0.1:27017/lostfoundDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

/* =========================
   ROUTES
========================= */

app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));
app.use("/claims", require("./routes/claims"));
app.use("/admin", require("./routes/admin"));

/* =========================
   HOME PAGE
========================= */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

/* =========================
   PAGE ROUTES
========================= */

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "profile.html"));
});

app.get("/adminpage", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/myitems", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "myitems.html"));
});

app.get("/notifications-page", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "notifications.html"
        )
    );
});
app.use(
    "/notifications",
    require("./routes/notifications")
);

/* ========================
   SERVER
========================= */

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});