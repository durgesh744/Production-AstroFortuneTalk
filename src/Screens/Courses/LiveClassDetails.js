import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import MyHeader from '../../component/MyHeader';
import {Colors, Fonts, Sizes} from '../../assets/style';
const {width, height} = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from 'react-native';
import {SCREEN_WIDTH} from '../../config/Screen';
import Video from '../../component/Courses/Video';
import {
  api_url,
  base_url,
  complete_course_live_islive,
} from '../../config/Constants';
import moment from 'moment';
import {connect} from 'react-redux';
import {MyMethods} from '../../methods/MyMethods';
import Loader from '../../component/Loader';
import {ApiRequests} from '../../config/requests';

const LiveClassDetails = ({navigation, route, providerData}) => {
  const [classData] = useState(route?.params?.classData);
  const [isLoading, setIsLoading] = useState(false);

  const go_to_live = async item => {
    try {
      setIsLoading(true);
      console.log({
        id: item?.id,
        live_class_id: item?.live_class_id,
      });
      const response = await ApiRequests.postRequest({
        url: api_url + complete_course_live_islive,
        data: {
          id: item?.id,
          live_class_id: item?.live_class_id,
        },
      });

      console.log(response);

      if (response.status == '200') {
        navigation.navigate('liveClass', {
          liveID: classData?.unique_id,
          userID: providerData?.id,
          userName: providerData?.owner_name,
          courseID: item?.live_class_id,
          classID: item?.id,
          type: 'live',
        });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title={'Live Class'} navigation={navigation} />
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <FlatList
          ListHeaderComponent={
            <>
              {videoThumbnail()}
              {courseDetails()}
              {classesList()}
              {uploadPdf()}
              {downloadPdf()}
            </>
          }
        />
      </View>
    </View>
  );

  function videoThumbnail() {
    return <Video uri={base_url + classData?.video[0]?.video} />;
  }

  function courseDetails() {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View activeOpacity={0.9} style={styles.container}>
          <View style={styles.subContainer}>
            <Text
              style={[
                {...Fonts.primaryDark16RobotoMedium},
                {lineHeight: 25, textAlign: 'justify'},
              ]}>
              {classData?.course_name}
            </Text>
            <Text
              style={[
                Fonts.gray14RobotoRegular,
                {marginTop: 2, lineHeight: 20, textAlign: 'justify'},
              ]}>
              {classData?.description}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function classesList() {
    const renderItem = ({item, index}) => {
      const isToday = MyMethods.check_current_day({date: item.start_date});
      return (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.grayLight,
          }}>
          <View activeOpacity={0.9} style={styles.container}>
            <View style={styles.subContainer}>
              {item.status == '1' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.7,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={[{...Fonts.primaryDark16RobotoMedium}]}>
                      Class {index + 1}
                    </Text>
                    <Text style={[Fonts.gray12RobotoMedium, {marginLeft: 10}]}>
                      {item.time_session_duration} min
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        {...Fonts.gray14RobotoMedium},
                        {lineHeight: 25, marginRight: 5, textAlign: 'right'},
                      ]}>
                      Completed
                    </Text>
                    <Ionicons name="checkmark-circle-sharp" size={15} />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.7,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={[{...Fonts.primaryDark16RobotoMedium}]}>
                      Class {index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <Text style={[Fonts.gray12RobotoMedium, {marginLeft: 10}]}>
                      {item.time_session_duration} min
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flex: 0.7}}>
                  <Text
                    style={[
                      {...Fonts.gray16RobotoMedium},
                      {lineHeight: 25, textAlign: 'justify'},
                    ]}>
                    {item.class_name}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  Fonts.gray14RobotoRegular,
                  {marginTop: 2, lineHeight: 20, textAlign: 'justify'},
                ]}>
                {item?.description}
              </Text>
            </View>
            {item.status != '1' && (
              <View style={styles.subContainer}>
                {isToday ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 0.6}}>
                      <Text style={[{...Fonts.primaryDark16RobotoMedium}]}>
                        Join class by{' '}
                        {moment(item?.start_time).format('hh:mm A')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.4,
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={() => go_to_live(item)}
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          paddingVertical: width * 0.03,
                          borderRadius: width * 0.1,
                          backgroundColor: Colors.primaryDark,
                        }}>
                        <Text style={Fonts.white14RobotoMedium}>Go Live</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        {...Fonts.primaryLight15RobotoMedium},
                        {color: Colors.red, marginTop: 10},
                      ]}>
                      Next Session at{' '}
                      {moment(item?.start_date).format('Do MMM YYYY')},{' '}
                      {moment(item?.start_time).format('hh:mm A')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      );
    };
    return (
      <FlatList
        data={classData?.course_live_tbl}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 15}}
      />
    );
  }

  function uploadPdf() {
    return (
      <View
        style={{
          marginBottom: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          style={{
            width: '47%',
            alignItems: 'center',
            paddingVertical: width * 0.04,
            marginVertical: 10,
            borderRadius: width * 0.05,
            backgroundColor: Colors.grayLight,

            elevation: 3,
          }}>
          <Image source={require('../../assets/icon/pdf.png')} />
          <Text
            style={[
              Fonts.gray16RobotoMedium,
              {textAlign: 'center', marginTop: 10},
            ]}>
            Upload{'\n'}Question Paper
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '47%',
            alignItems: 'center',
            paddingVertical: width * 0.04,
            marginVertical: 10,
            borderRadius: width * 0.05,
            backgroundColor: Colors.grayLight,

            elevation: 3,
          }}>
          <Image source={require('../../assets/icon/pdf.png')} />
          <Text
            style={[
              Fonts.gray16RobotoMedium,
              {textAlign: 'center', marginTop: 10},
            ]}>
            Upload{'\n'}MarkSheet
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function downloadPdf() {
    return (
      <View
        style={{marginBottom: 10, paddingHorizontal: 20, paddingVertical: 5}}>
        <Text style={[{...Fonts.gray16RobotoMedium}, {marginBottom: 10}]}>
          {' '}
          Received Test PDF from Students
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              width: '47%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: width * 0.05,
              marginVertical: 10,
              paddingHorizontal: width * 0.04,
              borderRadius: width * 0.05,
              backgroundColor: Colors.grayLight,
              elevation: 3,
            }}>
            <Text
              numberOfLines={1}
              style={[Fonts.gray16RobotoMedium, {textAlign: 'center'}]}>
              Suresh Singh
            </Text>
            <Image source={require('../../assets/icon/downloadblue.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '47%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: width * 0.05,
              marginVertical: 10,
              paddingHorizontal: width * 0.04,
              borderRadius: width * 0.05,
              backgroundColor: Colors.grayLight,
              elevation: 3,
            }}>
            <Text
              numberOfLines={1}
              style={[Fonts.gray16RobotoMedium, {textAlign: 'center'}]}>
              Suresh Singh
            </Text>
            <Image source={require('../../assets/icon/downloadblue.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(LiveClassDetails);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: width * 0.05,
    marginTop: 10,
  },
  subContainer: {
    borderRadius: 20,
    borderRadius: width * 0.04,
  },
  statusContainer: {
    borderRadius: 20,
    backgroundColor: Colors.primaryDark,
    borderRadius: width * 0.04,
    elevation: 3,
    paddingBottom: SCREEN_WIDTH * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    position: 'absolute',
    height: width * 0.2,
    zIndex: -1,
    bottom: -width * 0.1,
    right: 0,
  },
  statusTextBox: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
