const Faq = require("../models/faqModel");
const redisClient = require("../config/redis");
const translate = require("../utils/translate");

// controller to fetch all FAQS based on language,agar query params mei kuch nhi raha to english by default
exports.getFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    let faqs = await Faq.find();

    if (lang !== "en") {
      faqs = faqs.map((faq) => {
        return {
          _id: faq._id,
          question: faq.translations.get(lang)?.question || faq.question,
          answer: faq.translations.get(lang)?.answer || faq.answer,
        };
      });
    }

    res.json(faqs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

//controller to Create a new FAQ with translations
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const translations = new Map();
    console.log({ question, answer });

    const supportedLanguages = ["hi", "bn"];
    for (const lang of supportedLanguages) {
      translations.set(lang, {
        question: await translate(question, lang),
        answer: await translate(answer, lang),
      });
    }

    const newFaq = new Faq({ question, answer, translations });
    await newFaq.save();

    res.status(201).json(newFaq);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

//This cotroller fetches only one faq based on language and id
//this controller utlizes redis 
//if recently someone has requested for a spectific faq then he/she will be serviced faster than usual 
exports.getOneFaq = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const id=req.query.id
    const cacheKey = `faqs_${lang}_${id}`;

    //Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    let faq = await Faq.findById(id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    const response = {
      _id: faq._id,
      question: faq.translations.get(lang)?.question || faq.question,
      answer: faq.translations.get(lang)?.answer || faq.answer,
    };

    // Cache response
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 120 });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
