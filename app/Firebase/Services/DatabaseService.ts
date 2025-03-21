/**
 * Fetch all documents from a collection.
 * 
 * @param collectionName - The name of the collection to fetch data from.
 * @returns A promise that resolves to an array of documents from the collection.
 * @throws An error if there is an issue fetching the collection data.
 *
 * export const fetchCollectionData = async (collectionName: string) => { ... };
 * */


/**
 * Fetch a single document from a collection by its ID.
 * 
 * @param collectionName - The name of the collection to fetch the document from.
 * @param documentId - The ID of the document to fetch.
 * @returns A promise that resolves to the document data if it exists, or null if it does not.
 * @throws An error if there is an issue fetching the document data.
 *
 * export const fetchDocumentData = async (collectionName: string, documentId: string) => { ... };
 * */


/**
 * Fetch documents based on a query condition (e.g., filter by field value).
 * 
 * @param collectionName - The name of the collection to fetch data from.
 * @param field - The field to filter by.
 * @param value - The value to filter by.
 * @returns A promise that resolves to an array of documents that match the query condition.
 * @throws An error if there is an issue fetching the collection with query.
 *
 * export const fetchCollectionWithQuery = async (collectionName: string, field: string, value: string) => { ... };
 * */

/**
 * Fetch user data from Firestore.
 * 
 * @param userId - The ID of the user to fetch data for.
 * @returns A promise that resolves to the user data if it exists, or null if it does not.
 * @throws An error if there is an issue fetching the user data from Firestore.
 *
 * export const fetchUserDataFromFirestore = async (userId: string): Promise<UserData | null> => { ... };
 * */


/**
 * Update user data in Firestore.
 * 
 * @param userId - The ID of the user to update data for.
 * @param data - The partial user data to update.
 * @throws An error if there is an issue updating the user data.
 *
 * export const updateUserData = async (userId: string, data: Partial<UserData>) => { ... };
 * */


/**
 * Set initial user data in Firestore (for new users).
 * 
 * @param userId - The ID of the user to set data for.
 * @param userData - The initial user data to set.
 * @returns A promise that resolves to true if the data was set successfully, or false if there was an error.
 * @throws An error if there is an issue saving the user data.
 *
 * export const setInitialUserData = async (userId: string, userData: any): Promise<boolean> => { ... };
 * */


/**
 * Check if the current user has data in Firestore.
 * 
 * @param userId - The ID of the user to check data for.
 * @returns A promise that resolves to true if the user data exists, or false if it does not.
 * @throws An error if there is an issue checking the user data existence.
 *
 * export const checkIfUserDataExists = async (userId: string): Promise<boolean> => { ... };
 * */


/**
 * Fetch User Reference from Firestore using user ID.
 * 
 * @param userId - The ID of the user to fetch the reference for.
 * @returns A promise that resolves to the user document reference if it exists, or null if it does not.
 * @throws An error if there is an issue fetching the user reference.
 *
 * export const fetchUserRef = async (userId: string) => { ... };
 * */


/**
 * Create a new apartment document in Firestore.
 * 
 * @param apartmentData - The data of the apartment to create.
 * @returns A promise that resolves to the ID of the created apartment if successful, or null if there was an error.
 * @throws An error if there is an issue publishing the apartment.
 *
 * export const createApartment = async (apartmentData: Apartment): Promise<string | null> => { ... };
 * */


import { collection, getDocs, getDoc, doc, query, where, getFirestore, updateDoc, setDoc, deleteDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, auth } from '../FirebaseConfig'; // Make sure to update the import path for your firebase config
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import UserData from '@/app/types/UserData'; // UserData type
import Apartment from '@/app/types/Apartment';
import { uploadApartmentImages, uploadTransientImages } from './StorageService';
import Transient from '@/app/types/Transient';
import Booking from '@/app/types/Booking';
import Alert from '@/app/types/Alert';
import Conversation from '@/app/types/Conversation';
import Message from '@/app/types/Message';
import { v4 as uuidv4 } from "uuid";
import { storeUserDataLocally } from './AuthService';

// Fetch all documents from a collection
export const fetchCollectionData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const dataList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return dataList;
  } catch (error) {
    console.error('Error fetching collection data: ', error);
    throw error;
  }
};

// Fetch a single document from a collection by its ID
export const fetchDocumentData = async (collectionName: string, documentId: string) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching document data: ', error);
    throw error;
  }
};

// Fetch documents based on a query condition (e.g., filter by field value)
export const fetchCollectionWithQuery = async (
  collectionName: string,
  field: string,
  value: string
) => {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const querySnapshot = await getDocs(q);
    const dataList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return dataList;
  } catch (error) {
    console.error('Error fetching collection with query: ', error);
    throw error;
  }
};

// Function to fetch user data from Firestore
export const fetchUserDataFromFirestore = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', userId); // Fetching user data from 'users' collection
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData; // Return user data
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    return null;
  }
};

export const fetchTenantByDisplayName = async (displayName: string): Promise<UserData | null> => {
  try {
    const q = query(collection(db, "users"), where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null; // No user found

    const doc = querySnapshot.docs[0];
    const userData = doc.data() as UserData;

    return { ...userData, id: doc.id }; // Ensure id is included without duplication
  } catch (error) {
    console.error("Error fetching tenant data from Firestore:", error);
    return null;
  }
};


// Function to update user data in Firestore
export const updateUserData = async (userId: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Function to set initial user data in Firestore (for new users)
export const setInitialUserData = async (userId: string, userData: any): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...userData, id: userRef.id }); // Set user document id as userRef
    return true; // ✅ Return true on success
  } catch (error) {
    console.error("Error saving user data:", error);
    return false; // ❌ Return false on failure
  }
};


// Function to check if the current user has data in Firestore
export const checkIfUserDataExists = async (userId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists(); // Returns true if user data exists, false if not
  } catch (error) {
    console.error('Error checking user data existence:', error);
    return false;
  }
};


// Fetch User Reference from Firestore using user ID
export const fetchUserRef = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId); // Get user document reference
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.ref; // Return the reference to the user document
    } else {
      console.error("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user reference:", error);
    return null;
  }
};

export const createApartment = async (apartmentData: Apartment): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document not found in Firestore");
      return null;
    }

    const userData = userSnap.data();
    const apartmentRef = doc(collection(db, "apartments"));

    // ✅ Upload images and get URLs
    const uploadedImageUrls = await uploadApartmentImages(apartmentData.images, apartmentRef.id);

    // ✅ Save apartment data with uploaded images
    const apartmentDataWithOwner = {
      ...apartmentData,
      images: uploadedImageUrls, // Replace local paths with URLs
      createdAt: Date.now(),
      id: apartmentRef.id,
      ownerId: userSnap.id
    };

    await setDoc(apartmentRef, apartmentDataWithOwner);
    console.log("Apartment published successfully with ID:", apartmentRef.id);

    return apartmentRef.id;
  } catch (error) {
    console.error("Error publishing apartment:", error);
    return null;
  }
};

export const deleteApartment = async (apartmentId: string) => {
  try {
    await deleteDoc(doc(db, "apartments", apartmentId));
    console.log("Apartment deleted successfully");
  } catch (error) {
    console.error("Error deleting apartment:", error);
  }
}

export const updateApartment = async (apartmentId: string, apartmentData: Partial<Apartment>) => {
  try {
    const apartmentRef = doc(db, "apartments", apartmentId);
    const apartmentSnap = await getDoc(apartmentRef);

    if (!apartmentSnap.exists()) {
      console.error("Apartment not found");
      return;
    }

    const existingApartment = apartmentSnap.data();
    const existingImages = existingApartment.images || [];

    // Filter out images that are already uploaded (Firebase URLs)
    const newImages = (apartmentData.images || []).filter(
      (image: string) => !existingImages.includes(image) // Exclude already uploaded images
    );

    let uploadedImageUrls: string[] = [];

    if (newImages.length > 0) {
      uploadedImageUrls = await uploadApartmentImages(newImages, apartmentId);
    }

    // Merge newly uploaded images with existing ones
    const updatedImages = [...existingImages, ...uploadedImageUrls];

    // Prepare updated data
    const updatedApartmentData = {
      ...apartmentData,
      images: updatedImages, // Ensure all images (old + new) are saved
    };

    await updateDoc(apartmentRef, updatedApartmentData);
    console.log("Apartment updated successfully");
  } catch (error) {
    console.error("Error updating apartment:", error);
  }
};

export const createTransient = async (transientData: Transient): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document not found in Firestore");
      return null;
    }

    const userData = userSnap.data();
    const transientRef = doc(collection(db, "transients"));

    // ✅ Upload images and get URLs
    const uploadedImageUrls = await uploadTransientImages(transientData.images, transientRef.id);

    // ✅ Save apartment data with uploaded images
    const apartmentDataWithOwner = {
      ...transientData,
      images: uploadedImageUrls, // Replace local paths with URLs
      ownerId: userData.id,
      createdAt: Date.now(),
      id: transientRef.id,
    };

    await setDoc(transientRef, apartmentDataWithOwner);
    console.log("Transient published successfully with ID:", transientRef.id);

    return transientRef.id;
  } catch (error) {
    console.error("Error publishing transient:", error);
    return null;
  }
};

export const deleteTransient = async (transientId: string) => {
  try {
    await deleteDoc(doc(db, "transients", transientId));
    console.log("Transient deleted successfully");
  } catch (error) {
    console.error("Error deleting transient:", error);
  }
}

export const updateTransient = async (transientId: string, transientData: Partial<Transient>) => {
  try {
    const transientRef = doc(db, "transients", transientId);
    const transientSnap = await getDoc(transientRef);

    if (!transientSnap.exists()) {
      console.error("Apartment not found");
      return;
    }

    const existingApartment = transientSnap.data();
    const existingImages = existingApartment.images || [];

    // Filter out images that are already uploaded (Firebase URLs)
    const newImages = (transientData.images || []).filter(
      (image: string) => !existingImages.includes(image) // Exclude already uploaded images
    );

    let uploadedImageUrls: string[] = [];

    if (newImages.length > 0) {
      uploadedImageUrls = await uploadApartmentImages(newImages, transientId);
    }

    // Merge newly uploaded images with existing ones
    const updatedImages = [...existingImages, ...uploadedImageUrls];

    // Prepare updated data
    const updatedTransientData = {
      ...transientData,
      images: updatedImages, // Ensure all images (old + new) are saved
    };

    await updateDoc(transientRef, updatedTransientData);
    console.log("Transient updated successfully");
  } catch (error) {
    console.error("Error updating transient:", error);
  }
};

export const createBooking = async (bookingData: Booking) => {
  try {
    const bookingRef = doc(collection(db, "bookings")); // Generate new document reference
    const bookingWithId = { 
      ...bookingData, 
      id: bookingRef.id,
      createdAt: serverTimestamp(),
      tenantIds: bookingData.tenants.map((tenant) => tenant.user.id),
    }; // Add the generated ID to the data

    await setDoc(bookingRef, bookingWithId);

    return bookingRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

export const updateBooking = async (bookingId: string, bookingData: Partial<Booking>) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, bookingData);
    console.log("Booking updated successfully");
  } catch (error) {
    console.error("Error updating booking:", error);
  }
}

export const createAlert = async (alertData: Alert) => {
  try {
    const alertRef = doc(collection(db, "alerts"));
    await setDoc(alertRef, alertData);
    return alertRef.id;
  } catch (error) {
    console.error("Error creating alert:", error);
    return null;
  }
}

export const updateAlert = async (alertId: string, alertData: Partial<Alert>) => {
  try {
    const alertRef = doc(db, "alerts", alertId);
    await updateDoc(alertRef, alertData);
  } catch (error) {
    console.error("Error updating alert:", error);
  }
}

export const deleteAlert = async (alertId: string) => {
  try {
    await deleteDoc(doc(db, "alerts", alertId));
  } catch (error) {
    console.error("Error deleting alert:", error);
  }
}

export const createConversation = async (conversationData: Conversation) => {
  try {
    const conversationRef = doc(collection(db, "conversations"));
    await setDoc(conversationRef, {
      ...conversationData,
      createdAt: serverTimestamp(),
      id: conversationRef.id,
      updatedAt: serverTimestamp(),
      memberIds: conversationData.members.map((member) => member.user.id),
    });
    return conversationRef;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
}

export const updateConversation = async (conversationId: string, conversationData: Partial<Conversation>) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      ...conversationData,
      updatedAt: serverTimestamp(),
    });
    console.log("Conversation updated successfully");
  } catch (error) {
    console.error("Error updating conversation:", error);
  }
}


export const createMessage = async (conversationId: string, messageData: Omit<Message, "id" | "createdAt">) => {
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages");

    const newMessageRef = await addDoc(messagesRef, {
      ...messageData,
      createdAt: serverTimestamp(), // Firestore timestamp
    });

    console.log("Message added successfully with ID:", newMessageRef.id);
  } catch (error) {
    console.error("Error adding message:", error);
  }
};

// Function to fetch the number of properties for a user
export const fetchUserPropertiesCount = async (userId: string): Promise<number> => {
  try {
    const apartmentsQuery = query(collection(db, "apartments"), where("owner.id", "==", userId));
    const transientsQuery = query(collection(db, "transients"), where("owner.id", "==", userId));

    const [apartmentsSnapshot, transientsSnapshot] = await Promise.all([
      getDocs(apartmentsQuery),
      getDocs(transientsQuery),
    ]);

    const apartmentsCount = apartmentsSnapshot.size;
    const transientsCount = transientsSnapshot.size;

    return apartmentsCount + transientsCount; // Return the total number of documents
  } catch (error) {
    console.error("Error fetching user properties count:", error);
    return 0;
  }
};




