const express = require("express");

const router = express.Router();

const {
    chatWithEventora
} = require("../controllers/chatController");

router.post("/", chatWithEventora);

module.exports = router;