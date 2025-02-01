const express = require("express");
const {
  getFaqs,
  createFaq,
  getOneFaq,
} = require("../controllers/faqController");
const router = express.Router();
router.get("/", getFaqs);
router.get("/getOne", getOneFaq);
router.post("/addFaq", createFaq);

module.exports = router;
