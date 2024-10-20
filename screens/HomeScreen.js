import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ScreenWithBackground from '../components/ScreenWithBackground'; // Corrected path

const HomeScreen = ({ navigation }) => {
  const [activeButton, setActiveButton] = useState(null);

  // Handle press-in (touch start)
  const handlePressIn = (room) => {
    setActiveButton(room);
  };

  // Handle press-out (touch end)
  const handlePressOut = () => {
    setActiveButton(null);
  };

  const renderButton = (roomName) => (
    <TouchableOpacity
      style={styles.room} // No background color change for the button
      onPressIn={() => handlePressIn(roomName)}
      onPressOut={handlePressOut}
      onPress={() => navigation.navigate('Section', { sectionName: roomName })}
    >
      <Text style={[styles.buttonText, activeButton === roomName && styles.textVisible]}>
        {roomName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWithBackground backgroundImage={require('../assets/plaid.png')}>
      <View style={styles.container}>
        {/* House image behind the buttons */}
        <Image source={require('../assets/home.png')} style={styles.houseImage} />
        {/* New "All" button */}
        {renderButton('Collection')}
        {/* Render buttons for each room */}
        {renderButton('Bedroom')}
        {renderButton('Bathroom')}
        {renderButton('Pantry')}
        {renderButton('Kitchen')}
        {renderButton('Closet')}
        {renderButton('Cleaning Supplies')}
        {renderButton('Tools')}
      </View>
    </ScreenWithBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseImage: {
    position: 'absolute',
    bottom: 15,
    width: '105%',
    height: '105%',
    resizeMode: 'contain',
  },
  room: {
    margin: 3,
    padding: 8,
    alignItems: 'center',
    width: '71%',
    bottom: -10,
    // backgroundColor: 'black',
  },
  buttonText: {
    color: 'white', // Initial color
    fontSize: 44, // Increase font size
    fontWeight: '900', // Make text bold
    fontFamily: 'Sunshiney_400Regular',
    textShadowColor: '#000', // Set the shadow color to black
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  textVisible: {
    color: 'transparent', // Change text color when pressed
    fontSize: 44, // Keep the same size when pressed
    fontWeight: '900', // Make it thicker
  },
});

export default HomeScreen;
  