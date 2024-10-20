import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const ScreenWithBackground = ({ children, backgroundImage }) => {
  return (
    <ImageBackground
      source={backgroundImage} 
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default ScreenWithBackground;
