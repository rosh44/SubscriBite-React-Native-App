import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { useContext } from 'react';

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const name = authCtx.name;
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome To SubscriBite! :D</Text>
      <Text>Hello {name}! Thank you for signing up!</Text>
      <Text>
        Now we will learn more about React Native and setting up different kinds
        of contexts on the UI store.
      </Text>
    </View>
  
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
