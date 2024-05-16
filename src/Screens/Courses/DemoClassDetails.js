import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import MyHeader from '../../component/MyHeader';
import {Colors, Fonts, Sizes} from '../../assets/style';
const {width, height} = Dimensions.get('screen');
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Video from '../../component/Courses/Video';
import {
  api_url,
  base_url,
  complete_course_demo_islive,
} from '../../config/Constants';
import {connect} from 'react-redux';
import {ApiRequests} from '../../config/requests';
import Loader from '../../component/Loader';

const DemoClassDetails = ({navigation, route, providerData}) => {
  const [classData] = useState(route?.params?.classData);
  const [isLoading, setIsLoading] = useState(false);

  const go_to_live = async () => {
    try {
      setIsLoading(true);
      const response = await ApiRequests.postRequest({
        url: api_url + complete_course_demo_islive,
        data: {
          id: classData?.id,
        },
      });

      if (response.status == '200') {
        navigation.navigate('liveClass', {
          liveID: classData?.unique_id,
          userID: providerData?.id,
          userName: providerData?.owner_name,
          demoID: classData?.id,
          type: 'demo',
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
      <MyHeader title={'Demo Class Details'} navigation={navigation} />
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <FlatList
          ListHeaderComponent={
            <>
              {videoThumbnail()}
              {courseDetails()}
              {joinButton()}
              {courseContent()}
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

  function joinButton() {
    return (
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primaryLight]}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        locations={[0.5, 1]}
        style={{
          width: '100%',
          height: width * 0.15,
          elevation: 3,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={go_to_live}
          style={{
            alignItems: 'center',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[Fonts.white16RobotBold, {textAlign: 'center'}]}>
            Join the Live Demo Class Now
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  function courseContent() {
    return (
      <View
        style={{
          marginBottom: 10,
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          width: '100%',
        }}>
        <View style={styles.subContainer}>
          <Text
            style={[
              {...Fonts.black16RobotoMedium},
              {
                marginBottom: 5,
                textAlign: 'justify',
              },
            ]}>
            Course content
          </Text>
          <Text
            style={[
              Fonts.gray14RobotoRegular,
              {
                marginTop: 5,
                lineHeight: 20,
                color: Colors.grayDark,
                textAlign: 'justify',
              },
            ]}>
            {classData?.course_content}
          </Text>
        </View>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(DemoClassDetails);

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
