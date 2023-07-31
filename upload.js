const fs = require("fs");
const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "dgbb0osdv",
  api_key: "943123618978699",
  api_secret: "BMLHNF1q3DoQKGZzy3U1TgbDME4",
  secure: true,
});

// Function to upload an image to Cloudinary
const uploadImageToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// Function to read the contents of a folder and upload the images
const uploadImagesInFolder = async (folderPath) => {
  try {
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      const filePath = `${folderPath}/${file}`;

      // Check if the file is an image (you can update the check based on your needs)
      if (
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".png")
      ) {
        const result = await uploadImageToCloudinary(filePath);
        console.log(
          `Uploaded ${file} to Cloudinary. Public URL: ${result.secure_url}`
        );
      }
    }
  } catch (error) {
    console.error("Error reading folder:", error);
  }
};

module.exports = { uploadImagesInFolder };
