// const fs=require('fs')
const { getResume } = require('./resume.state');
const OpenAI  = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

exports.askCV=async (req,res)=>{
    const {question}=req.body;
    const resume=getResume();

    if(!resume){
        return res.status(500).json({message:"resume couldn't be accessed"})
    }

    try{
        const response= await openai.chat.completions.create(
            {
                model:"gpt-4o",
                messages:[
                    {
                        role:"system",
                        content:"you are a helpful assistant who answers about the question regarding the provided resume"
                    },
                     {
                        role:"user",
                        content:`Resume:\n${resume.rawText}`
                    },
                     {
                        role:"user",
                        content:`Question:\n${question}`
                    }
                ],
                temperature:0.5,
                max_tokens: 3000
            }
        )
        res.json({answer:response.choices[0].message.content})
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:err.message})

    }

}
