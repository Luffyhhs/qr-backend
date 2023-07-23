const fs = require("fs");
const qr = require("qrcode");

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
function generateQRCode(payload, outputPath) {
  const writeStream = fs.createWriteStream(outputPath);
  const qrCode = qr.toFileStream(writeStream, payload);
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

// Read merchant data from JSON file

const { merchants } = JSON.parse(fs.readFileSync("./merchant_info.json"));

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

  const fileName = `./${merchantName
    .replace(/\s/g, "_")
    .toLowerCase()}_qr_code.png`;
  const outputPath = fileName;
  generateQRCode(payload, outputPath);

  console.log(`QR Code generated for ${merchantName}`);
});

module.exports = { generateQRCode };
