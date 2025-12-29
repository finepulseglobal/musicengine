import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

export default function ServicesScreen({ navigation }) {
  const services = [
    {
      title: 'Music Registration',
      features: [
        'Complete copyright registration',
        'CWR 2.0 support',
        'Metadata management',
        'Blockchain integration',
        'International compliance',
      ],
    },
    {
      title: 'Copyright Portal',
      features: [
        'Rights tracking dashboard',
        'International compliance monitoring',
        'Work registration status',
        'Rights ownership verification',
        'Legal documentation',
      ],
    },
    {
      title: 'Split & Royalty Management',
      features: [
        'Automated royalty distribution',
        'Split calculations',
        'Payment processing',
        'Revenue tracking',
        'Transparent reporting',
      ],
    },
    {
      title: 'Legal Agreements',
      features: [
        'Smart contract templates',
        'Production agreements',
        'Publishing contracts',
        'Sampling licenses',
        'Catalog transfer agreements',
      ],
    },
    {
      title: 'Blockchain Technology',
      features: [
        'Immutable copyright records',
        'Smart contract automation',
        'Transparent transactions',
        'Decentralized verification',
        'Secure data storage',
      ],
    },
    {
      title: 'Global Compliance',
      features: [
        'Berne Convention compliance',
        'WIPO standards',
        'Multi-jurisdiction support',
        'International treaties',
        'Regional regulations',
      ],
    },
  ];

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>Our Services</Text>
      <Text style={globalStyles.subHeader}>
        Comprehensive music copyright and rights management solutions
      </Text>

      {services.map((service, index) => (
        <View key={index} style={globalStyles.card}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          {service.features.map((feature, featureIndex) => (
            <Text key={featureIndex} style={styles.feature}>
              • {feature}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  feature: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 5,
    marginLeft: 10,
  },
});