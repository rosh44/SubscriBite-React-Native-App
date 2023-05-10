import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { useContext } from 'react';

function AccountScreen() {
  const authCtx = useContext(AuthContext);
  const name = authCtx.name;
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Account</Text>
      
    </View>
  
  );
}

export default AccountScreen;

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
