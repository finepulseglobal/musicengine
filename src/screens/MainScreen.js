import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

export default function MainScreen({ navigation }) {
  const features = [
    {
      title: 'Music Registration',
      description: 'Complete copyright registration with CWR 2.0 support, metadata management, and blockchain integration.',
      screen: 'Register',
    },
    {
      title: 'Copyright Portal',
      description: 'Comprehensive copyright management dashboard with international compliance and rights tracking.',
      screen: 'Copyright',
    },
    {
      title: 'Split & Royalty',
      description: 'Automated royalty distribution, split calculations, and transparent payment processing.',
      screen: 'Royalty',
    },
    {
      title: 'Legal Agreements',
      description: 'Smart contract templates, licensing agreements, and automated legal document generation.',
      screen: 'Agreement',
    },
  ];

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>Music Copyright Management Platform</Text>
      <Text style={globalStyles.subHeader}>
        Streamline your music rights, royalties, and legal agreements in one powerful platform
      </Text>

      {features.map((feature, index) => (
        <View key={index} style={globalStyles.card}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <Text style={globalStyles.buttonText}>
              {feature.screen === 'Register' ? 'Register Music' :
               feature.screen === 'Copyright' ? 'Access Portal' :
               feature.screen === 'Royalty' ? 'Manage Royalties' :
               'View Agreements'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Quick Navigation */}
      <View style={styles.quickNavContainer}>
        <Text style={globalStyles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickNavGrid}>
          <TouchableOpacity
            style={styles.quickNavButton}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={styles.quickNavText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickNavButton}
            onPress={() => navigation.navigate('Governance')}
          >
            <Text style={styles.quickNavText}>Governance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickNavButton}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.quickNavText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickNavButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.quickNavText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 20,
  },
  quickNavContainer: {
    marginTop: 20,
  },
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickNavButton: {
    width: '48%',
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  quickNavText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});