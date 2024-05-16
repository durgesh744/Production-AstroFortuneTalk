import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import * as ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native';
import VedioPlayer from '../../component/VedioPlayer';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'rn-fetch-blob';
import {
  api_url,
  pooja_upload_attachments,
  pooja_upload_attachments_video,
} from '../../config/Constants';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import Loader from '../../component/Loader';

const UploadEcommerce = ({navigation, route}) => {
  console.log(route?.params?.poojaData);
  const [state, setState] = useState({
    imageData: null,
    vedioData: null,
    description: '',
    videoVisible: false,
    vedioUri: null,
    uploadProgress: 0,
    vedioUploading: false,
    isLoading: false,
    poojaData: route?.params?.poojaData,
  });

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
      selectionLimit: 10,
    }; // Add any camera options you need

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image library');
      } else if (response.errorCode) {
        console.log(response.errorCode, response.errorMessage, 'asdfghjk');
      } else {
        updateState({imageData: response.assets});
      }
    });
  };

  const openVedioLibrary = () => {
    const options = {
      mediaType: 'video',
      includeBase64: false,
      quality: 1,
      selectionLimit: 10,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image library');
      } else if (response.errorCode) {
        console.log(response.errorCode, response.errorMessage, 'asdfghjk');
      } else {
        updateState({vedioData: response.assets});
      }
    });
  };

  const validation = () => {
    if (imageData == null) {
      showToastWithGravityAndOffset('Please select images.');
      return false;
    } else if (vedioData == null) {
      showToastWithGravityAndOffset('Please select vedios.');
      return false;
    } else if (description.length == 0) {
      showToastWithGravityAndOffset('Please enter description.');
      return false;
    } else {
      return true;
    }
  };

  const upload_vedio = async fileUri => {
    try {
      updateState({vedioUploading: true});
      const data = [
        {
          name: 'video_file',
          filename: 'file.mp4',
          type: 'video/mp4',
          data: RNFetchBlob.wrap(fileUri),
        },
        {
          name: 'pooja_book_id',
          data: poojaData?.id,
        },
        // Add more fields as needed for your API
      ];

      // Create the request
      await RNFetchBlob.fetch(
        'POST',
        api_url + pooja_upload_attachments_video,
        {
          'Content-Type': 'multipart/form-data',
        },
        data,
      )
        .uploadProgress((written, total) => {
          const progress = written / total;
          updateState({uploadProgress: progress});
        })
        .then(response => {
          updateState({vedioUploading: false});
          if (response.info().status === 200) {
            updateState({uploadProgress: 1});
            console.log('Upload successful');
          } else {
            console.error('Upload failed');
            showToastWithGravityAndOffset('Vedio Uploading Failed!');
          }
        })
        .catch(error => {
          updateState({vedioUploading: false});
          console.error('Error during upload:', error);
        });
    } catch (error) {
      updateState({vedioUploading: false});
      console.error('Error during upload:', error);
    }
  };

  const upload_image_description = async () => {
    updateState({isLoading: true});
    let data = new FormData();
    data.append('desc', description);
    data.append('pooja_book_id', poojaData?.id);

    imageData.map((item, index) => {
      data.append(`image_files[${index}]`, {
        uri: item?.uri,
        name: item?.fileName,
        type: 'image/jpg',
      });
    });

    await axios({
      method: 'post',
      url: api_url + pooja_upload_attachments,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(res => {
        console.log(res.data);
        updateState({isLoading: false});
        showToastWithGravityAndOffset('Successfully uploaded!');
        home();
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const handleUploadVedio = async () => {
    if (validation()) {
      for (let i = 0; i < vedioData.length; i++) {
        await upload_vedio(vedioData[i].uri);
      }

      await upload_image_description();
    }
  };

  const home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'home',
          },
        ],
      }),
    );
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    imageData,
    vedioData,
    videoVisible,
    vedioUri,
    uploadProgress,
    vedioUploading,
    isLoading,
    description,
    poojaData,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {vedioUploading && vedioUploadProgress()}
              {topMessageInfo()}
              {imageUploadInfo()}
              {vedioUploadInfo()}
              {discriptionInfo()}
            </>
          }
        />
      </View>
      {continueButtonInfo()}
      {vedioPlayerInfo()}
    </View>
  );

  function vedioPlayerInfo() {
    return (
      <VedioPlayer
        videoVisible={videoVisible}
        updateState={updateState}
        uri={vedioUri}
      />
    );
  }

  function continueButtonInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleUploadVedio()}
        // onPress={() => navigation.navigate('poojaHistory')}
        style={{
          marginHorizontal: Sizes.fixPadding * 3,
          marginVertical: Sizes.fixPadding,
          borderRadius: 1000,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primaryDark]}
          style={{paddingVertical: Sizes.fixPadding}}>
          <Text style={{...Fonts.white16RobotoMedium, textAlign: 'center'}}>
            Submit
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function discriptionInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2}}>
        <Text style={{...Fonts.black16RobotoMedium}}>Description</Text>
        <TextInput
          placeholder="Enter here..."
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({description: text})}
          multiline
          style={[
            styles.input,
            {
              height: SCREEN_HEIGHT * 0.18,
              textAlignVertical: 'top',
              marginBottom: Sizes.fixPadding * 2,
            },
          ]}
        />
      </View>
    );
  }

  function vedioUploadInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2.5}}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
          }}>
          Attachment (Add Videos)
        </Text>
        <View
          style={[
            styles.row,
            {
              marginBottom: Sizes.fixPadding * 2,
              alignItems: 'flex-start',
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openVedioLibrary()}
            style={{
              width: SCREEN_WIDTH * 0.3,
              height: SCREEN_WIDTH * 0.3,
              ...styles.center,
              backgroundColor: Colors.white,
              borderRadius: Sizes.fixPadding,
              elevation: 5,
              shadowColor: Colors.gray,
              marginTop: Sizes.fixPadding,
            }}>
            <AntDesign name="plus" color={Colors.gray} size={50} />
          </TouchableOpacity>
          <View
            style={[
              styles.row,
              {
                marginLeft: Sizes.fixPadding,
                flexWrap: 'wrap',
                width: SCREEN_WIDTH * 0.6,
              },
            ]}>
            {vedioData &&
              vedioData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    updateState({vedioUri: item.uri, videoVisible: true})
                  }
                  style={{
                    width: SCREEN_WIDTH * 0.15,
                    height: SCREEN_WIDTH * 0.15,
                    marginRight: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding,
                  }}>
                  <Image
                    source={{uri: item.uri}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    );
  }

  function imageUploadInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2.5}}>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
          }}>
          Attachment (Add Photos)
        </Text>
        <View
          style={[
            styles.row,
            {
              marginBottom: Sizes.fixPadding * 2,
              alignItems: 'flex-start',
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openImageLibrary()}
            style={{
              width: SCREEN_WIDTH * 0.3,
              height: SCREEN_WIDTH * 0.3,
              ...styles.center,
              backgroundColor: Colors.white,
              borderRadius: Sizes.fixPadding,
              elevation: 5,
              shadowColor: Colors.gray,
              marginTop: Sizes.fixPadding,
            }}>
            <AntDesign name="plus" color={Colors.gray} size={50} />
          </TouchableOpacity>
          <View
            style={[
              styles.row,
              {
                marginLeft: Sizes.fixPadding,
                flexWrap: 'wrap',
                width: SCREEN_WIDTH * 0.6,
              },
            ]}>
            {imageData &&
              imageData.map((item, index) => (
                <Image
                  key={index}
                  source={{uri: item.uri}}
                  style={{
                    width: SCREEN_WIDTH * 0.15,
                    height: SCREEN_WIDTH * 0.15,
                    marginRight: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding,
                  }}
                />
              ))}
          </View>
        </View>
      </View>
    );
  }

  function topMessageInfo() {
    return (
      <View style={{margin: Sizes.fixPadding * 2}}>
        <Text
          style={{
            ...Fonts.primaryDark18RobotoMedium,
            textAlign: 'center',
          }}>
          Upload a Photos and Videos for Pooja
        </Text>
      </View>
    );
  }

  function vedioUploadProgress() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: Sizes.fixPadding,
        }}>
        <Progress.Bar progress={uploadProgress} width={SCREEN_WIDTH * 0.9} />
        {/* <Text
          style={{...Fonts.black14InterMedium, marginTop: Sizes.fixPadding}}>
          1/2
        </Text> */}
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Schedule a Pooja'} />;
  }
};

export default UploadEcommerce;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    elevation: 8,
    marginTop: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    shadowColor: Colors.gray,
  },
});
