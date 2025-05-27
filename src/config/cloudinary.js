import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dunisrhv4",
  api_key: 758318376359894,
  api_secret: "RPH1G0lJK05ivC0MDZvigV1LKF8"
});

const uploadOnCloudinary = async (localPathName) => {

  if (!localPathName) return null;



  try {
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localPathName, {
      resource_type: "auto",
    });

    console.log("Upload Successful:", uploadResult.secure_url);

    return uploadResult.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  } finally {
    // Always remove the local file after processing
    if (fs.existsSync(localPathName)) {
      fs.unlinkSync(localPathName);
    }
  }
};

export default uploadOnCloudinary;
