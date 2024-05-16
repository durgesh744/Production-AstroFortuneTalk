import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import React, {useState} from 'react';
import MyStatusBar from '../../component/MyStatusBar';
import {Colors, Fonts, Sizes} from '../../assets/style';
import MyHeader from '../../component/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {api_url, create_free_remedy} from '../../config/Constants';
import {showToastWithGravityAndOffset} from '../../methods/toastMessage';
import {connect} from 'react-redux';
import Loader from '../../component/Loader';
import database from '@react-native-firebase/database';
import {MyMethods} from '../../methods/MyMethods';

const AddRemedy = ({
  navigation,
  providerData,
  route,
  astroFirebaseID,
  customerFirebaseID,
}) => {
  console.log(route?.params)
  const [state, setState] = useState({
    isLoading: false,
    free_product_name: '',
    free_product_description: '',
    free_product_images: null,
    paid_product_name: '',
    paid_product_price: '',
    paid_product_description: '',
    paid_product_images: null,
    is_free_remedy: true,
    is_astromall: true,
  });

  const free_remedy_validation = () => {
    if (free_product_name.length == 0) {
      showToastWithGravityAndOffset('Please enter product name.');
      return false;
    } else if (free_product_images == null) {
      showToastWithGravityAndOffset('Please select images.');
      return false;
    } else if (free_product_description.length == 0) {
      showToastWithGravityAndOffset('Please enter product description.');
      return false;
    } else {
      return true;
    }
  };

  const paid_remedy_validation = () => {
    if (paid_product_name.length == 0) {
      showToastWithGravityAndOffset('Please enter product name.');
      return false;
    } else if (paid_product_price.length == 0) {
      showToastWithGravityAndOffset('Please enter product price.');
      return false;
    } else if (paid_product_images == null) {
      showToastWithGravityAndOffset('Please select images.');
      return false;
    } else if (paid_product_description.length == 0) {
      showToastWithGravityAndOffset('Please enter product description.');
      return false;
    } else {
      return true;
    }
  };

  const add_free_remedy = async () => {
    if (free_remedy_validation()) {
      updateState({isLoading: true});
      let data = new FormData();
      data.append('astro_id', providerData?.id);
      data.append('product_name', free_product_name);
      data.append('des', free_product_description);
      data.append('status', '1');
      data.append('customer_id', route?.params?.customer_id.toString());

      free_product_images.map((item, index) => {
        data.append(`image[${index}]`, {
          uri: item?.uri,
          name: item?.fileName,
          type: 'image/jpg',
        });
      });

      await axios({
        method: 'post',
        url: api_url + create_free_remedy,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then(res => {
          updateState({isLoading: false});
          if (typeof route?.params?.screen_type == 'undefined') {
            const sendMessage = {
              _id: MyMethods.generateUniqueId(),
              text: `Free Remedy Suggested by ${providerData?.owner_name}`,
              user: {
                _id: astroFirebaseID,
                name: providerData?.owner_name,
                // avatar: base_url + userData?.image,
              },
              remedy: res.data.remedie_id,
              type: 'remedy',
              // Mark the message as sent, using one tick
              sent: true,
              // Mark the message as received, using two tick
              received: false,
              // Mark the message as pending with a clock loader
              pending: false,
              senderId: astroFirebaseID,
              receiverId: customerFirebaseID,
            };

            addMessage(sendMessage);

            firebase_update({
              remedies_id: res.data.remedie_id,
              status: '1',
              product_name: free_product_name,
              product_description: free_product_description,
              astro_name: providerData?.owner_name,
            });
          }

          navigation.pop(2);

        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
    }
  };

  const add_paid_remedy = async () => {
    if (paid_remedy_validation()) {
      updateState({isLoading: true});
      let data = new FormData();
      data.append('astro_id', providerData?.id);
      data.append('product_name', paid_product_name);
      data.append('des', paid_product_description);
      data.append('price', paid_product_price);
      data.append('status', '2');
      data.append('customer_id', route?.params?.customer_id.toString());
      paid_product_images.map((item, index) => {
        data.append(`image[${index}]`, {
          uri: item?.uri,
          name: item?.fileName,
          type: 'image/jpg',
        });
      });

      await axios({
        method: 'post',
        url: api_url + create_free_remedy, 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then(res => {
          updateState({isLoading: false});
          if (typeof route?.params?.screen_type == 'undefined') {
            const sendMessage = {
              _id: MyMethods.generateUniqueId(),
              text: `Paid Remedy Suggested by ${providerData?.owner_name}`,
              user: {
                _id: astroFirebaseID,
                name: providerData?.owner_name,
                // avatar: base_url + userData?.image,
              },
              remedy: res.data.remedie_id,
              type: 'paid_remedy',
              // Mark the message as sent, using one tick
              sent: true,
              // Mark the message as received, using two tick
              received: false,
              // Mark the message as pending with a clock loader
              pending: false,
              senderId: astroFirebaseID,
              receiverId: customerFirebaseID,
            };

            addMessage(sendMessage);
            firebase_update({
              remedies_id: res.data.remedie_id,
              status: '2',
              product_name: paid_product_name,
              product_description: paid_product_description,
              product_price: paid_product_price,
              astro_name: providerData?.owner_name,
            });
          }

          navigation.pop(2);

        })
        .catch(err => {
          updateState({isLoading: false});
          console.log(err);
        });
    }
  };

  const firebase_update = data => {
    database()
      .ref(`CustomerCurrentRequest/${route?.params?.customer_id}`)
      .update({
        remedies: data,
      })
  };

  const addMessage = message => {
    try {
      const chat_id = customerFirebaseID + '+' + astroFirebaseID;
      const node = database().ref(`/AstroId/${providerData?.id}`).push();
      const key = node.key;
      database()
        .ref(`/Messages/${chat_id}/${key}`)
        .set({
          ...message,
          createdAt: new Date().getTime(),
          addedAt: database.ServerValue.TIMESTAMP,
        });
    } catch (e) {
      console.log(e);
    }
  };

  const openImageLibrary = type => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
      selectionLimit: 5,
    }; // Add any camera options you need
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image library');
      } else if (response.errorCode) {
        console.log(response.errorCode, response.errorMessage, 'asdfghjk');
      } else {
        if (type == 'free') {
          updateState({free_product_images: response.assets});
        } else {
          updateState({paid_product_images: response.assets});
        }
      }
    });
  };

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {
    isLoading,
    free_product_name,
    free_product_description,
    free_product_images,
    paid_product_name,
    paid_product_price,
    paid_product_description,
    paid_product_images,
    is_free_remedy,
    is_astromall,
  } = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {remedyTitleInfo()}
              {freePaidRemedyButtonInfo()}
              {is_free_remedy ? freeRemdyInfo() : paidRemedyTypeInfo()}
              {!is_astromall && paidRemedyInfo()}
            </>
          }
          contentContainerStyle={{paddingVertical: Sizes.fixPadding}}
        />
      </View>
    </View>
  );

  function paidRemedyInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.gray4,
          marginHorizontal: Sizes.fixPadding * 1.5,
          padding: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>Product Name</Text>
        <TextInput
          placeholder="Enter here..."
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({paid_product_name: text})}
          style={styles.input}
        />
        <Text
          style={{
            ...Fonts.black16RobotoMedium,
            marginTop: Sizes.fixPadding * 2,
          }}>
          Price
        </Text>
        <TextInput
          placeholder="Enter here..."
          placeholderTextColor={Colors.gray}
          keyboardType="number-pad"
          onChangeText={text => updateState({paid_product_price: text})}
          style={styles.input}
        />
        <Text
          style={{
            ...Fonts.black16RobotoMedium,
            marginTop: Sizes.fixPadding * 2,
          }}>
          Perform By
        </Text>
        <TouchableOpacity>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={[
              styles.submitButton,
              {
                width: '100%',
                marginTop: Sizes.fixPadding,
                paddingVertical: Sizes.fixPadding,
                borderRadius: Sizes.fixPadding,
                elevation: 5,
                shadowColor: Colors.gray,
              },
            ]}>
            <Text
              style={{
                ...Fonts.white16RobotoMedium,
                textAlign: 'center',
              }}>
              Me
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginTop: Sizes.fixPadding * 2.5,
            marginBottom: Sizes.fixPadding,
          }}>
          Attachment (Max 5 images allowed)
        </Text>
        <View
          style={[
            styles.row,
            {
              marginBottom: Sizes.fixPadding * 2,
              alignItems: 'flex-start',
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openImageLibrary('paid')}
            style={{
              width: SCREEN_WIDTH * 0.3,
              height: SCREEN_WIDTH * 0.3,
              ...styles.center,
              backgroundColor: Colors.white,
              borderRadius: Sizes.fixPadding,
              elevation: 5,
              shadowColor: Colors.gray,
            }}>
            <AntDesign name="plus" color={Colors.gray} size={50} />
          </TouchableOpacity>
          <View
            style={[
              styles.row,
              {
                marginLeft: Sizes.fixPadding,
                flexWrap: 'wrap',
                width: SCREEN_WIDTH * 0.6,
              },
            ]}>
            {paid_product_images &&
              paid_product_images.map((item, index) => (
                <Image
                  key={index}
                  source={{uri: item.uri}}
                  style={{
                    width: SCREEN_WIDTH * 0.15,
                    height: SCREEN_WIDTH * 0.15,
                    marginRight: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding,
                  }}
                />
              ))}
          </View>
        </View>
        <Text style={{...Fonts.black16RobotoMedium}}>Description</Text>
        <TextInput
          placeholder="Enter here about product..."
          placeholderTextColor={Colors.gray}
          multiline
          onChangeText={text => updateState({paid_product_description: text})}
          style={[
            styles.input,
            {
              height: SCREEN_HEIGHT * 0.2,
              textAlignVertical: 'top',
              marginBottom: Sizes.fixPadding * 2,
            },
          ]}
        />

        <TouchableOpacity activeOpacity={0.8} onPress={add_paid_remedy}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={styles.submitButton}>
            <Text
              style={{
                ...Fonts.white18RobotBold,
                fontSize: 22,
                textAlign: 'center',
              }}>
              Submit
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  function paidRemedyTypeInfo() {
    return (
      <View>
        <Text
          style={{
            ...Fonts.black18RobotoMedium,
            marginHorizontal: Sizes.fixPadding,
            opacity: 0.7,
          }}>
          Remedy From
        </Text>
        <View
          style={{
            backgroundColor: Colors.gray4,
            margin: Sizes.fixPadding * 1.5,
          }}>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={[
                styles.remedyButtonContainer,
                {backgroundColor: is_astromall ? Colors.gray4 : Colors.white},
              ]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('astromall', route?.params)}
                style={{width: '100%'}}>
                <LinearGradient
                  colors={
                    is_astromall
                      ? [Colors.primaryLight, Colors.primaryDark]
                      : [Colors.gray4, Colors.gray3]
                  }
                  style={[styles.remedyButtonChild]}>
                  <Text
                    style={
                      is_astromall
                        ? {...Fonts.white16RobotoMedium, textAlign: 'center'}
                        : {...Fonts.gray16RobotoMedium, textAlign: 'center'}
                    }>
                    Search from{'\n'}Astromall
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.remedyButtonContainer,
                {backgroundColor: !is_astromall ? Colors.gray4 : Colors.white},
              ]}>
              <TouchableOpacity
                onPress={() => updateState({is_astromall: false})}
                style={{width: '100%'}}>
                <LinearGradient
                  colors={
                    !is_astromall
                      ? [Colors.primaryLight, Colors.primaryDark]
                      : [Colors.gray4, Colors.gray3]
                  }
                  style={[styles.remedyButtonChild]}>
                  <Text
                    style={
                      !is_astromall
                        ? {...Fonts.white16RobotoMedium, textAlign: 'center'}
                        : {...Fonts.gray16RobotoMedium, textAlign: 'center'}
                    }>
                    Create{'\n'}your own
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function freeRemdyInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.gray4,
          marginHorizontal: Sizes.fixPadding * 1.5,
          padding: Sizes.fixPadding,
        }}>
        <Text style={{...Fonts.black16RobotoMedium}}>Product Name</Text>
        <TextInput
          placeholder="Enter here..."
          placeholderTextColor={Colors.gray}
          onChangeText={text => updateState({free_product_name: text})}
          style={styles.input}
        />
        <Text
          style={{
            ...Fonts.black16RobotoRegular,
            marginTop: Sizes.fixPadding * 2.5,
            marginBottom: Sizes.fixPadding,
          }}>
          Attachment (Max 5 images allowed)
        </Text>
        <View
          style={[
            styles.row,
            {
              marginBottom: Sizes.fixPadding * 2,
              alignItems: 'flex-start',
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openImageLibrary('free')}
            style={{
              width: SCREEN_WIDTH * 0.3,
              height: SCREEN_WIDTH * 0.3,
              ...styles.center,
              backgroundColor: Colors.white,
              borderRadius: Sizes.fixPadding,
              elevation: 5,
              shadowColor: Colors.gray,
            }}>
            <AntDesign name="plus" color={Colors.gray} size={50} />
          </TouchableOpacity>
          <View
            style={[
              styles.row,
              {
                marginLeft: Sizes.fixPadding,
                flexWrap: 'wrap',
                width: SCREEN_WIDTH * 0.6,
              },
            ]}>
            {free_product_images &&
              free_product_images.map((item, index) => (
                <Image
                  key={index}
                  source={{uri: item.uri}}
                  style={{
                    width: SCREEN_WIDTH * 0.15,
                    height: SCREEN_WIDTH * 0.15,
                    marginRight: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding,
                  }}
                />
              ))}
          </View>
        </View>
        <Text style={{...Fonts.black16RobotoMedium}}>Description</Text>
        <TextInput
          placeholder="Enter here about product..."
          placeholderTextColor={Colors.gray}
          multiline
          onChangeText={text => updateState({free_product_description: text})}
          style={[
            styles.input,
            {
              height: SCREEN_HEIGHT * 0.2,
              textAlignVertical: 'top',
              marginBottom: Sizes.fixPadding * 2,
            },
          ]}
        />

        <TouchableOpacity activeOpacity={0.8} onPress={add_free_remedy}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={styles.submitButton}>
            <Text
              style={{
                ...Fonts.white18RobotBold,
                fontSize: 22,
                textAlign: 'center',
              }}>
              Submit
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  function freePaidRemedyButtonInfo() {
    return (
      <View
        style={{backgroundColor: Colors.gray4, margin: Sizes.fixPadding * 1.5}}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={[
              styles.remedyButtonContainer,
              {backgroundColor: is_free_remedy ? Colors.gray4 : Colors.white},
            ]}>
            <TouchableOpacity
              onPress={() => updateState({is_free_remedy: true})}
              style={{width: '100%'}}>
              <LinearGradient
                colors={
                  is_free_remedy
                    ? [Colors.primaryLight, Colors.primaryDark]
                    : [Colors.gray4, Colors.gray3]
                }
                style={[styles.remedyButtonChild]}>
                <Text
                  style={
                    is_free_remedy
                      ? {...Fonts.white16RobotoMedium, textAlign: 'center'}
                      : {...Fonts.gray16RobotoMedium, textAlign: 'center'}
                  }>
                  Free{'\n'}Remedy
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.remedyButtonContainer,
              {backgroundColor: !is_free_remedy ? Colors.gray4 : Colors.white},
            ]}>
            <TouchableOpacity
              onPress={() => updateState({is_free_remedy: false})}
              style={{width: '100%'}}>
              <LinearGradient
                colors={
                  !is_free_remedy
                    ? [Colors.primaryLight, Colors.primaryDark]
                    : [Colors.gray4, Colors.gray3]
                }
                style={[styles.remedyButtonChild]}>
                <Text
                  style={
                    !is_free_remedy
                      ? {...Fonts.white16RobotoMedium, textAlign: 'center'}
                      : {...Fonts.gray16RobotoMedium, textAlign: 'center'}
                  }>
                  Paid{'\n'}Remedy
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function remedyTitleInfo() {
    return (
      <Text
        style={{
          ...Fonts.black18RobotoMedium,
          marginHorizontal: Sizes.fixPadding,
          opacity: 0.7,
        }}>
        Remedy Type
      </Text>
    );
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', padding: Sizes.fixPadding * 1.5}}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            fontSize: 16,
            textAlign: 'center',
            flex: 1,
          }}>
          Suggest Remedy
        </Text>
      </View>
    );
  }
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
  astroFirebaseID: state.chat.astroFirebaseID,
  customerFirebaseID: state.chat.customerFirebaseID,
});

export default connect(mapStateToProps, null)(AddRemedy);
const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  remedyButtonContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_WIDTH * 0.25,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
  },
  remedyButtonChild: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray4,
    borderRadius: Sizes.fixPadding,
  },
  input: {
    backgroundColor: Colors.white,
    elevation: 8,
    marginTop: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    shadowColor: Colors.gray,
    ...Fonts.black14RobotoRegular,
  },
  submitButton: {
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    paddingVertical: Sizes.fixPadding * 0.6,
    borderRadius: 1000,
  },
});
