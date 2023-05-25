import React,{useState, useEffect} from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';
import Icon from 'react-native-vector-icons/Feather';

function IncDecButton({ quantity, uniqueId , parentUpdateFunc }) {
    let [newQuantity, setNewQuantity]=useState(quantity);

    useEffect(() => {
      parentUpdateFunc(uniqueId, newQuantity);
    }, [newQuantity]);

    function decrement() {
      setNewQuantity((prevQuantity) => {
        if (prevQuantity >= 1) {
          return prevQuantity - 1;
        } else {
          return 0;
        }
      });
    }
    
    function increment() {
      setNewQuantity((prevQuantity) => prevQuantity + 1);
    }
    return (
      
      <View style={styles.lookandfeel}>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={decrement}>
          {
            newQuantity == 1 ? (<Icon name="trash-2" size={18} />) 
            : newQuantity>1 ? (<Icon name="minus-circle" size={18} />)
            : (<View style={{width:18}}></View>)
          }
        </Pressable> 
        <Text style={[styles.buttonText]}> {newQuantity} </Text>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={increment}>
            <Icon name = "plus-circle" size={18}/>
        </Pressable>
      </View>
  );
}

export default IncDecButton;

const styles = StyleSheet.create({
    lookandfeel:{flexDirection:'row', 
    justifyContent:'flex-start', 
    alignItems:'center', 
    justifyContent:'space-between', 
    width:100
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 15
  },
  iconSize:{
    size:18
  }
});
