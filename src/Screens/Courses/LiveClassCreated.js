import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import MyHeader from '../../component/MyHeader';
import {Colors, Fonts, Sizes} from '../../assets/style';
const {width, height} = Dimensions.get('screen');
import {SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import {api_url, pdf_course_live_astro} from '../../config/Constants';
import {connect} from 'react-redux';
import axios from 'axios';
import Loader from '../../component/Loader';
import {MyMethods} from '../../methods/MyMethods';
import moment from 'moment';

const LiveClassCreated = ({navigation, route, providerData}) => {
  const [state, setState] = useState({
    isLoading: false,
    historyData: null,
  });

  useEffect(() => {
    get_demo_history();
  }, []);

  const get_demo_history = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + pdf_course_live_astro,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: providerData?.id,
      },
    })
      .then(res => {
        updateState({isLoading: false});
        if (res.data.status == '200') {
          updateState({historyData: res.data.data});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
        console.log(err);
      });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {isLoading, historyData} = state;

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title="Live Class List" navigation={navigation} />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList ListHeaderComponent={<>{historyData && courseHistory()}</>} />
      </View>
    </View>
  );

  function courseHistory() {
    const renderItem = ({item}) => {
      const isToday = MyMethods.check_current_day({
        date: item?.batchStartDate,
        type: 'greater',
      });
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('liveClassDetails', {
              classData: item,
            })
          }
          activeOpacity={0.9}
          style={styles.container}>
          <View style={styles.subContainer}>
            <Text
              numberOfLines={1}
              style={{...Fonts.primaryDark16RobotoMedium}}>
              {item?.course_name}
            </Text>
            <Text
              numberOfLines={3}
              style={[
                Fonts.grayDark16RobotRegular,
                {marginTop: 5, textAlign: 'justify'},
              ]}>
              {item?.description}
            </Text>
          </View>
          <LinearGradient
            colors={
              item.status !== '2'
                ? [Colors.primaryDark, Colors.primaryLight]
                : [Colors.grayDark, Colors.grayDark]
            }
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            locations={[0.5, 1]}
            style={[styles.statusContainer]}>
            {item.status !== '2' ? (
              <View style={styles.statusTextBox}>
                <Text style={[Fonts.white14RobotoMedium, {marginRight: 10}]}>
                  Live Class
                </Text>
                <Text style={Fonts.white12RobotoRegular}>
                  {isToday
                    ? 'Continue'
                    : `${moment(item?.batchStartDate).format(
                        'DD MMM',
                      )} - ${moment(item?.batchStartTime).format('hh:mm A')}`}
                </Text>
              </View>
            ) : (
              <View style={[styles.statusTextBox, {paddingHorizontal: 20}]}>
                <Text style={[Fonts.white16RobotoMedium]}>{item.status}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    };
    return (
      <FlatList
        data={historyData}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 15}}
      />
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(LiveClassCreated);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    backgroundColor: 'transparent',
    marginBottom: width * 0.11,
    marginTop: 10,
    position: 'relative',
  },
  subContainer: {
    borderRadius: 20,
    backgroundColor: Colors.grayLight,
    borderRadius: width * 0.04,
    elevation: 3,
    padding: SCREEN_WIDTH * 0.05,
  },
  statusContainer: {
    borderRadius: 20,
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
    width: SCREEN_WIDTH * 0.7,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
