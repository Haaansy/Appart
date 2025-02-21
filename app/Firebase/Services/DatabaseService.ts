import { collection, getDocs, getDoc, doc, query, where, getFirestore, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../FirebaseConfig'; // Make sure to update the import path for your firebase config
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { UserData } from '@/app/types/UserData'; // UserData type

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
  
  // Function to update user data in Firestore
  export const updateUserDataInFirestore = async (userId: string, newData: UserData): Promise<void> => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, newData as any);
    } catch (error) {
      console.error('Error updating user data in Firestore:', error);
    }
  };
  
  // Function to set initial user data in Firestore (for new users)
  export const setInitialUserData = async (userId: string, userData: UserData): Promise<void> => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, userData); // Set initial data when a new user signs up
    } catch (error) {
      console.error('Error setting user data in Firestore:', error);
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
