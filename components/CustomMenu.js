import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomMenu = ({ isVisible, onClose, navigation }) => { 
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Home'); onClose(); }}>
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Profile'); onClose(); }}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};


export default CustomMenu;
