import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCREEN_WIDTH} from '../../config/Screen';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {Image} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import axios from 'axios';
import {
  api_url,
  live_class,
  live_class_according_id,
} from '../../config/Constants';
import RNFetchBlob from 'rn-fetch-blob';

const LiveClassForm = ({updateState, providerData, courseId, navigation}) => {
  const [state, setState] = useState({
    courseName: '',
    description: '',
    courseContent: '',
    batchStartDate: null,
    batchStartTime: null,
    coursePrice: '',
    allMedia: null,
    photos: null,
    videos: null,
    uploading: false,
    classData: [
      {
        id: 1,
        className: '',
        classDescription: '',
        liveDate: null,
        liveTime: null,
        liveSession: '',
      },
    ],
  });

  const course_validation = () => {
    for (const ele of classData) {
      if (ele.className.length == 0) {
        showToastWithGravityAndOffset('Please enter class name.');
        return false;
      } else if (ele.classDescription.length == 0) {
        showToastWithGravityAndOffset('Please enter class description.');
        return false;
      } else if (ele.liveDate == null) {
        showToastWithGravityAndOffset('Please select live date.');
        return false;
      } else if (ele.liveTime == null) {
        showToastWithGravityAndOffset('Please select live time.');
        return false;
      } else if (ele.liveSession.length == 0) {
        showToastWithGravityAndOffset('Please enter session time.');
        return false;
      } else {
      }
    }
    return true;
  };

  const validation = () => {
    if (courseName.length == 0) {
      showToastWithGravityAndOffset('Please enter course name.');
      return false;
    } else if (description.length == 0) {
      showToastWithGravityAndOffset('Please enter class course description.');
      return false;
    } else if (courseContent.length == 0) {
      showToastWithGravityAndOffset('Please enter course content.');
      return false;
    } else if (batchStartDate == null) {
      showToastWithGravityAndOffset('Please select batch start date.');
      return false;
    } else if (batchStartTime == null) {
      showToastWithGravityAndOffset('Please select batch start time.');
      return false;
    } else if (coursePrice.length == 0) {
      showToastWithGravityAndOffset('Please enter course price.');
      return false;
    } else if (photos == null) {
      showToastWithGravityAndOffset('Please select a photos.');
      return false;
    } else if (videos == null) {
      showToastWithGravityAndOffset('Please select a video.');
      return false;
    } else if (!course_validation()) {
      return false;
    } else {
      return true;
    }
  };

  const upload_courses = async () => {
    try {
      if (validation()) {
        updateLiveState({uploading: true});
        updateState({uploading: true});
        let data = [
          {
            name: 'astro_id',
            data: providerData?.id.toString(),
          },
          {
            name: 'courseName',
            data: courseName,
          },
          {
            name: 'courseContent',
            data: courseContent,
          },
          {
            name: 'description',
            data: description,
          },
          {
            name: 'batchStartDate',
            data: moment(batchStartDate).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            name: 'batchStartTime',
            data: moment(batchStartTime).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            name: 'coursePrice',
            data: coursePrice,
          },
          {
            name: 'type',
            data: 'live',
          },
          {
            name: 'course_id',
            data: courseId.toString(),
          },
          {
            name: 'request',
            data: JSON.stringify(classData),
          },
        ];

        if (photos) {
          photos.map((item, index) => {
            data.push({
              name: `image[${index}]`,
              data: RNFetchBlob.wrap(item?.uri),
              filename: item?.fileName,
              type: 'image/jpg',
            });
          });
        }

        if (videos) {
          videos.map((item, index) => {
            data.push({
              name: `video[${index}]`,
              data: RNFetchBlob.wrap(item?.uri),
              filename: item?.fileName,
              type: 'video/mp4',
            });
          });
        }

        await RNFetchBlob.fetch(
          'POST',
          api_url + live_class,
          {'Content-Type': 'multipart/form-data'},
          data,
        )
          .uploadProgress((written, total) => {
            const progress = written / total;
            updateLiveState({uploadProgress: progress});
          })
          .then(response => {
            if (response.info().status === 200) {
              updateLiveState({uploadProgress: 1});
              showToastWithGravityAndOffset('Successfull created.');
            } else {
              console.error('Upload failed');
              showToastWithGravityAndOffset('Vedio Uploading Failed!');
            }
          })
          .catch(error => {
            console.error('Error during upload:', error);
          });
        updateLiveState({uploading: false});
        updateState({uploading: false});
        navigation.goBack();
      }
    } catch (e) {
      updateLiveState({uploading: false});
      updateState({uploading: false});
      console.log(e);
    }
  };

  const updateLiveState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    description,
    liveSession,
    className,
    classDescription,
    courseName,
    classData,
    courseContent,
    coursePrice,
    photos,
    videos,
    allMedia,
    batchStartDate,
    batchStartTime,
    uploading,
  } = state;

  return (
    <>
      {courseFormInfo()}
      {renderForm2()}
      {addButton()}
      {submitButton()}
    </>
  );

  function courseFormInfo() {
    const open_date_picker = () => {
      DateTimePickerAndroid.open({
        value: batchStartDate == null ? new Date() : new Date(batchStartDate),
        onChange: (event, date) => {
          if (event.type == 'set') {
            updateLiveState({batchStartDate: date});
          }
        },
        minimumDate: new Date(),
        mode: 'date',
        display: 'calendar',
      });
    };

    const open_time_picker = () => {
      DateTimePickerAndroid.open({
        value: batchStartTime == null ? new Date() : new Date(batchStartTime),
        onChange: (event, time) => {
          if (event.type == 'set') {
            updateLiveState({batchStartTime: time});
          }
        },
        mode: 'time',
        display: 'clock',
        is24Hour: false
      });
    };

    const openImageLibrary = item => {
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

          updateLiveState({
            photos: images,
            videos: vedios,
            allMedia: response.assets,
          });
        }
      });
    };

    return (
      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <View style={styles.formcontainer}>
          <Text style={[Fonts.black14InterMedium]}>Course Name</Text>
          <TextInput
            placeholder="Enter Course Name"
            placeholderTextColor={Colors.grayDark}
            onChangeText={text => updateLiveState({courseName: text})}
            style={styles.inputbox}>
            {courseName}
          </TextInput>
          <Text style={[Fonts.black14InterMedium]}>Description</Text>
          <TextInput
            multiline
            placeholder="Enter Description"
            placeholderTextColor={Colors.grayDark}
            onChangeText={text => updateLiveState({description: text})}
            style={styles.inputboxmultiline}>
            {description}
          </TextInput>
          <Text style={[Fonts.black14InterMedium]}>Course Content</Text>
          <TextInput
            multiline
            placeholder="Course Content"
            placeholderTextColor={Colors.grayDark}
            onChangeText={text => updateLiveState({courseContent: text})}
            style={styles.inputboxmultiline}>
            {courseContent}
          </TextInput>
          <Text style={[Fonts.black14InterMedium]}>Batch Start From</Text>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.inputbox3}
              onPress={() => open_date_picker()}>
              <Text style={{...Fonts.black14RobotoRegular}}>
                {batchStartDate == null
                  ? 'Select Date'
                  : moment(batchStartDate).format('Do MMM YYYY')}
              </Text>
              <Ionicons name={'chevron-down'} size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inputbox3}
              onPress={() => open_time_picker()}>
              <Text style={{...Fonts.black14RobotoRegular}}>
                {batchStartTime == null
                  ? 'Select Time'
                  : moment(batchStartTime).format('hh:mm A')}
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
              Price of Course
            </Text>
            <View
              style={[
                styles.inputbox3,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <MaterialIcons name={'currency-rupee'} size={20} />
              <View
                style={{
                  width: 1,
                  backgroundColor: Colors.gray3,
                  height: '50%',
                  marginHorizontal: 10,
                }}
              />
              <TextInput
                inputMode="numeric"
                placeholder="Amount"
                placeholderTextColor={Colors.grayDark}
                onChangeText={text => updateLiveState({coursePrice: text})}
                style={{width: '60%', ...Fonts.black14RobotoRegular}}>
                {coursePrice}
              </TextInput>
            </View>
          </View>
          <Text style={[Fonts.black14InterMedium, {marginVertical: 10}]}>
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
                allMedia.map((asset, index) => (
                  <Image
                    key={index}
                    source={{uri: asset.uri}}
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
        </View>
      </View>
    );
  }

  function addButton() {
    return (
      <View
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={Fonts.primaryDark18RobotoMedium}>Schedule Live Class</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            let new_arr = classData;
            new_arr.push({
              id: classData.length + 1,
              className: '',
              classDescription: '',
              liveDate: null,
              liveTime: null,
              liveSession: '',
            });
            updateLiveState({
              classData: new_arr,
            });
          }}
          style={{
            backgroundColor: Colors.primaryDark,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            height: SCREEN_WIDTH * 0.1,
            paddingHorizontal: 15,
          }}>
          <Text style={Fonts.white16RobotoMedium}>Add more +</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderForm2() {
    const editClassName = (item, text) => {
      updateLiveState({
        classData: classData.map(e => {
          if (e.id == item.id) {
            return {...e, className: text};
          }
          return e;
        }),
      });
    };

    const editClassDescription = (item, text) => {
      updateLiveState({
        classData: classData.map(e => {
          if (e.id == item.id) {
            return {...e, classDescription: text};
          }
          return e;
        }),
      });
    };

    const editClassdate = (item, date) => {
      updateLiveState({
        classData: classData.map(e => {
          if (e.id == item.id) {
            return {...e, liveDate: moment(date).format('YYYY-MM-DD HH:mm:ss')};
          }
          return e;
        }),
      });
    };

    const editClasstime = (item, time) => {
      updateLiveState({
        classData: classData.map(e => {
          if (e.id == item.id) {
            return {...e, liveTime: moment(time).format('YYYY-MM-DD HH:mm:ss')};
          }
          return e;
        }),
      });
    };

    const editClassSession = (item, text) => {
      updateLiveState({
        classData: classData.map(e => {
          if (e.id == item.id) {
            return {...e, liveSession: text};
          }
          return e;
        }),
      });
    };

    const open_date_picker = item => {
      DateTimePickerAndroid.open({
        value: item?.liveDate == null ? new Date() : new Date(item?.liveDate),
        onChange: (event, date) => {
          if (event.type == 'set') {
            editClassdate(item, date);
          }
        },
        minimumDate: new Date(),
        mode: 'date',
        display: 'calendar',
      });
    };

    const open_time_picker = item => {
      DateTimePickerAndroid.open({
        value: item?.liveTime == null ? new Date() : new Date(item?.liveTime),
        onChange: (event, time) => {
          if (event.type == 'set') {
            editClasstime(item, time);
          }
        },
        mode: 'time',
        display: 'clock',
        is24Hour: false
      });
    };

    const renderItem = ({item, index}) => {
      return (
        <View style={{marginHorizontal: 20, marginVertical: 10}}>
          <View style={styles.formcontainer}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={[Fonts.primaryDark18RobotoMedium]}>
                Class {index + 1}
              </Text>
              <Ionicons
                name={'chevron-down'}
                size={20}
                color={Colors.primaryDark}
              />
            </View>
            <TextInput
              value={item?.className}
              placeholder="Enter Course Name"
              placeholderTextColor={Colors.grayDark}
              onChangeText={text => editClassName(item, text)}
              style={styles.inputbox}
            />
            <TextInput
              multiline
              placeholder="Enter Description"
              placeholderTextColor={Colors.grayDark}
              onChangeText={text => editClassDescription(item, text)}
              style={styles.inputboxmultiline}
            />
            <Text style={[Fonts.black14InterMedium]}>Live Schedule</Text>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => open_date_picker(item)}
                style={styles.inputbox3}>
                <Text>
                  {item?.liveDate == null
                    ? 'Date'
                    : moment(item?.liveDate).format('Do MMM YYYY')}
                </Text>
                <Ionicons name={'chevron-down'} size={15} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => open_time_picker(item)}
                style={styles.inputbox3}>
                <Text>
                  {item?.liveTime == null
                    ? 'Time'
                    : moment(item?.liveTime).format('hh:mm A')}
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
                  onChangeText={text => editClassSession(item, text)}
                  style={{width: '100%', ...Fonts.black14RobotoRegular}}
                />
              </View>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View>
        <FlatList data={classData} renderItem={renderItem} />
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
          onPress={upload_courses}
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
};

export default LiveClassForm;

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
    ...Fonts.black14RobotoRegular
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
    height: 150,
    textAlignVertical: 'top',
    width: '100%',
    ...Fonts.black14RobotoRegular
  },
});
