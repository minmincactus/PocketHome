import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { firestore } from '../firebaseConfig';
import { collection, query, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font';
import { Sunshiney_400Regular } from '@expo-google-fonts/sunshiney';
import { useNavigation } from '@react-navigation/native';

const SectionScreen = ({ route }) => {
  const { sectionName } = route.params;
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Sunshiney_400Regular,
  });

  useEffect(() => {
    const sections = ['Bedroom', 'Bathroom', 'Closet', 'Kitchen', 'Pantry', 'Cleaning Supplies', 'Tools'];
  
    if (sectionName === 'Collection') {
      // Fetch all items (both available and unavailable) from all sections
      let allItems = [];
      sections.forEach(section => {
        const itemsRef = collection(firestore, 'sections', section, 'items');
        const q = query(itemsRef);
  
        onSnapshot(q, (snapshot) => {
          const sectionItems = [];
          snapshot.forEach((doc) => {
            const itemData = doc.data();
            sectionItems.push({ id: doc.id, ...itemData, section });
          });
          allItems = [...allItems, ...sectionItems];
          setItems([...allItems]);
        });
      });
    } else {
      // Fetch only available items in the specific section
      const itemsRef = collection(firestore, 'sections', sectionName, 'items');
      const q = query(itemsRef);
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedItems = [];
        snapshot.forEach((doc) => {
          const itemData = doc.data();
          if (!itemData.unavailable) {
            fetchedItems.push({ id: doc.id, ...itemData, section: sectionName }); // Make sure section is passed
          }
        });
        setItems(fetchedItems);
      });
  
      return () => unsubscribe();
    }
  }, [sectionName]);
  

  const handleMarkAsUnavailable = async (itemId, section) => {
    if (!section) {
      console.error('Error: Section is missing or undefined.');
      return;
    }
  
    try {
      const itemDoc = doc(firestore, 'sections', section, 'items', itemId);
      await updateDoc(itemDoc, {
        unavailable: true,
      });
    } catch (error) {
      console.error('Error marking item as unavailable:', error);
    }
  };
  
  const handleMakeAvailableAgain = async (itemId, section) => {
    if (!section) {
      console.error('Error: Section is missing or undefined.');
      return;
    }
  
    try {
      const itemDoc = doc(firestore, 'sections', section, 'items', itemId);
      const itemData = await getDoc(itemDoc);
  
      navigation.navigate('AddItems', { 
        item: { id: itemId, ...itemData.data(), section } 
      });
    } catch (error) {
      console.error('Error making item available again:', error);
    }
  };
  

  const filterItems = (items) => {
    if (sectionName === 'Collection' && searchQuery) {
      return items.filter(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return items;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={require('../assets/rainbow_plaid.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: 'Sunshiney_400Regular' }]}>
            {sectionName}
          </Text>

          {sectionName === 'Collection' && (
            <TextInput
              style={styles.searchBar}
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          )}
        </View>

        <FlatList
          data={filterItems(items)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <Text style={styles.itemText}>{item.itemName}</Text>
              <Text style={styles.itemDetail}>Amount: {item.amount}</Text>
              <Text style={styles.itemDetail}>
                Last Stashed: {item.lastStashed ? new Date(item.lastStashed.seconds * 1000).toLocaleDateString() : 'Unknown'}
              </Text>

              {/* Show correct button based on availability status */}
              {item.unavailable ? (
                <TouchableOpacity
                  style={styles.checkBoxContainer}
                  onPress={() => handleMakeAvailableAgain(item.id, item.section)}
                >
                  <Text style={styles.checkBoxText}>Make Available</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.checkBoxContainer}
                  onPress={() => handleMarkAsUnavailable(item.id, item.section)}
                >
                  <Text style={styles.checkBoxText}>Make Unavailable</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No items found</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingLeft: 9,
    paddingRight: 17,
    paddingVertical: 10,
  },
  header: {
    alignItems: 'center', // Center title and search bar
    marginBottom: 0,
  },
  title: {
    fontSize: 40,
    color: '#fff',
    marginTop: 50,
    marginBottom: 10,
    textAlign: 'center',
  },
  searchBar: {
    width: '90%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginBottom: 20,
    fontFamily: 'Sunshiney_400Regular',
    fontSize: 15,
    color: '#beb2ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    justifyContent: 'flex-start', // Align items to the left
  },
  itemContainer: {
    backgroundColor: 'rgba(247, 255, 224, 0.5)',
    borderRadius: 30,
    padding: 10,
    flexBasis: '46%',
    margin: 9.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    color: '#cd78ff',
    fontFamily: 'Sunshiney_400Regular',
  },
  itemDetail: {
    fontSize: 14,
    marginBottom: 0,
    textAlign: 'center',
    color: '#beb2ff',
    fontFamily: 'Sunshiney_400Regular',
  },
  checkBoxContainer: {
    marginTop: 5,
    backgroundColor: '#f4ffd1',
    borderRadius: 50,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    fontFamily: 'Sunshiney_400Regular',
  },
  checkBoxText: {
    color: '#a4ba00',
    fontSize: 14,
    fontFamily: 'Sunshiney_400Regular',
  },
  emptyMessage: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Sunshiney_400Regular',
  },
});

export default SectionScreen;
