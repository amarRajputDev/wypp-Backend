// Hardcoded credentials (DO NOT share these in public)
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "dunisrhv4",
    api_key: "758318376359894",
    api_secret: "RPH1G0lJK05ivC0MDZvigV1LKF8"
  });
  
  const testUpload = async () => {
    try {
      const result = await cloudinary.uploader.upload("test.jpg", {
        resource_type: "auto"
      });
      console.log("Upload Success:", result.secure_url);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
    }
  };
  
  testUpload();