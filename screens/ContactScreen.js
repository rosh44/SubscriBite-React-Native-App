import { View, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/styles';

const ContactScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contactContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
        </View>
        <Text style={styles.text}>In any case of query, please feel free to contact us.</Text>
        <View style={styles.contactInfo}>
          <MaterialCommunityIcons name="email" size={32} color="black" />
          <Text style={styles.contactText}>subscribite.keystone@gmail.com</Text>
        </View>
        <View style={styles.contactInfo}>
          <MaterialCommunityIcons name="cellphone" size={32} color="black" />
          <Text style={styles.contactText}>+1 (949) 771-6635 / +1 (949) 686-8495</Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.primary100,
  },
  contactContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    padding: 15,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 30,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 90,
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
  },
  contactInfo: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 15,
    paddingHorizontal: 10,
  },
};

export default ContactScreen;
