const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("addImage"));
app.use(fileUpload());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wwwk6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  // console.log(err)
  const eventCollection = client
    .db(process.env.DB_NAME)
    .collection("volunteers");
  const registerCollection = client
    .db(process.env.DB_NAME)
    .collection("registers");
  console.log("db connected");

  app.post("/addEvent", (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;
    // console.log(file, title, description, date);
    const filePath = `${__dirname}/addImage/${file.name}`;
    file.mv(filePath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "failed to upload" });
      }
      const newImg = fs.readFileSync(filePath);
      const encImg = newImg.toString("base64");
      var image = {
        contentType: req.files.file.mimetype,
        name: req.files.file.name,
        size: req.files.file.size,
        img: Buffer(encImg, "base64"),
      };

      eventCollection
        .insertOne({ title, description, date, image })
        .then((result) => {
          fs.remove(filePath, (error) => {
            if (error) {
              console.log(error);
              res.status(500).send({ msg: "failed to upload" });
            }
            res.send(result.insertedCount > 0);
          });
        });

      //  return res.send({ name: file.name, path: `/${file.name}` });
    });
  });

  // get all events
  app.get("/events", (req, res) => {
    eventCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  //get single events
  app.get("/event/:id", (req, res) => {
    eventCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((error, documents) => {
        if (error) {
          res.send(error);
        }
        res.send(documents[0]);
      });
  });

  //add each volunteer
  app.post("/register", (req, res) => {
    const volunteer = req.body;
    registerCollection.insertOne(volunteer).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //load data using email

  app.get('/subscribedEvents', (req, res) => {
    const emailQuery =  req.query.email;
    registerCollection
      .find({ email: emailQuery})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  // delete a subscribed events

  app.delete('/delete/:id', (req, res) =>{

    registerCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount>0)
    })
  })

  // find all registered volunteer list

  app.get('/allRegisteredList', (req, res) =>{

    registerCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })

  })

});

app.get("/", (req, res) => {
  res.send("Hello World Sharif!");
});

app.listen(process.env.PORT || port);
