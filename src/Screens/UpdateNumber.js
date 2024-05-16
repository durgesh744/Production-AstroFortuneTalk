import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import {Colors, Fonts, Sizes} from '../assets/style';
const {width, height} = Dimensions.get('screen');
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {api_url, update_mobile_mumber} from '../config/Constants';
import Loader from '../component/Loader';
const UpdateNumber = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  const mobileNumberValidation = () => {
    // Check if the mobileNumber is a 10-digit number
    return /^[0-9]{10}$/.test(mobileNumber);
  };

  const validation = () => {
    if (mobileNumber.length == 0) {
      Alert.alert('Please enter your Mobile Number');
      return false;
    } else if (mobileNumberValidation() == false) {
      Alert.alert('Please enter full Mobile Number.');
      return false;
    } else {
      return true;
    }
  };

  const handleChange = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + update_mobile_mumber,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          astrologer_id: props.providerData.id,
          mobile_number: mobileNumber,
        },
      })
        .then(async res => {
          setIsLoading(false);
          console.log(res);
          if (res.data?.status) {
            Alert.alert(res.data.message);
          } else {
            Alert.alert('Please Check Your Internet');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="Update Phone Number" navigation={props.navigation} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {notelabel()}
              {updateForm()}
            </>
          }
        />
      </View>
    </View>
  );

  function notelabel() {
    return (
      <View
        style={{
          width: width * 1,
          backgroundColor: Colors.backgr_clr,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: width * 0.05,
          paddingVertical: width * 0.05,
        }}>
        <Text style={[Fonts.black12RobotoMedium, {textAlign: 'center'}]}>
          You will get call and chat alerts on these numbers
        </Text>
      </View>
    );
  }
  function updateForm() {
    return (
      <View
        style={{
          // alignSelf: 'center',
          backgroundColor: Colors.dullWhite,
          width: width,
          flex: 1,
          paddingHorizontal: width * 0.1,
          paddingVertical: width * 0.07,
          borderBottomWidth: 1,
          borderBottomColor: Colors.gray3,
        }}>
        <Text style={Fonts.primaryDark16RobotoMedium}>
          Primary Mobile Number
        </Text>
        <View style={styles.inputContainer}>
          <View
            style={{
              width: '15%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Image
              source={require('../assets/icon/india_flag.png')}
              style={{
                width: '90%',
                height: '50%',
                borderRadius: width * 0.02,
                backgroundColor: 'red',
              }}
            />
          </View>
          <View
            style={{
              width: '15%',
              height: '80%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text style={Fonts.grayDark16RobotoMedium}>+91</Text>
            <View
              style={{
                height: '80%',
                width: 1.5,
                backgroundColor: Colors.gray_back,
              }}
            />
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              inputMode="numeric"
              value={mobileNumber}
              cursorColor={Colors.primaryDark}
              style={[Fonts.primaryDark16RobotoMedium, {width: '100%'}]}
              placeholder="Enter Mobile Number"
              maxLength={10}
              onChangeText={text => setMobileNumber(text)}
            />
          </View>
        </View>
        <View style={{width: '70%', alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() => handleChange()}
            style={{
              width: '100%',
              borderRadius: width * 0.1,
              backgroundColor: Colors.primaryDark,
              paddingVertical: width * 0.04,
            }}>
            <Text style={[Fonts.white16RobotoMedium, {textAlign: 'center'}]}>
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNumber);

const styles = StyleSheet.create({
  inputContainer: {
    // backgroundColor: Colors.backgr_clr,
    borderWidth: 1.5,
    borderColor: Colors.gray_back,
    paddingHorizontal: 5,
    width: '100%',
    height: width * 0.15,
    borderRadius: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: width * 0.05,
  },
});
