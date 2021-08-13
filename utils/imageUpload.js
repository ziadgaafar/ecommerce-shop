import axios from "axios";

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const image of images) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUD_UPDATE_PRESET
    );
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);

    try {
      const res = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_CLOUD_API,
        data: formData,
      });
      imgArr.push({ public_id: res.data.public_id, url: res.data.secure_url });
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.error.message);
      } else {
        console.log(err.message);
      }
    }
  }

  return imgArr;
};
