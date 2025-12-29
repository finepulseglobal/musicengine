import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    legalName: '',
    stageName: '',
    email: '',
    phone: '',
    address: '',
    ipiNumber: '',
    isniNumber: '',
    // Social Media
    spotify: '',
    appleMusic: '',
    youtube: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    audiomack: '',
    boomplay: '',
  });

  const [productionTeam, setProductionTeam] = useState([
    { name: '', ipi: '', isni: '', location: '' }
  ]);

  const [arTeam, setArTeam] = useState([
    { name: '', ipi: '', isni: '', location: '' }
  ]);

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addTeamMember = (type) => {
    const newMember = { name: '', ipi: '', isni: '', location: '' };
    if (type === 'production') {
      setProductionTeam(prev => [...prev, newMember]);
    } else {
      setArTeam(prev => [...prev, newMember]);
    }
  };

  const removeTeamMember = (type, index) => {
    if (type === 'production') {
      setProductionTeam(prev => prev.filter((_, i) => i !== index));
    } else {
      setArTeam(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (type, index, field, value) => {
    if (type === 'production') {
      setProductionTeam(prev => prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      ));
    } else {
      setArTeam(prev => prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      ));
    }
  };

  const saveProfile = () => {
    Alert.alert('Success', 'Profile saved successfully!');
  };

  const renderTeamSection = (title, team, type) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={globalStyles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => addTeamMember(type)}
        >
          <Text style={globalStyles.buttonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {team.map((member, index) => (
        <View key={index} style={styles.teamMember}>
          {team.length > 1 && (
            <TouchableOpacity
              style={[globalStyles.dangerButton, styles.removeButton]}
              onPress={() => removeTeamMember(type, index)}
            >
              <Text style={globalStyles.buttonText}>Remove</Text>
            </TouchableOpacity>
          )}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={globalStyles.label}>Name:</Text>
              <TextInput
                style={globalStyles.input}
                value={member.name}
                onChangeText={(value) => updateTeamMember(type, index, 'name', value)}
                placeholder="Team member name"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={globalStyles.label}>IPI:</Text>
              <TextInput
                style={globalStyles.input}
                value={member.ipi}
                onChangeText={(value) => updateTeamMember(type, index, 'ipi', value)}
                placeholder="IPI number"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={globalStyles.label}>ISNI:</Text>
              <TextInput
                style={globalStyles.input}
                value={member.isni}
                onChangeText={(value) => updateTeamMember(type, index, 'isni', value)}
                placeholder="ISNI number"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={globalStyles.label}>Location:</Text>
              <TextInput
                style={globalStyles.input}
                value={member.location}
                onChangeText={(value) => updateTeamMember(type, index, 'location', value)}
                placeholder="Location"
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>Artist Profile</Text>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={globalStyles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={globalStyles.label}>Legal Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile.legalName}
              onChangeText={(value) => updateProfile('legalName', value)}
              placeholder="Your legal name"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={globalStyles.label}>Stage Name:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile.stageName}
              onChangeText={(value) => updateProfile('stageName', value)}
              placeholder="Your stage name"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={globalStyles.label}>Email:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile.email}
              onChangeText={(value) => updateProfile('email', value)}
              placeholder="email@example.com"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={globalStyles.label}>Phone:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile.phone}
              onChangeText={(value) => updateProfile('phone', value)}
              placeholder="+1234567890"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Text style={globalStyles.label}>Address:</Text>
        <TextInput
          style={globalStyles.input}
          value={profile.address}
          onChangeText={(value) => updateProfile('address', value)}
          placeholder="Your address"
          multiline
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={globalStyles.label}>IPI Number:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile.ipiNumber}
              onChangeText={(value) => updateProfile('ipiNumber', value)}
              placeholder="IPI number"
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={globalStyles.label}>ISNI Number:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile.isniNumber}
              onChangeText={(value) => updateProfile('isniNumber', value)}
              placeholder="ISNI number"
            />
          </View>
        </View>
      </View>

      {/* Social Media Links */}
      <View style={styles.section}>
        <Text style={globalStyles.sectionTitle}>Social Media & Streaming Links</Text>
        
        {[
          { key: 'spotify', label: 'Spotify' },
          { key: 'appleMusic', label: 'Apple Music' },
          { key: 'youtube', label: 'YouTube' },
          { key: 'instagram', label: 'Instagram' },
          { key: 'tiktok', label: 'TikTok' },
          { key: 'facebook', label: 'Facebook' },
          { key: 'audiomack', label: 'Audiomack' },
          { key: 'boomplay', label: 'Boomplay' },
        ].map((platform, index) => (
          <View key={platform.key}>
            <Text style={globalStyles.label}>{platform.label}:</Text>
            <TextInput
              style={globalStyles.input}
              value={profile[platform.key]}
              onChangeText={(value) => updateProfile(platform.key, value)}
              placeholder={`${platform.label} URL`}
              keyboardType="url"
            />
          </View>
        ))}
      </View>

      {/* Production Team */}
      {renderTeamSection('Production Team', productionTeam, 'production')}

      {/* A&R Team */}
      {renderTeamSection('A&R Team', arTeam, 'ar')}

      <TouchableOpacity style={globalStyles.button} onPress={saveProfile}>
        <Text style={globalStyles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  teamMember: {
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
});