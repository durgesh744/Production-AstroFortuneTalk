import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../component/MyStatusBar';
import MyHeader from '../component/MyHeader';
import {Colors, Fonts, Sizes} from '../assets/style';
import axios from 'axios';
import {connect} from 'react-redux';
const {width, height} = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ImageBackground} from 'react-native';
// import  from 'react-native-stars';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {api_url, get_followers, provider_img_url} from '../config/Constants';
import Loader from '../component/Loader';

const Followers = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [followersList, setFollowersList] = useState();

  useEffect(() => {
    fetch_Followers();
  }, []);

  const fetch_Followers = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_followers,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: props.providerData.id,
      },
    })
      .then(async res => {
        if (res.data?.status) {
          setFollowersList(res.data.data);
          setIsLoading(false);
          console.log('not found');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <MyHeader title="My Followers" navigation={props.navigation} />
      <Loader visible={isLoading} />
      <View style={{flex: 1, marginTop: Sizes.fixPadding * 1.5}}>
        <FlatList
          ListHeaderComponent={
            <>
              {followersList && ratingList()}
              {followersList && followers()}
            </>
          }
        />
      </View>
    </View>
  );

  function ratingList() {
    return (
      <View
        style={{
          flex: 0,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          top: -5,
        }}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          style={styles.gradient}>
          <TouchableOpacity>
            <Text style={{...Fonts.white18RobotBold, fontSize: 16}}>
              Total followers: {followersList.length}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  function followers() {
    const renderItem = ({item}) => {
      return (
        <View
          style={{
            backgroundColor: Colors.dullWhite,
            marginVertical: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                overflow: 'hidden',
                borderRadius: 50,
                height: width * 0.15,
                width: width * 0.15,
                borderWidth: 1.5,
                borderColor: Colors.primaryDark,
                backgroundColor: 'red',
                marginHorizontal: 15,
              }}>
              <Image
                source={{
                  uri: provider_img_url + item.users_details.user_profile_image,
                }}
                resizeMode="cover"
                style={{height: '100%', width: '100%'}}
              />
            </View>
            <View style={{width: '80%'}}>
              <Text style={{...Fonts.gray16RobotoMedium}}>
                {item.users_details.username}
              </Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={{marginTop: '5%'}}>
        <FlatList
          data={followersList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => (
            <View style={{backgroundColor: Colors.gray3, height: 1}} />
          )}
          contentContainerStyle={{paddingVertical: 15}}
        />
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Followers);

const styles = StyleSheet.create({
  myStarStyle: {
    color: '#FEE781',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },

  gradient: {
    padding: Sizes.fixPadding,
    borderRadius: 30,
    width: '60%',
    marginVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
