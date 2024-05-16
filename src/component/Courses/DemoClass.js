import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {SCREEN_WIDTH} from '../../config/Screen';
import * as ImagePicker from 'react-native-image-picker';
import {Image} from 'react-native';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import RNFetchBlob from 'rn-fetch-blob';
import {api_url, demo_class} from '../../config/Constants';
import moment from 'moment';
import * as Progress from 'react-native-progress';

const DemoClass = ({navigation, providerData, courseId}) => {
  const [state, setState] = useState({
    courseName: '',
    description: '',
    learnList: [
      {id: 1, value: ''},
      {id: 2, value: ''},
    ],
    courseContent: '',
    photos: null,
    vedios: null,
    allMedia: null,
    scheduleDate: null,
    scheduleTime: null,
    session: '',
    uploadProgress: 0,
    uploading: false,
  });

  const learn_list_validation = () => {
    for (const ele of learnList) {
      if (ele.value.length == 0) {
        return true;
      }
    }
    return false;
  };

  const validation = () => {
    if (courseName.length == 0) {
      showToastWithGravityAndOffset('Please enter course name.');
      return false;
    } else if (description.length == 0) {
      showToastWithGravityAndOffset('Please enter course description.');
      return false;
    } else if (learn_list_validation()) {
      showToastWithGravityAndOffset('Please fill all fields in learning.');
      return false;
    } else if (courseContent.length == 0) {
      showToastWithGravityAndOffset('Please enter your course content.');
      return false;
    } else if (vedios == null) {
      showToastWithGravityAndOffset('Please select a video.');
      return false;
    } else if (photos == null) {
      showToastWithGravityAndOffset('Please select a photo.');
      return false;
    } else if (scheduleDate == null) {
      showToastWithGravityAndOffset('Please select schedule data.');
      return false;
    } else if (scheduleTime == null) {
      showToastWithGravityAndOffset('Please select schedule time.');
      return false;
    } else if (session.length == 0) {
      showToastWithGravityAndOffset('Please enter session duration.');
      return false;
    } else {
      return true;
    }
  };

  const on_submite = async () => {
    if (validation()) {
      updateDemoState({uploading: true});
      let data = [
        {
          name: 'astro_id',
          data: providerData?.id,
        },
        {
          name: 'course_id',
          data: courseId,
        },
        {
          name: 'course_name',
          data: courseName,
        },
        {
          name: 'course_content',
          data: courseContent,
        },
        {
          name: 'description',
          data: description,
        },
        {
          name: 'demo_start_date',
          data: moment(scheduleDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          name: 'demo_start_time',
          data: moment(scheduleTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          name: 'student_course',
          data: JSON.stringify(learnList),
        },
        {
          name: 'type',
          data: 'demo',
        },
      ];
      if (photos != null) {
        photos.map((item, index) => {
          data.push({
            name: `image[${index}]`,
            data: RNFetchBlob.wrap(item?.uri),
            filename: item?.fileName,
            type: 'image/jpg',
          });
        });
      }
      if (vedios != null) {
        vedios.map((item, index) => {
          data.push({
            name: `video_file[${index}]`,
            data: RNFetchBlob.wrap(item?.uri),
            filename: item?.fileName,
            type: 'video/mp4',
          });
        });
      }

      await RNFetchBlob.fetch(
        'POST',
        api_url + demo_class,
        {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        data,
      )
        .uploadProgress((written, total) => {
          const progress = written / total;
          updateDemoState({uploadProgress: progress});
        })
        .then(response => {
          console.log(response.data);
          console.log('info', response.info());
          console.log('json', response.json());
          console.log('stream', response.readStream());

          updateDemoState({uploading: false});
          if (response.info().status === 200) {
            updateDemoState({uploadProgress: 1});
            showToastWithGravityAndOffset('Successfull created.');
            // navigation.goBack();
          } else {
            console.error('Upload failed');
            showToastWithGravityAndOffset('Vedio Uploading Failed!');
          }
        })
        .catch(error => {
          updateDemoState({uploading: false});
          console.error('Error during upload:', error);
        });
    }
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'mixed',
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
        let length = response.assets.length;
        let images = [];
        let vedios = [];
        for (let i = 0; i < length; i++) {
          if (response.assets[i].type.includes('image')) {
            images.push(response.assets[i]);
          } else {
            vedios.push(response.assets[i]);
          }
        }
        if (images.length == 0) {
          images = null;
        }
        if (vedios.length == 0) {
          vedios = null;
        }
        updateDemoState({
          photos: images,
          vedios: vedios,
          allMedia: response.assets,
        });
        // updateState({imageData: response.assets});
      }
    });
  };

  const open_date_picker = () => {
    DateTimePickerAndroid.open({
      value: scheduleDate == null ? new Date() : scheduleDate,
      onChange: (event, date) => {
        if (event.type == 'set') {
          updateDemoState({scheduleDate: date});
        }
      },
      minimumDate: new Date(),
      mode: 'date',
      display: 'calendar',
    });
  };

  const open_time_picker = () => {
    DateTimePickerAndroid.open({
      value: scheduleTime == null ? new Date() : scheduleTime,
      onChange: (event, time) => {
        if (event.type == 'set') {
          updateDemoState({scheduleTime: time});
        }
      },
      mode: 'time',
      display: 'clock',
      is24Hour: false,
    });
  };

  const updateDemoState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    courseName,
    description,
    learnList,
    courseContent,
    photos,
    vedios,
    scheduleDate,
    scheduleTime,
    allMedia,
    session,
    uploading,
    uploadProgress,
  } = state;

  return (
    <>
      {renderForm1()}
      {uploading && vedioUploadProgress()}
      {submitButton()}
    </>
  );

  function renderForm1() {
    return (
      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <View style={styles.formcontainer}>
          <Text style={[Fonts.black14InterMedium]}>Course Name</Text>
          <TextInput
            value={courseName}
            placeholder="Enter Course Name"
            placeholderTextColor={Colors.grayDark}
            onChangeText={text => updateDemoState({courseName: text})}
            style={styles.inputbox}
          />
          <Text style={[Fonts.black14InterMedium]}>Description</Text>
          <TextInput
            value={description}
            multiline
            placeholder="Enter Description"
            placeholderTextColor={Colors.grayDark}
            onChangeText={text => updateDemoState({description: text})}
            style={styles.inputboxmultiline}
          />
          <Text style={[Fonts.black14InterMedium]}>
            What will Students learn from this Course
          </Text>
          {learnList.map((item, index) => (
            <View
              key={index}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.gray16RobotoMedium, {width: '10%'}]}>
                {index + 1}-
              </Text>
              <TextInput
                placeholder="Enter Course Name"
                placeholderTextColor={Colors.grayDark}
                onChangeText={text => {
                  updateDemoState({
                    learnList: learnList.map(data => {
                      if (data.id == item.id) {
                        return {...data, value: text};
                      } else {
                        return data;
                      }
                    }),
                  });
                }}
                style={[styles.inputbox, {width: '90%'}]}>
                {item.value}
              </TextInput>
            </View>
          ))}

          <View
            style={{
              marginVertical: 10,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                updateDemoState({
                  learnList: [
                    ...learnList,
                    {id: learnList.length + 1, value: ''},
                  ],
                })
              }
              style={{
                backgroundColor: Colors.primaryDark,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                height: SCREEN_WIDTH * 0.08,
                paddingHorizontal: 15,
              }}>
              <Text style={Fonts.white16RobotoMedium}>Add more +</Text>
            </TouchableOpacity>
          </View>

          <Text style={[Fonts.black14InterMedium]}>Course Content</Text>
          <TextInput
            value={courseContent}
            multiline
            placeholder="Course Content"
            placeholderTextColor={Colors.grayDark}
            onChangeText={text => updateDemoState({courseContent: text})}
            style={styles.inputboxmultiline}
          />
          <Text style={[Fonts.black14InterMedium, {marginBottom: 10}]}>
            Attachment (Add Photos/Videos)
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openImageLibrary()}
              style={{
                backgroundColor: Colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                borderRadius: 20,
                height: SCREEN_WIDTH * 0.3,
                elevation: 2,
                marginBottom: 10,
              }}>
              <Ionicons name={'add'} size={40} color={Colors.gray2} />
            </TouchableOpacity>
            <View
              style={[
                {
                  flexDirection: 'row',
                  marginLeft: Sizes.fixPadding,
                  flexWrap: 'wrap',
                  width: '60%',
                },
              ]}>
              {allMedia &&
                allMedia.map((item, index) => (
                  <Image
                    key={index}
                    source={{uri: item.uri}}
                    style={{
                      width: SCREEN_WIDTH * 0.12,
                      height: SCREEN_WIDTH * 0.12,
                      marginRight: Sizes.fixPadding,
                      marginBottom: Sizes.fixPadding,
                    }}
                  />
                ))}
            </View>
          </View>
          <Text style={[Fonts.black14InterMedium]}>Live Schedule</Text>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.inputbox3}
              onPress={() => open_date_picker()}>
              <Text style={{...Fonts.black14RobotoRegular}}>
                {scheduleDate == null
                  ? 'Select Date'
                  : moment(scheduleDate).format('Do MMM YYYY')}
              </Text>
              <Ionicons name={'chevron-down'} size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inputbox3}
              onPress={() => open_time_picker()}>
              <Text style={{...Fonts.black14RobotoRegular}}>
                {scheduleTime == null
                  ? 'Select Time'
                  : moment(scheduleTime).format('hh:mm A')}
              </Text>
              <Ionicons name={'chevron-down'} size={15} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={[Fonts.black14InterMedium, {width: '45%'}]}>
              {' '}
              Time Session
            </Text>
            <View
              style={[
                styles.inputbox3,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <TextInput
                inputMode="numeric"
                placeholder="30 - 40 min"
                placeholderTextColor={Colors.grayDark}
                onChangeText={text => updateDemoState({session: text})}
                style={{width: '100%', ...Fonts.black14RobotoRegular}}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function submitButton() {
    return (
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 20,
          marginTop: 10,
          alignItems: 'center',
          width: SCREEN_WIDTH * 0.9,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={uploading}
          onPress={on_submite}
          style={{
            backgroundColor: Colors.primaryDark,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            height: SCREEN_WIDTH * 0.15,
            width: '100%',
            paddingHorizontal: 15,
          }}>
          <Text style={Fonts.white16RobotoMedium}>Submit</Text>
        </TouchableOpacity>
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
      </View>
    );
  }
};

export default DemoClass;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: SCREEN_WIDTH * 0.05,
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    borderRadius: SCREEN_WIDTH * 0.04,
    elevation: 3,
    width: '48%',
    height: SCREEN_WIDTH * 0.25,
  },
  formcontainer: {
    backgroundColor: Colors.whiteDark,
    width: '100%',
    paddingHorizontal: 15,
    elevation: 5,
    paddingVertical: 15,
    borderRadius: 10,
  },
  inputbox: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    elevation: 5,
    height: SCREEN_WIDTH * 0.14,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
    ...Fonts.black14RobotoRegular,
  },
  inputbox2: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    elevation: 5,
    height: SCREEN_WIDTH * 0.14,
    width: SCREEN_WIDTH * 0.85,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputbox3: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    elevation: 5,
    height: SCREEN_WIDTH * 0.14,
    width: '45%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputboxmultiline: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    elevation: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    width: '100%',
    height: 150,
    ...Fonts.black14RobotoRegular,
  },
});
