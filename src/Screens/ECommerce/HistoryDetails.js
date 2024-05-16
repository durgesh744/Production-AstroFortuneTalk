import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyHeader from '../../component/MyHeader';
import {Colors, Sizes, Fonts} from '../../assets/style';
import MyStatusBar from '../../component/MyStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {SCREEN_WIDTH} from '../../config/Screen';
import {img_url} from '../../config/Constants';
import ImageView from '../../component/ImageView';
import VedioPlayer from '../../component/VedioPlayer';
import {createThumbnail} from 'react-native-create-thumbnail';
import {ActivityIndicator} from 'react-native-paper';

const VedioComponent = ({item, updateState}) => {
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    try {
      setImageLoading(true);
      createThumbnail({
        url: `http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/${item.video}`,
        timeStamp: 10000,
      })
        .then(response => setImageData(response.path), setImageLoading(false))
        .catch(err => console.log({err}), setImageLoading(false));
    } catch (e) {
      setImageLoading(false);
      console.log(e);
    }
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        updateState({
          vedioUri: `http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/${item.video}`,
          videoVisible: true,
        })
      }
      style={{
        width: SCREEN_WIDTH * 0.42,
        height: SCREEN_WIDTH * 0.42,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding,
      }}>
      {imageLoading ? (
        <ActivityIndicator size="small" color={Colors.primaryDark} />
      ) : (
        <ImageBackground
          source={{
            uri: imageData,
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/icon/vedio_play.png')}
            style={{width: 40, height: 40}}
          />
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const HistoryDetails = ({navigation, route}) => {
  const [state, setState] = useState({
    poojaData: route?.params?.poojaData,
    imageVisible: false,
    image: null,
    vedioUri: null,
    videoVisible: false,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {poojaData, imageVisible, image, vedioUri, videoVisible} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {topMessageInfo()}
              {profileDetailsInfo()}
              {paidAmountInfo()}
              {photoGallaryInfo()}
              {vedioGallaryInfo()}
              {astroMessageInfo()}
            </>
          }
        />
      </View>
      <ImageView
        updateState={updateState}
        image={image}
        imageVisible={imageVisible}
      />
      <VedioPlayer
        videoVisible={videoVisible}
        updateState={updateState}
        uri={vedioUri}
      />
    </View>
  );

  function astroMessageInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray16RobotoMedium, marginBottom: Sizes.fixPadding}}>
          Message received from Astrologer
        </Text>

        <Text style={{...Fonts.gray12RobotoMedium, color: Colors.blackLight}}>
          {poojaData?.desc?.description}
        </Text>
      </View>
    );
  }

  function vedioGallaryInfo() {
    const renderItem = ({item, index}) => {
      return <VedioComponent item={item} updateState={updateState} />;
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray16RobotoMedium, marginBottom: Sizes.fixPadding}}>
          Videos
        </Text>
        <FlatList
          data={poojaData?.video}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      </View>
    );
  }

  function photoGallaryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            updateState({
              image: `http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/${item.image}`,
              imageVisible: true,
            })
          }
          style={{width: SCREEN_WIDTH * 0.3, height: SCREEN_WIDTH * 0.3}}>
          <Image
            source={{
              uri:
                'http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/' +
                item.image,
            }}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray16RobotoMedium, marginBottom: Sizes.fixPadding}}>
          Photos
        </Text>
        <FlatList
          data={poojaData?.pooja_image}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      </View>
    );
  }

  function paidAmountInfo() {
    return (
      <View
        style={{
          paddingHorizontal: Sizes.fixPadding * 2,
          paddingBottom: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: Sizes.fixPadding * 0.5,
            paddingHorizontal: Sizes.fixPadding * 2,
            backgroundColor: Colors.whiteDark,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowColor: Colors.blackLight,
          }}>
          <Text
            style={{...Fonts.black16RobotoMedium, color: Colors.blackLight}}>
            Paid Amount
          </Text>
          <Text
            style={{...Fonts.black16RobotoMedium, color: Colors.blackLight}}>
            ₹ {poojaData?.price}/-
          </Text>
        </View>
      </View>
    );
  }

  function profileDetailsInfo() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.gray16RobotoMedium}}>Profile Details:</Text>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>{poojaData?.customer?.username}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Gender</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {poojaData?.customer?.gender == '1'
              ? 'Male'
              : poojaData?.customer?.gender == '2'
              ? 'Female'
              : poojaData?.customer?.gender}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Birth Date</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {moment(poojaData?.customer?.date_of_birth).format('DD-MMMM-YYYY')}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Birth Time</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {moment(poojaData?.customer?.time_of_birth, 'hh:mm').format(
              'hh:mm A',
            )}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Birth Place</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {poojaData?.customer?.current_address}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Current Address</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {poojaData?.customer?.current_address}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.child}>Occupation</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.childValue}>
            {poojaData?.customer?.occupation}
          </Text>
        </View>
      </View>
    );
  }

  function topMessageInfo() {
    return (
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primaryDark]}
        style={{padding: Sizes.fixPadding * 1.5}}>
        <Text
          style={{
            ...Fonts.white14RobotoMedium,
            textAlign: 'center',
          }}>
          Pooja was Completed on{' '}
          {moment(poojaData?.desc?.created_at).format('Do MMM YYYY')}
        </Text>
      </LinearGradient>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Details'} />;
  }
};

export default HistoryDetails;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  child: {
    flex: 0.4,
    ...Fonts.black14RobotoRegular,
    fontSize: 13,
  },
  colon: {...Fonts.black16RobotoMedium},
  childValue: {
    flex: 0.6,
    ...Fonts.black14RobotoRegular,
    marginLeft: Sizes.fixPadding,
    fontSize: 13,
  },
});
