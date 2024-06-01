const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const path = require('path');
const crypto = require("crypto");
const multer = require("multer");
const {scryptSync, createDecipheriv, createCipheriv} = require('crypto');
const bodyparser= require("body-parser");


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
//connection

mongoose.connect("mongodb://127.0.0.1:27017/secfish", {
}).then(() => {
    console.log('Connection successful');
}).catch((e) => {
    console.log('no connection'+e);
})
 //Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/Login.html"));
});


//login check
app.post("/Login.html", async(req, res) => {
    try {
        const emailent = req.body.email;
        const passwordent = req.body.password;
        const userData =await Users.findOne({email:emailent});
        const hash1 = crypto.createHash("sha256").update(passwordent).digest("hex");
        if(userData.password == hash1)
        {
            res.status(201).sendFile(path.join(__dirname, "/public/html/Dashboard.html"));}

        else{
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/file_sharing.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/file_sharing.jpg"));
});



app.get("/style1.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/style1.css"));
});


app.get("/Registration.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/Registration.html"));
});

app.post("/Registration.html", async(req, res) => {
   try{
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const hash2 = crypto.createHash("sha256").update(req.body.password).digest("hex");
    if(password === cpassword){
        const registeruser = new Users({
            fullName : req.body.fullName,
            userName : req.body.userName,
            email : req.body.email,
            mobile : req.body.mobile,
            gender : male,
            password : hash2,
    })
    const registered = await registeruser.save();
    res.status(201).sendFile(path.join(__dirname, "/public/html/Login.html"));
}
    else{
        res.send("password are not matching");}
   } catch(error) {
    res.status(400).send(error);
   }
});


// middleware
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // the file is saved to here
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // the filename field is added or altered here once the file is uploaded

        cb(null,file.originalname)
    }
})

var upload = multer({ storage: storage});
const iv = crypto.randomBytes(16);
const tim = Date.now();
var epath=`./Secret Files/${tim}.enc`;

app.post('/upload', upload.single('filename'), async(req, res) => {
    try{
     const ufilepassword = req.body.passw;
     const hash3 = crypto.createHash("sha256").update(req.body.passw).digest("hex");

     console.log(req.body);
     console.log(req.file);
     console.log(ufilepassword);
     const algorithm = 'aes-256-cbc';

 let key= crypto.scryptSync(ufilepassword, 'salt', 32);
 
 // Encrypt file
 const inputFile =req.file.path;
 const input = fs.readFileSync(inputFile);
 
 const cipher = crypto.createCipheriv(algorithm, key, iv);
 let encrypted = cipher.update(input);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 
 fs.writeFileSync(epath, encrypted);
 
const ttim = Date.now();
var dpath=`${ttim}.enc`;

const fileData = new UsersFile({
    name :dpath,
    originalName : req.file.filename,
    password : hash3
}) 
//const file = await Filei.create(fileData);
const file = await fileData.save();

//res.redirect('/confirmation.html', {fileLink: `$(req.headers.origin)/file/${file.id}`});
res.status(201).sendFile(path.join(__dirname, "/public/html/confirmation.html")/*, {fileLink: `$(req.headers.origin)/file/${file.id}`}*/);

    }
    catch(error) {
        res.status(400).send(error);
       }
});

app.post("/Download.html", async(req, res) => {
    try{
        const ufilepassword = req.body.passw;
        console.log(ufilepassword);
        const algorithm = 'aes-256-cbc';
        let key= crypto.scryptSync(ufilepassword, 'salt', 32);
        
 // Decrypt file
 const encryptedFile = epath;
 const encrypted1 = fs.readFileSync(encryptedFile);
 
 const decipher = crypto.createDecipheriv(algorithm, key, iv);
 let decrypted = decipher.update(encrypted1);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 var downpath=`./Download Files/Download-${tim}.txt`;
 
 fs.writeFileSync(downpath, decrypted);
 
//const file = await Filei.create(fileData);
const file = await fileData.save();
     res.status(201).sendFile(path.join(__dirname, "/public/html/Login.html"));
 }
      catch(error) {
     res.status(400).send(error);
    }
 });
 
app.get("/file/658bcf6384dc618ccc503a5e/", (req,res) =>{
    res.sendFile(path.join(__dirname, "/public/html/Download.html"));
}
)

app.get("/style2.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/style2.css"));
});


app.get("/logo.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/logo.jpg"));
});

app.get("/Dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/Dashboard.html"));
});

app.get("/Login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/Login.html"));
});



app.get("/Upload.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/Upload.html"));
});

app.get("/Download.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/Download.html"));
});

app.get("/style4.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/style4.css"));
});

app.get("/confirmation.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/confirmation.html"));

});

app.get("/listoffile.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/listoffile.html"));

});

app.get("/style3.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/css/style3.css"));
});

app.get("/sharelink.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/html/sharelink.html"));

});


app.listen(port, () => {
    console.log('server is running at port no '+port)
});

//Models
const Users = require("./models/Register.js");
const UsersFile = require("./models/File.js");



	