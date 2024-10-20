import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, 
  Platform, ActionSheetIOS, ScrollView, KeyboardAvoidingView, Keyboard, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { ImageBackground } from 'react-native'; // Import ImageBackground for the background image
import { useFonts } from 'expo-font'; // Import for custom fonts
import * as ImagePicker from 'expo-image-picker';
import { Sunshiney_400Regular } from '@expo-google-fonts/sunshiney';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebaseConfig'; // Ensure this points to your firebaseConfig file

const AddItemsScreen = ({ route, navigation }) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load the Sunshiney font
  const [fontsLoaded] = useFonts({
    Sunshiney_400Regular,
  });

  // Check if we have item data passed from the route (indicating we're editing an existing item)
  const { item } = route.params || {};

  useEffect(() => {
    // Pre-fill the form if item data is passed for editing
    if (item) {
      setItemName(item.itemName);
      setCategory(item.category);
      setAmount(item.amount);
      setImage(item.image);
    }

    // Request image permissions
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera and media library permissions to make this work!');
      }
    })();
  }, [item]);

  // Image picking functions
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets ? result.assets[0].uri : result.uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets ? result.assets[0].uri : result.uri);
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take a Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Upload Image',
        'Choose an option:',
        [
          { text: 'Take a Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImageFromGallery },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  const handleSaveItem = async () => {
  if (!itemName || !category || !amount) {
    Alert.alert('Error', 'Please fill all fields!');
    return;
  }

  try {
    const itemData = {
      itemName,
      category,
      amount,
      image,
      lastStashed: new Date(),
      sections: category // Make sure you set the correct section here
    };

    if (item) {
      // We're updating an existing item
      const itemDoc = doc(firestore, 'sections', item.section, 'items', item.id);
      await updateDoc(itemDoc, itemData);
    } else {
      // We're creating a new item
      const sectionRef = collection(firestore, 'sections', category, 'items');
      await addDoc(sectionRef, itemData);
    }

    navigation.goBack(); // Navigate back to the previous screen
  } catch (error) {
    console.error('Error saving item:', error);
    Alert.alert('Error', 'Could not save the item.');
  }
};


  if (!fontsLoaded) {
    return null; // Wait until fonts are loaded
  }

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => Keyboard.dismiss()}>
      <ImageBackground source={require('../assets/green_plaid.jpg')} style={styles.backgroundImage}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Title */}
            <Text style={[styles.titleText, { fontFamily: 'Sunshiney_400Regular' }]}>Stash it here!</Text>

            {/* Image Upload Section */}
            <View style={[styles.imageUploadSection, styles.shadow]}>
              <TouchableOpacity style={[styles.imageUploadButton, styles.shadow]} onPress={showImagePickerOptions}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Text style={styles.imagePlaceholderText}>Upload Image</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Input for Item Name */}
            <TextInput
              placeholder="Enter Item Name"
              placeholderTextColor="#dde3c1"
              value={itemName}
              onChangeText={setItemName}
              style={[styles.input, { fontFamily: 'Sunshiney_400Regular' }, styles.shadow]}
            />

            {/* Input for Amount */}
            <TextInput
              placeholder="Enter Item Amount"
              placeholderTextColor="#dde3c1"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.input, { fontFamily: 'Sunshiney_400Regular' }, styles.shadow]}
            />

            {/* Category Picker with Popup */}
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.categoryButtonText}>
                {category ? `Category: ${category}` : 'Select Category'}
              </Text>
            </TouchableOpacity>

            {/* Modal for Category Selection */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <Text style={[styles.modalTitle, { fontFamily: 'Sunshiney_400Regular' }]}>Select a Category</Text>
                      {['Bedroom', 'Bathroom', 'Pantry', 'Kitchen', 'Closet', 'Cleaning Supplies', 'Tools'].map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={styles.modalButton}
                          onPress={() => {
                            setCategory(cat);
                            setModalVisible(false);
                          }}
                        >
                          <Text style={styles.modalButtonText}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>

          {/* Button to Add/Save Item */}
          <TouchableOpacity style={[styles.addButton, styles.shadow]} onPress={handleSaveItem}>
            <Text style={styles.addButtonText}>{item ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  titleText: {
    fontSize: 37,
    color: '#91a17a',
    margin: 30,
    marginTop: 10,
  },
  imageUploadSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  imageUploadButton: {
    backgroundColor: '#e8edce',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 30,
  },
  imagePlaceholderText: {
    color: '#91a17a',
    fontSize: 20,
    fontFamily: 'Sunshiney_400Regular',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 0,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 20,
    color: '#91a17a',
  },
  categoryButton: {
    backgroundColor: '#e8edce',
    padding: 15,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryButtonText: {
    color: '#91a17a',
    fontSize: 20,
    fontFamily: 'Sunshiney_400Regular',
  },
  addButton: {
    backgroundColor: '#f4ff8c',
    padding: 20,
    borderRadius: 50,
    width: '50%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
  },
  addButtonText: {
    color: '#91a17a',
    fontSize: 25,
    fontFamily: 'Sunshiney_400Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#91a17a',
  },
  modalButton: {
    backgroundColor: '#e8edce',
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#91a17a',
    fontSize: 20,
    fontFamily: 'Sunshiney_400Regular',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default AddItemsScreen;
