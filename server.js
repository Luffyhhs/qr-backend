const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const generateQR = require("./generateQR");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Handle EMV RQ requests
app.post("/emv-rq", (req, res) => {
  // Extract data from the request
  const reqData = req.body;
  console.log(reqData);
  const filePath = "./merchant_info.json";

  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log("error reading json file:", err);
      } else {
        let newData = [];
        if (data) {
          const { merchants } = JSON.parse(data);
          newData = [...merchants, ...reqData];
        } else {
          newData = [...reqData];
        }

        fs.writeFile(
          filePath,
          JSON.stringify({ merchants: newData }),
          (err) => {
            if (err) {
              console.error("error writing json file:", err);
              res.status(500).json({ error: "Error writing Json file" });
            } else {
              res.json({
                message: "json file saved",
              });
              // const merchantName = reqData[0].merchantName;
              // const filePath = `./${merchantName
              //   .replace(/\s/g, "_")
              //   .toLowerCase()}_qr_code.png`;
              // generateQRCodes(filePath);
              // res.sendFile(filePath);
            }
          }
        );
      }
    });
  } else {
    fs.writeFile(filePath, JSON.stringify({ merchants: reqData }), (err) => {
      if (err) {
        console.error("error writing json file:", err);
        res.status(500).json({ error: "Error writing Json file" });
      } else {
        res.json({
          message: "json file saved",
        });
        // const merchantName = reqData[0].merchantName;
        // const filePath = `./${merchantName
        //   .replace(/\s/g, "_")
        //   .toLowerCase()}_qr_code.png`;
        // generateQRCodes();
        // res.sendFile(filePath);
      }
    });
  }

  // Process the EMV RQ data
  // Replace this with your own logic

  // Prepare the response
  // const response = {
  //   result: "success",
  //   message: "EMV RQ processed successfully",
  // };

  // // Send the response
  // res.json(response);
});
app.get("/data", (req, res) => {
  fs.readFile("./merchant_info.json", { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.log("error reading json file:", err);
      res.sendStatus(500);
      return;
    }
    res.json(JSON.parse(data));
  });
});
// app.get("/qr", (req, res) => {
//   const { merchantName } = req.query;
//   const filePath = `./${merchantName
//     .replace(/\s/g, "_")
//     .toLowerCase()}_qr_code.png`;
//   if (fs.existsSync(filePath)) {
//     res.sendFile(filePath);
//   } else {
//     res.sendStatus(404);
//   }
// });
// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
