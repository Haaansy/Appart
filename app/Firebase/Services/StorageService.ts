import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { UserData } from "@/app/types/UserData";
import { updateUserData } from "./DatabaseService";
import { auth } from "../FirebaseConfig";

const db = getFirestore();
const storage = getStorage();

/**
 * Uploads an avatar image to Firebase Storage and updates Firestore.
 * @param {string} uri - Image URI from the device.
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export const uploadAvatar = async (uri: string): Promise<string | null> => {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    await updateUserData(user.uid, { photoUrl: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
};

export const uploadCover = async (uri: string): Promise<string | null> => {
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("User not authenticated");
  
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `cover/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
  
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserData(user.uid, { coverUrl: downloadURL });
  
      return downloadURL;
    } catch (error) {
      console.error("Error uploading cover:", error);
      return null;
    }
  };

  export const uploadApartmentImages = async (images: string[], apartmentId: string): Promise<string[]> => {
    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      return [];
    }
  
    try {
      const uploadedImageUrls = await Promise.all(
        images.map(async (imageUri, index) => {
          try {
            const imageRef = ref(storage, `apartments/${apartmentId}/image_${index}`);
            const response = await fetch(imageUri);
            const blob = await response.blob();
  
            await uploadBytes(imageRef, blob);
            return await getDownloadURL(imageRef);
          } catch (error) {
            console.error(`Error uploading image ${index}:`, error);
            return null;
          }
        })
      );
  
      return uploadedImageUrls.filter((url) => url !== null);
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  };

  export const uploadTransientImages = async (images: string[], transientId: string): Promise<string[]> => {
    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      return [];
    }
  
    try {
      const uploadedImageUrls = await Promise.all(
        images.map(async (imageUri, index) => {
          try {
            const imageRef = ref(storage, `transients/${transientId}/image_${index}`);
            const response = await fetch(imageUri);
            const blob = await response.blob();
  
            await uploadBytes(imageRef, blob);
            return await getDownloadURL(imageRef);
          } catch (error) {
            console.error(`Error uploading image ${index}:`, error);
            return null;
          }
        })
      );
  
      return uploadedImageUrls.filter((url) => url !== null);
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  };


