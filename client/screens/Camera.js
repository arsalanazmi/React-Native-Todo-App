import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

const CameraComponent = ({navigation, route}) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [camView, setCamView] = useState('back');
  const [pickerResponse, setPickerResponse] = useState(null);
  const devices = useCameraDevices();
  const device = camView === 'back' ? devices.back : devices.front;
  const camera = useRef(null);
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const takePhotoOptions = {
    flash: 'on',
    qualityPrioritazation: 'speed',
    enableAutoRedEyeReduction: true,
  };

  const takePhoto = async () => {
    try {
      //Error Handle better
      if (camera.current == null) throw new Error('Camera Ref is Null');
      console.log('Photo taking ....');
      const photo = await camera.current.takePhoto(takePhotoOptions);
      const uri = 'file:///' + photo.path;
      console.log(uri);
      
      if (route.params.updateProfile) {
        console.log("Update",route.params.updateProfile);
        return navigation.navigate('profile', {image: uri});
      } else {
        return navigation.navigate('register', {image: uri});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chooseFile = useCallback(() => {
    let options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, setPickerResponse);
  }, []);

  useEffect(() => {
    const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;

    if (uri !== undefined) {
      console.log(uri);
      if (route.params.updateProfile) {
        return navigation.navigate('profile', {image: uri});
      } else {
        return navigation.navigate('register', {image: uri});
      }
    }
  });

  function renderCamera() {
    if (device == null) return <View />;
    else {
      return (
        <View style={{flex: 1}}>
          {device != null && hasPermission && (
            <>
              <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
              />
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: 10,
                  justifyContent: 'space-evenly',
                  width: '100%',
                }}>
                <Icon
                  name="image"
                  size={40}
                  color="#fff"
                  onPress={chooseFile}
                />
                <Icon
                  name="camera"
                  size={40}
                  color="#fff"
                  onPress={() => {
                    takePhoto();
                  }}
                />
                <Icon
                  name="flip-camera-android"
                  size={40}
                  color="#fff"
                  onPress={() => {
                    camView === 'back'
                      ? setCamView('front')
                      : setCamView('back');
                  }}
                />
              </View>
            </>
          )}
        </View>
      );
    }
  }
  return <View style={{flex: 1}}>{renderCamera()}</View>;
};

export default CameraComponent;
