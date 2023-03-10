import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {forgetPassword} from '../redux/action';

const ForgetPassword = ({navigation}) => {
  const dispatch = useDispatch();

  const {loading} = useSelector(state => state.message);
console.log(loading);
  const [email, setEmail] = useState('');

  const forgetPasswordHandler = async () => {
    await dispatch(forgetPassword(email));
    navigation.navigate('resetpassword');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 20, margin: 20}}>Forget Password</Text>
      <View style={{width: '70%'}}>
        <TextInput
          style={Styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <Button
        style={Styles.btn}
        onPress={forgetPasswordHandler}
        disabled={loading}
        loading={loading}
        >
        <Text style={loading?({color: '#282828'}):({color: '#fff'})}>Send Email</Text>
      </Button>
    </View>
  );
};

export default ForgetPassword;

const Styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b5b5b5',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 5,
    marginVertical: 15,
    fontSize: 15,
  },
  btn: {
    backgroundColor: '#900',
    padding: 5,
    marginVertical: 12,
    width: '70%',
    borderRadius: 0,
  },
});
