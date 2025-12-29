import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

export default function GovernanceScreen({ navigation }) {
  const sections = [
    {
      title: 'Compliance Framework',
      content: 'Music Engine operates under strict international copyright compliance standards to ensure your rights are protected globally.',
      points: [
        'Berne Convention: Full compliance with international copyright protection standards',
        'WIPO Treaties: Adherence to World Intellectual Property Organization guidelines',
        'National Laws: Compliance with local copyright laws in over 180 countries',
        'Industry Standards: CWR 2.0, DDEX, and other music industry protocols',
      ],
    },
    {
      title: 'Data Security & Privacy',
      content: 'Your intellectual property and personal data are protected using industry-leading security measures.',
      points: [
        'Blockchain Security: Immutable records stored on distributed ledger',
        'Encryption: End-to-end encryption for all sensitive data',
        'Access Control: Multi-factor authentication and role-based permissions',
        'Privacy Protection: GDPR and CCPA compliant data handling',
      ],
    },
    {
      title: 'Smart Contract Governance',
      content: 'Automated and transparent execution of agreements through blockchain technology.',
      points: [
        'Transparent Execution: All contract terms executed automatically',
        'Immutable Records: Contract history cannot be altered or deleted',
        'Multi-signature Security: Critical operations require multiple approvals',
        'Audit Trail: Complete transaction history for all activities',
      ],
    },
    {
      title: 'Rights Management',
      content: 'Comprehensive protection and management of your intellectual property rights.',
      points: [
        'Ownership Verification: Cryptographic proof of ownership',
        'Rights Tracking: Real-time monitoring of usage and licensing',
        'Dispute Resolution: Automated and manual dispute handling processes',
        'Revenue Distribution: Transparent and automated royalty payments',
      ],
    },
  ];

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>Platform Governance</Text>
      <Text style={globalStyles.subHeader}>
        Transparent, secure, and compliant music rights management
      </Text>

      {sections.map((section, index) => (
        <View key={index} style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
          {section.points.map((point, pointIndex) => (
            <Text key={pointIndex} style={styles.point}>
              • {point}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 20,
  },
  point: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
    marginLeft: 10,
    lineHeight: 18,
  },
});