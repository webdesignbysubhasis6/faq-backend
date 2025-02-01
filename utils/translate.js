
const googletrans = require("googletrans").default;

const translateText = async (text, targetLang) => {
  try {
    const result = await googletrans(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};
module.exports = translateText;
