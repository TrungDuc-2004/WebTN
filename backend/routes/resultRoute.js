const express = require("express");
const {
  getResultsByUserId,
  getResultById,
} = require("../controller/resultController");

const router = express.Router();
router.get("/results", getResultsByUserId);
router.get("/results/:resultId", getResultById);

module.exports = router;
