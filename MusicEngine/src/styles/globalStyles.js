import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#007cba',
  primaryDark: '#005a87',
  secondary: '#28a745',
  danger: '#dc3545',
  dark: '#333',
  light: '#f8f9fa',
  white: '#ffffff',
  gray: '#666',
  lightGray: '#ddd',
  background: '#f0f0f0',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 5,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.dark,
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 4,
    marginTop: 20,
  },
  heroButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default globalStyles;