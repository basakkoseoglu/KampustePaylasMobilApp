import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    // Eğer updatedData.image bir string ve "file://" ile başlıyorsa, nesneye dönüştür.
    if (
      updatedData.image &&
      typeof updatedData.image === "string" &&
      updatedData.image.startsWith("file://")
    ) {
      updatedData.image = { uri: updatedData.image };
    }

    // Artık image nesnesi olarak geldiyse Cloudinary'ye yükle
    if (updatedData.image && typeof updatedData.image === "object" && updatedData.image.uri) {
      const imageUploadRes = await uploadFileToCloudinary(updatedData.image, "users");
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Yükleme başarısız oldu.",
        };
      }
      // Cloudinary'den dönen secure_url'yi alıyoruz
      updatedData.image = imageUploadRes.data;
      console.log("Yüklenen resmin URL'si:", updatedData.image);
    }
    
    // Firestore'da ilgili kullanıcı dokümanını güncelle
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, { 
    image: updatedData.image,
    name:updatedData.name,
    university:updatedData.university,
    department:updatedData.department,
    gender:updatedData.gender,
    });
    console.log("Güncellenen kullanıcı verisi:", updatedData);

    return { success: true, msg: "Güncelleme Başarılı." };
  } catch (error: any) {
    console.log("Kullanıcı güncelleme hatası: ", error);
    return { success: false, msg: error?.message };
  }
};

