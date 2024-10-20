import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { db } from '../firebaseConfig'; // Import Firebase config
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions

const BarcodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle barcode scanning
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    // Save the scanned data to Firestore
    try {
      const docRef = await addDoc(collection(db, 'scannedBarcodes'), {
        type: type,
        data: data,
        timestamp: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}

      {barcodeData && (
        <Text style={styles.barcodeText}>Scanned Data: {barcodeData}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 16,
    marginTop: 20,
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});

export default BarcodeScannerScreen;
