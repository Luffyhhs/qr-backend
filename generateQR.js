const fs = require("fs");
const qr = require("qrcode");
const upload = require("./upload");

// Generate Payload
function generatePayload(
  pim,
  merchantID,
  transactionAmount,
  merchantName,
  merchantCity,
  countryCode,
  mcc,
  currencyCode,
  tipIndicator,
  rfuEmvCo,
  merchantInfo
) {
  const payload = {
    pim,
    merchantID,
    transactionAmount,
    merchantName,
    merchantCity,
    countryCode,
    mcc,
    currencyCode,
    tipIndicator,
    rfuEmvCo,
    merchantInfo,
  };

  return JSON.stringify(payload);
}

// Generate QR Code
async function generateQRCode(payload, outputPath) {
  const writeStream = await fs.createWriteStream(outputPath);
  const qrCode = await qr.toFileStream(writeStream, payload);
  // qrCode.pipe(writeStream);
  writeStream.on("finish", () => {
    console.log(`QR code saved: ${outputPath}`);
  });
}

// Generate Random Merchant ID
function generateMerchantID() {
  const randomID = Math.floor(Math.random() * 10000000000).toString();
  return randomID;
}

//Function to generate QR codes for all merchants
async function generateQrCodes() {
  // Read merchant data from JSON file
  const { merchants } = await JSON.parse(
    fs.readFileSync("./merchant_info.json")
  );
  // Generate QR Codes for each merchant
  merchants.forEach((merchant) => {
    const pim = "00";
    const merchantID = generateMerchantID();
    const transactionAmount = "100.00";
    const countryCode = "MM";
    const mcc = "1234";
    const currencyCode = "MMK";
    const tipIndicator = "01";
    const rfuEmvCo = "0000";
    const merchantInfo = {
      templateID: "26",
      guid: "D840000000",
    };

    const { merchantName, merchantCity } = merchant;

    const payload = generatePayload(
      pim,
      merchantID,
      transactionAmount,
      merchantName,
      merchantCity,
      countryCode,
      mcc,
      currencyCode,
      tipIndicator,
      rfuEmvCo,
      merchantInfo
    );

    const fileName = `./img/${merchantName
      .replace(/\s/g, "_")
      .toLowerCase()}_qr_code.png`;
    const outputPath = fileName;
    generateQRCode(payload, outputPath);

    console.log(`QR Code generated for ${merchantName}`);
  });
}

//function initial call
generateQrCodes();
upload.uploadImagesInFolder(`./img`);
// Watch for changes in the "merchant_info.json" file and regenerate QR codes when it is updated
fs.watchFile("./merchant_info.json", (current, previous) => {
  // Check if the file was modified
  if (current.mtime !== previous.mtime) {
    console.log(
      "merchant_info.json has been updated. Regenerating QR codes..."
    );
    generateQRCodes();
    upload.uploadImagesInFolder(`./img`);
  }
});
