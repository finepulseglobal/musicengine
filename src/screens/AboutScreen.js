import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';

export default function AboutScreen({ navigation }) {
  const stats = [
    { number: '180+', label: 'Countries Supported' },
    { number: '99.9%', label: 'Platform Uptime' },
    { number: '24/7', label: 'Global Support' },
    { number: '100%', label: 'Compliance Rate' },
  ];

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.scrollContainer}>
      <Text style={globalStyles.header}>About Music Engine</Text>
      <Text style={globalStyles.subHeader}>
        Revolutionizing music copyright management through blockchain technology
      </Text>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          Music Engine is dedicated to empowering artists, producers, and music industry professionals 
          with cutting-edge copyright management tools. We believe that music is the weapon of intellectual 
          property, and every creator deserves transparent, secure, and efficient rights management.
        </Text>
        <Text style={styles.paragraph}>
          Our platform combines traditional music industry standards with innovative blockchain technology 
          to create an immutable, transparent, and globally accessible copyright management system.
        </Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Technology Stack</Text>
        <Text style={styles.paragraph}>
          Music Engine leverages state-of-the-art technology to ensure your intellectual property 
          is protected and managed efficiently:
        </Text>
        <Text style={styles.techPoint}>
          <Text style={styles.bold}>Blockchain Infrastructure:</Text> Built on secure, decentralized 
          networks ensuring immutable copyright records and transparent transactions.
        </Text>
        <Text style={styles.techPoint}>
          <Text style={styles.bold}>Smart Contracts:</Text> Automated execution of agreements, 
          royalty distributions, and rights management without intermediaries.
        </Text>
        <Text style={styles.techPoint}>
          <Text style={styles.bold}>Industry Standards:</Text> Full compliance with CWR 2.0, DDEX, 
          Dublin Core, and other international music industry protocols.
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Why Choose Music Engine?</Text>
        <Text style={styles.whyPoint}>
          <Text style={styles.bold}>Transparency:</Text> Every transaction, agreement, and rights 
          transfer is recorded on the blockchain, providing complete transparency and audit trails.
        </Text>
        <Text style={styles.whyPoint}>
          <Text style={styles.bold}>Security:</Text> Military-grade encryption and blockchain security 
          ensure your intellectual property is protected from unauthorized access or tampering.
        </Text>
        <Text style={styles.whyPoint}>
          <Text style={styles.bold}>Efficiency:</Text> Automated processes reduce administrative 
          overhead and ensure faster royalty distributions and rights management.
        </Text>
        <Text style={styles.whyPoint}>
          <Text style={styles.bold}>Global Reach:</Text> Our platform supports international copyright 
          laws and treaties, making it easy to protect your rights worldwide.
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          Ready to revolutionize your music rights management? Get in touch with our team to learn 
          more about how Music Engine can help protect and monetize your intellectual property.
        </Text>
        <Text style={styles.contactInfo}>Email: info@musicengine.com</Text>
        <Text style={styles.contactInfo}>Support: support@musicengine.com</Text>
        <Text style={styles.contactInfo}>Business: business@musicengine.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 20,
    textAlign: 'justify',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  techPoint: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
    lineHeight: 18,
  },
  whyPoint: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
    fontWeight: 'bold',
  },
});