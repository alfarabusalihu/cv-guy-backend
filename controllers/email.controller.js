const nodemailer=require("nodemailer");

exports.sendEmail=async(req,res)=>{
    const {to,subject,body}=req.body;

    try{
       const transporter=nodemailer.createTransport(
        {
            host:process.env.SMTP_HOST,
            port:587,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
            
        }
    ) 
    await transporter.sendMail(
        {
            from:`"MCP Server",<${process.env.SMTP_USER}>`,
            to:to,
            subject:subject,
            text:body,
        }
    )
    res.json({success:true,message:"Email Sent"})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }

}

