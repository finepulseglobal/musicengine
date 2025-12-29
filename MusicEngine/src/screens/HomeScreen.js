import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { globalStyles, colors } from '../styles/globalStyles';

export default function HomeScreen({ navigation }) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowQRModal(true);
    } else {
      Alert.alert('Permission Required', 'Camera permission is needed for QR code scanning');
    }
  };

  const handleQRScan = ({ data }) => {
    setShowQRModal(false);
    setIsLoggedIn(true);
    Alert.alert('Login Successful', 'Welcome to Music Engine!');
  };

  const simulateLogin = () => {
    setShowQRModal(false);
    setIsLoggedIn(true);
    Alert.alert('Login Successful', 'Welcome to Music Engine!');
  };

  return (
    <View style={globalStyles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }}
        style={styles.heroBackground}
        imageStyle={styles.heroImage}
      >
        <View style={styles.overlay}>
          <View style={globalStyles.heroContainer}>
            <Text style={globalStyles.heroTitle}>
              Music is the weapon of intellectual
            </Text>
            
            <TouchableOpacity
              style={globalStyles.heroButton}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={globalStyles.heroButtonText}>Enter Platform</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[globalStyles.button, { backgroundColor: colors.secondary }]}
          onPress={requestCameraPermission}
        >
          <Text style={globalStyles.buttonText}>
            {isLoggedIn ? 'Logged In' : 'Login/Register'}
          </Text>
        </TouchableOpacity>

        {isLoggedIn && (
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={globalStyles.buttonText}>Profile</Text>
          </TouchableOpacity>
        )}

        <View style={styles.quickNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={styles.navButtonText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.navButtonText}>About</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Scanner Modal */}
      <Modal
        visible={showQRModal}
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scan QR Code</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {hasPermission && (
            <BarCodeScanner
              onBarCodeScanned={handleQRScan}
              style={styles.scanner}
            />
          )}

          <View style={styles.modalFooter}>
            <Text style={styles.modalText}>
              Scan with your device to login/register
            </Text>
            <TouchableOpacity
              style={globalStyles.button}
              onPress={simulateLogin}
            >
              <Text style={globalStyles.buttonText}>Simulate Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  heroBackground: {
    flex: 1,
  },
  heroImage: {
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  navButton: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: colors.light,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.dark,
  },
  scanner: {
    flex: 1,
  },
  modalFooter: {
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
});