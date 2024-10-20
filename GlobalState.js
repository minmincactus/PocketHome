import React, { createContext, useState, useContext, useEffect } from 'react'; // Add useEffect here
import { firestore } from './firebaseConfig'; // Correct path to your Firebase config
import { doc, setDoc } from 'firebase/firestore'; // Directly import Firestore functions

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [items, setItems] = useState([]); // Store items

  // Function to save data to Firestore
  const saveData = async () => {
    try {
      const docRef = doc(firestore, 'itemsCollection', 'itemsDocument'); // Specify your Firestore path
      await setDoc(docRef, { items });
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveData(); // Save whenever items are updated
  }, [items]);

  // Add item function
  const addItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  // Remove item function
  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <GlobalStateContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
