import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Picker,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { globalStyles, colors } from '../styles/globalStyles';

export default function RegisterScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Work Information
    workcode: `WRK${Date.now().toString().slice(-6)}`,
    title: '',
    catalogNo: '',
    primaryArtist: '',
    featuredArtist: '',
    isrc: '',
    duration: '',
    releaseDate: '',
    releaseType: 'Single',
    iswc: '',
    society: '',
    
    // Step 2: Session Info & Files
    recordingLocation: '',
    key: '',
    bpm: '',
    language: 'EN',
    lyrics: '',
    aiGenerated: false,
    containsSamples: false,
    musicFile: null,
    artworkFile: null,
    
    // Step 3: Rights & Credits
    songwriters: [{ name: '', ipi: '', isni: '', split: '' }],
    publishers: [{ name: '', ipi: '', isni: '', split: '', territory: 'WW' }],
    administrators: [{ name: '', ipi: '', isni: '', split: '', territory: 'WW' }],
    producers: [{ name: '', role: 'Producer' }],
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addDynamicEntry = (type) => {
    const newEntry = type === 'songwriters' || type === 'publishers' || type === 'administrators'
      ? { name: '', ipi: '', isni: '', split: '', ...(type !== 'songwriters' && { territory: 'WW' }) }
      : { name: '', role: 'Producer' };
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newEntry]
    }));
  };

  const removeDynamicEntry = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateDynamicEntry = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const pickFile = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'music' ? 'audio/*' : 'image/*',
      });
      
      if (!result.canceled) {
        updateFormData(type === 'music' ? 'musicFile' : 'artworkFile', result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return false;
    }
    if (!formData.primaryArtist.trim()) {
      Alert.alert('Validation Error', 'Primary Artist is required');
      return false;
    }
    if (formData.songwriters.length === 0 || !formData.songwriters[0].name.trim()) {
      Alert.alert('Validation Error', 'At least one songwriter is required');
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for Google Sheets
      const submissionData = {
        workcode: formData.workcode,
        title: formData.title,
        catalog_no: formData.catalogNo,
        primary_artist: formData.primaryArtist,
        featured_artist: formData.featuredArtist,
        isrc: formData.isrc,
        duration: formData.duration,
        release_date: formData.releaseDate,
        release_type: formData.releaseType,
        iswc: formData.iswc,
        society: formData.society,
        recording_location: formData.recordingLocation,
        key: formData.key,
        bpm: formData.bpm,
        language: formData.language,
        lyrics: formData.lyrics,
        ai_generated: formData.aiGenerated,
        contains_samples: formData.containsSamples,
        songwriters: formData.songwriters,
        publishers: formData.publishers,
        administrators: formData.administrators,
        producers: formData.producers,
        music_file: formData.musicFile?.name || null,
        artwork_file: formData.artworkFile?.name || null,
        timestamp: new Date().toISOString()
      };

      // Submit to Google Apps Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbxYOUR_SCRIPT_ID/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        Alert.alert('Success', 'Music registration submitted successfully!');
        navigation.goBack();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
      console.error('Submission error:', error);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map(step => (
        <View
          key={step}
          style={[
            styles.stepDot,
            currentStep === step && styles.activeStep,
            currentStep > step && styles.completedStep,
          ]}
        >
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Work Information - Step 1 of 3</Text>
      
      <View style={styles.row}>
        <View style={styles.thirdWidth}>
          <Text style={globalStyles.label}>Work Code:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.workcode}
            onChangeText={(value) => updateFormData('workcode', value)}
            placeholder="Auto-generated"
          />
        </View>
        <View style={styles.thirdWidth}>
          <Text style={globalStyles.label}>Title:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            placeholder="Song title"
          />
        </View>
        <View style={styles.thirdWidth}>
          <Text style={globalStyles.label}>Catalog No:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.catalogNo}
            onChangeText={(value) => updateFormData('catalogNo', value)}
            placeholder="Catalog number"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={globalStyles.label}>Primary Artist:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.primaryArtist}
            onChangeText={(value) => updateFormData('primaryArtist', value)}
            placeholder="Primary artist name"
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={globalStyles.label}>Featured Artist:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.featuredArtist}
            onChangeText={(value) => updateFormData('featuredArtist', value)}
            placeholder="Featured artist (optional)"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.thirdWidth}>
          <Text style={globalStyles.label}>ISRC:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.isrc}
            onChangeText={(value) => updateFormData('isrc', value)}
            placeholder="USRC17607839"
          />
        </View>
        <View style={styles.thirdWidth}>
          <Text style={globalStyles.label}>Duration:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.duration}
            onChangeText={(value) => updateFormData('duration', value)}
            placeholder="03:45"
          />
        </View>
        <View style={styles.thirdWidth}>
          <Text style={globalStyles.label}>Release Date:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.releaseDate}
            onChangeText={(value) => updateFormData('releaseDate', value)}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Session Info, Files & Lyrics - Step 2 of 3</Text>
      
      <Text style={globalStyles.sectionTitle}>Session Information</Text>
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={globalStyles.label}>Recording Location:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.recordingLocation}
            onChangeText={(value) => updateFormData('recordingLocation', value)}
            placeholder="Studio name or location"
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={globalStyles.label}>Key:</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.key}
            onChangeText={(value) => updateFormData('key', value)}
            placeholder="C Major, A Minor, etc."
          />
        </View>
      </View>

      <Text style={globalStyles.sectionTitle}>File Uploads</Text>
      <TouchableOpacity
        style={styles.fileButton}
        onPress={() => pickFile('music')}
      >
        <Text style={styles.fileButtonText}>
          {formData.musicFile ? formData.musicFile.name : 'Upload Music File'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fileButton}
        onPress={() => pickFile('artwork')}
      >
        <Text style={styles.fileButtonText}>
          {formData.artworkFile ? formData.artworkFile.name : 'Upload Artwork'}
        </Text>
      </TouchableOpacity>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateFormData('aiGenerated', !formData.aiGenerated)}
        >
          <Text style={styles.checkboxText}>
            {formData.aiGenerated ? '☑' : '☐'} This content contains AI-generated material
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateFormData('containsSamples', !formData.containsSamples)}
        >
          <Text style={styles.checkboxText}>
            {formData.containsSamples ? '☑' : '☐'} This content contains samples from other works
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={globalStyles.label}>Lyrics:</Text>
      <TextInput
        style={[globalStyles.input, styles.textArea]}
        value={formData.lyrics}
        onChangeText={(value) => updateFormData('lyrics', value)}
        placeholder="Enter song lyrics here..."
        multiline
        numberOfLines={6}
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Rights & Credits - Step 3 of 3</Text>
      
      {/* Songwriters */}
      <View style={styles.dynamicSection}>
        <View style={styles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>Songwriters</Text>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => addDynamicEntry('songwriters')}
          >
            <Text style={globalStyles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {formData.songwriters.map((songwriter, index) => (
          <View key={index} style={styles.dynamicEntry}>
            {formData.songwriters.length > 1 && (
              <TouchableOpacity
                style={[globalStyles.dangerButton, styles.removeButton]}
                onPress={() => removeDynamicEntry('songwriters', index)}
              >
                <Text style={globalStyles.buttonText}>Remove</Text>
              </TouchableOpacity>
            )}

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={globalStyles.label}>Name:</Text>
                <TextInput
                  style={globalStyles.input}
                  value={songwriter.name}
                  onChangeText={(value) => updateDynamicEntry('songwriters', index, 'name', value)}
                  placeholder="Songwriter name"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={globalStyles.label}>Split %:</Text>
                <TextInput
                  style={globalStyles.input}
                  value={songwriter.split}
                  onChangeText={(value) => updateDynamicEntry('songwriters', index, 'split', value)}
                  placeholder="50"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>Copyright Registration Form</Text>
      
      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: colors.gray }]}
            onPress={prevStep}
          >
            <Text style={globalStyles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < 3 ? (
          <TouchableOpacity style={globalStyles.button} onPress={nextStep}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={globalStyles.button} onPress={submitForm}>
            <Text style={globalStyles.buttonText}>Submit Registration</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  completedStep: {
    backgroundColor: colors.secondary,
  },
  stepText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  thirdWidth: {
    width: '32%',
  },
  fileButton: {
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 15,
    alignItems: 'center',
  },
  fileButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginVertical: 15,
  },
  checkbox: {
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.dark,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dynamicSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dynamicEntry: {
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
});