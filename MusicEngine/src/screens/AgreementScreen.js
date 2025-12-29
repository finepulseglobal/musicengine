import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

export default function AgreementScreen({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [currentAgreement, setCurrentAgreement] = useState(null);
  const [formData, setFormData] = useState({});

  const agreements = [
    {
      id: 'production',
      title: 'Production Agreement',
      description: 'Agreement between artist and producer for music production services.',
    },
    {
      id: 'catalog',
      title: 'Catalog Transfer Agreement',
      description: 'Transfer ownership of music catalog from one party to another.',
    },
    {
      id: 'sampling',
      title: 'Sampling License',
      description: 'License agreement for using samples from existing musical works.',
    },
    {
      id: 'publishing',
      title: 'Publishing Agreement',
      description: 'Agreement between songwriter and publisher for music publishing rights.',
    },
  ];

  const openAgreementForm = (agreement) => {
    setCurrentAgreement(agreement);
    setFormData({});
    setShowModal(true);
  };

  const downloadAgreement = () => {
    Alert.alert('Success', `${currentAgreement.title} will be generated and downloaded.`);
    setShowModal(false);
  };

  const renderForm = () => {
    if (!currentAgreement) return null;

    switch (currentAgreement.id) {
      case 'production':
        return (
          <View>
            <Text style={globalStyles.label}>Your Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.artistName || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, artistName: value }))}
              placeholder="Artist name"
            />

            <Text style={globalStyles.label}>IPI Number:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.artistIPI || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, artistIPI: value }))}
              placeholder="IPI number"
            />

            <Text style={globalStyles.label}>Your Address:</Text>
            <TextInput
              style={[globalStyles.input, styles.textArea]}
              value={formData.artistAddress || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, artistAddress: value }))}
              placeholder="Your address"
              multiline
            />

            <Text style={globalStyles.label}>Split Percentage:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.splitPercent || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, splitPercent: value }))}
              placeholder="50"
              keyboardType="numeric"
            />

            <Text style={globalStyles.label}>Producer Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.producerName || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, producerName: value }))}
              placeholder="Producer name"
            />
          </View>
        );

      case 'catalog':
        return (
          <View>
            <Text style={globalStyles.label}>New Receiver Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.receiverName || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, receiverName: value }))}
              placeholder="Receiver name"
            />

            <Text style={globalStyles.label}>IPI Number:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.receiverIPI || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, receiverIPI: value }))}
              placeholder="IPI number"
            />

            <Text style={globalStyles.label}>Location:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.receiverLocation || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, receiverLocation: value }))}
              placeholder="Location"
            />

            <Text style={globalStyles.label}>Cost of Acquisition:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.acquisitionCost || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, acquisitionCost: value }))}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        );

      case 'sampling':
        return (
          <View>
            <Text style={globalStyles.label}>Original Music ISRC:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.originalISRC || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, originalISRC: value }))}
              placeholder="Original ISRC"
            />

            <Text style={globalStyles.label}>New Music ISRC:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.newISRC || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, newISRC: value }))}
              placeholder="New ISRC"
            />

            <Text style={globalStyles.label}>Performer Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.performerName || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, performerName: value }))}
              placeholder="Performer name"
            />

            <Text style={globalStyles.label}>Release Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.releaseName || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, releaseName: value }))}
              placeholder="Release name"
            />
          </View>
        );

      case 'publishing':
        return (
          <View>
            <Text style={globalStyles.label}>Songwriter Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.songwriterName || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, songwriterName: value }))}
              placeholder="Songwriter name"
            />

            <Text style={globalStyles.label}>IPI Number:</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.songwriterIPI || ''}
              onChangeText={(value) => setFormData(prev => ({ ...prev, songwriterIPI: value }))}
              placeholder="IPI number"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>Legal Agreements</Text>
      <Text style={globalStyles.subHeader}>Smart contract templates and licensing agreements</Text>

      {agreements.map((agreement) => (
        <View key={agreement.id} style={globalStyles.card}>
          <Text style={styles.agreementTitle}>{agreement.title}</Text>
          <Text style={styles.agreementDescription}>{agreement.description}</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => openAgreementForm(agreement)}
          >
            <Text style={globalStyles.buttonText}>Generate Agreement</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Agreement Form Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentAgreement?.title}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {renderForm()}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={globalStyles.button}
              onPress={downloadAgreement}
            >
              <Text style={globalStyles.buttonText}>Download Agreement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  agreementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  agreementDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 20,
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
    backgroundColor: colors.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});