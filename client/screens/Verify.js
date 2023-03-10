import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {loadUser, verify} from '../redux/action';

const Verify = () => {
  const dispatch = useDispatch();
  const {message, error} = useSelector(state => state.auth);

  const [otp, setOtp] = useState('');

  const verifyHandler = async () => {
    await dispatch(verify(otp));
    dispatch(loadUser());
  };
  
  useEffect(() => {
    if (message) {
      alert(message);
      dispatch({type: 'clearMessage'});
    }
    if (error) {
      alert(error);
      dispatch({type: 'clearError'});
    }
  }, [alert, message, dispatch, error]);
  

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 20, margin: 20}}>Verification</Text>
      <View style={{width: '70%'}}>
        <TextInput
          style={Styles.input}
          placeholder="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />
      </View>

      <Button style={Styles.btn} onPress={verifyHandler}>
        <Text style={{color: '#fff'}}>Verify</Text>
      </Button>
    </View>
  );
};

export default Verify;

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
