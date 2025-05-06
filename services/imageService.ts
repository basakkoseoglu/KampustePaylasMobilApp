import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseType } from "@/types";
import axios from "axios";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    // Eğer file string ise, zaten URL olduğunu kabul ediyoruz
    if (typeof file === "string") {
      return { success: true, data: file };
    }
    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: file.uri.split("/").pop() || "file.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      // Cloudinary API'sine POST isteği gönderiyoruz
      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("resim yükleme sonucu: ", response.data);
      
      // Sadece secure_url değerini alıyoruz
      const secureUrl = response.data.secure_url;
      return { success: true, data: secureUrl };
    }
    return { success: true };
  } catch (error: any) {
    console.log("dosya yüklemede hata oluştu", error);
    return { success: false, msg: error.message || "Dosya Yüklenemedi." };
  }
};


export const getProfileImage=(file:any)=>{
    if(file && typeof file== "string") return {uri:file};
    if(file && typeof file== "object") return {uri:file.uri};

    return require('../assets/images/defaultAvatar.png');
}