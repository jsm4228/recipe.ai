import { v2 as cloudinary } from "cloudinary";
import { CLOUD_KEY, CLOUD_KEY_SECRET } from "../App";

cloudinary.config({
  cloud_name: "dfnteocnt",
  api_key: CLOUD_KEY,
  api_secret: CLOUD_KEY_SECRET,
});

const upload_image = (image_url) => {
  cloudinary.v2.uploader.upload(image_url, function (error, result) {
    console.log(result);
  });
};

export default upload_image;
