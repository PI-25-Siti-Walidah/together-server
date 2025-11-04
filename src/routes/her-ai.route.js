const express = require("express");
const router = express.Router();
const { askHerAI } = require("../controllers/her-ai.controller");

router.post("/", askHerAI);

module.exports = router;
