const fileReader=require('fs');
const PdfParse = require('pdf-parse');
// const pdfParser=require ("pdf-parse");
const { setResume } = require('./resume.state');

const loadResume=async()=>{
    try{
        const readCV=fileReader.readFileSync("./public/cv.pdf")
        const data=await PdfParse(readCV)
        setResume({rawText:data.text})
    }
    catch(err){ console.error("resume couldn't be found",err.message)}
}

module.exports=loadResume