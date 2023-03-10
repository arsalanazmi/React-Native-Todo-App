import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {updatePassword} from '../redux/action';

const ChangePassword = ({navigation}) => {
  const dispatch = useDispatch();
  const {message, error} = useSelector(state => state.message);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const changePasswordHandler = async() => {
    await dispatch(updatePassword(oldPassword, newPassword, confirmPassword));
    navigation.navigate("profile")

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
      <Text style={{fontSize: 20, margin: 20}}>Change Password</Text>
      <View style={{width: '70%'}}>
        <TextInput
          secureTextEntry
          style={Styles.input}
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          secureTextEntry
          style={Styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          secureTextEntry
          style={Styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <Button style={Styles.btn} onPress={changePasswordHandler}>
        <Text style={{color: '#fff'}}>Change</Text>
      </Button>
    </View>
  );
};

export default ChangePassword;

const Styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b5b5b5',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 5,
    marginVertical: 12,
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
