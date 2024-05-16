import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import {useState, useEffect} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../assets/style';
import MyHeader from '../component/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import Loader from '../component/Loader';
import axios from 'axios';
import {api_url, get_request} from '../config/Constants';

const {width, height} = Dimensions.get('screen');

const PriceChange = ({navigation, providerData}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [his, sethis] = useState();
  const [state, setState] = useState({
    isLoading: false,
    eventName: '',
    startTime: null,
    startDate: null,
    modalVisible: false,
    eventsData: null,
  });

  const updateState = data => {
    setState(prevData => {
      const newData = {...prevData, ...data};
      return newData;
    });
  };

  const {eventsData} = state;
  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    setIsLoading(true);
    console.log(api_url + get_request);
    let data = new FormData();
    data.append('astro_id', '526');
    await axios({
      method: 'post',
      url: api_url + get_request,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(async res => {
        setIsLoading(false);
        console.log(res.data);
        if (res.data) {
          sethis(res.data);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err, 'gasdfgliu');
      });
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <MyHeader title={'Price Change Request'} navigation={navigation} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: height * 0.01,
          borderBottomWidth: 1,
          borderColor: Colors.gray3,
        }}></View>
      <FlatList ListHeaderComponent={<>{eventsData && liveListInfo()}</>} />
      {BottonButton()}
    </View>
  );

  function BottonButton() {
    return (
      <View
        style={{
          flex: 0,
          borderTopWidth: 1,
          borderColor: Colors.gray_light,
          justifyContent: 'center',
          marginBottom: height * 0.04,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={styles.touchablity}>
            <TouchableOpacity
              onPress={() => navigation.navigate('priceRequest')}>
              <Text style={{...Fonts.white16RobotBold, textAlign: 'center'}}>
                +Request for new Price
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  }

  function liveListInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{paddingHorizontal: 15, flex: 1, paddingVertical: 10}}>
          <View
            style={{
              backgroundColor: Colors.primaryLight,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text style={{...Fonts.while24RighteousRegular, fontWeight: '800'}}>
              Text
            </Text>
            <Text
              style={{
                ...Fonts.white14RobotoMedium,
                color: Colors.white,
                marginVertical: 7,
              }}>
              Text
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingTop: 5,
              }}>
              <Text
                style={{...Fonts.white14RobotoMedium, color: Colors.date_clr}}>
                Text
              </Text>
              <Text style={{...Fonts.white14RobotoMedium, color: '#FFEC9A'}}>
                Text
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <FlatList data={eventsData.reverse()} renderItem={renderItem} />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(PriceChange);

const styles = StyleSheet.create({
  touchablity: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 40,
    padding: 10,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    width: '80%',
    justifyContent: 'center',
    marginHorizontal: Sizes.fixPadding,
    marginTop: Sizes.fixPadding * 2.6,
  },
  centeredView: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    padding: 25,
    backgroundColor: Colors.dullWhite,
    alignItems: 'flex-start',
    marginHorizontal: Sizes.fixPadding,
    width: '80%',
    borderRadius: 30,
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.black,
    padding: 10,
    marginBottom: 20,
    zIndex: -1,
    width: width * 0.4,
    backgroundColor: Colors.white,
    elevation: 15,
    shadowColor: Colors.black,
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
    height: 50,
  },
  txtInput: {
    padding: 10,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 5,
    borderColor: Colors.black,
    elevation: 15,
    shadowColor: Colors.black,
  },
  blurContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
