import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import {Colors, Fonts, Sizes} from '../assets/style';
const {width, height} = Dimensions.get('screen');
import {api_url, refer_an_astrologer} from '../config/Constants';
import {connect} from 'react-redux';
import Loader from '../component/Loader';
import axios from 'axios';

const ReferAnAstrologer = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');

  const email_validation = e => {
    let emailID = email;
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(emailID)) {
      // Yay! valid
      return true;
    } else {
      return false;
    }
  };

  const validation = () => {
    if (name.length == 0) {
      Alert.alert('Please enter Astrologer Name');
      return false;
    } else if (email.length == 0) {
      Alert.alert('Please enter Email ID');
      return false;
    }
    // else if (email_validation(email)) {
    //   Alert.alert('Please enter Valid Email ID');
    //   return false;
    // }
    else if (mobileNumber.length == 0) {
      Alert.alert('Please enter Mobile Number');
      return false;
    } else if (mobileNumber.length != 10) {
      Alert.alert('Please enter Full Mobile Number');
      return false;
    } else if (expertise.length == 0) {
      Alert.alert('Please enter Astrologer Expertise');
      return false;
    } else if (experience.length == 0) {
      Alert.alert('Please enter Astrologer Experience');
      return false;
    } else {
      return true;
    }
  };

  const handleSend = async () => {
    if (validation()) {
      setIsLoading(true);
      console.log('hi');
      await axios({
        method: 'post',
        url: api_url + refer_an_astrologer,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          referal_id: props.providerData.id,
          name: name,
          email: email,
          phone: mobileNumber,
          expertise: expertise,
          experience: experience,
          language: null,
          skill: null,
          location: null,
        },
      })
        .then(async res => {
          setIsLoading(false);
          console.log(res.data);
          if (res.data?.status) {
            Alert.alert('Sent Successfull');
            clearFields();
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const clearFields = () => {
    setName(null);
    setEmail(null);
    setMobileNumber(null);
    setExpertise(null);
    setExperience(null);
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title={'Refer an Astrologer'} navigation={props.navigation} />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        <FlatList ListHeaderComponent={<>{astrologerdetailsform()}</>} />
      </View>
    </View>
  );

  function astrologerdetailsform() {
    return (
      <View style={{justifyContent: 'space-between', height: height * 0.87}}>
        <View style={{marginHorizontal: 20, paddingTop: 10}}>
          <TextInput
            value={name}
            onChangeText={e => setName(e)}
            style={styles.inputbox3}
            placeholder="Name of Astrologer"
          />

          <TextInput
            value={email}
            onChangeText={e => setEmail(e)}
            style={styles.inputbox3}
            placeholder="Email ID"
          />

          <View style={styles.inputContainer}>
            <View
              style={{
                width: '15%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Image
                source={require('../assets/icon/india_flag.png')}
                resizeMode="cover"
                style={{
                  width: '70%',
                  height: '50%',
                  borderRadius: width * 0.02,
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
              <Text style={Fonts.gray14RobotoMedium}>+91</Text>
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
                style={[Fonts.gray14RobotoRegular, {width: '100%'}]}
                placeholder="Enter Mobile Number"
                maxLength={10}
                onChangeText={text => setMobileNumber(text)}
              />
            </View>
          </View>
          <TextInput
            value={expertise}
            onChangeText={e => setExpertise(e)}
            style={styles.inputbox3}
            placeholder="Expertise of Astrologer"
          />
          <TextInput
            value={experience}
            inputMode="numeric"
            onChangeText={e => setExperience(e)}
            style={styles.inputbox3}
            placeholder="Years of Experience"
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => handleSend()}
            style={{
              backgroundColor: Colors.primaryDark,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
              height: width * 0.13,
              width: '70%',
              paddingHorizontal: 15,
            }}>
            <Text style={Fonts.white16RobotoMedium}>Submit</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReferAnAstrologer);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: width * 0.05,
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    borderRadius: width * 0.04,
    elevation: 3,
    width: '48%',
    height: width * 0.25,
  },
  inputbox3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: width * 0.12,
    width: '100%',
    marginBottom: 15,
    borderBottomColor: Colors.gray2,
    borderBottomWidth: 1,
  },
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
    marginVertical: width * 0.02,
  },
});
