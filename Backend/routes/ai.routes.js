 import express from 'express'
 import { GoogleGenerativeAI }  from  "@google/generative-ai"
// const axios = require("axios");
const router = express.Router();
 

// Route to generate AI content
router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

   try{
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 

const result = await model.generateContent(
    prompt,
    { maxTokens: 10 },

   );
 res.status(200).json(result.response.text())

   } catch(e){
    console.log(e)

   }

 

 

})

export default router
