import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';
import Documets from './Documets';
import Voice from './Voice';
import {Bubble, GiftedChat, Send, Time} from 'react-native-gifted-chat';
import {img_url_2} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts, Sizes} from '../../assets/style';
import InputMesaage from './InputMesaage';
import {MyMethods} from '../../methods/MyMethods';
import {tarotValue} from '../../config/TarotValue';
import {SCREEN_WIDTH} from '../../config/Screen';

const CustomGiftedChat = ({chatData, providerData}) => {
  return (
    <GiftedChat
      alwaysShowSend
      messages={chatData}
      scrollToBottom
      user={{
        _id: `astro${providerData?.id}`,
        avatar: img_url_2 + providerData?.img_url,
        name: providerData?.owner_name,
      }}
      renderTime={props => {
        return (
          <Time
            {...props}
            timeTextStyle={{right: {...Fonts.black12PoppinsRegular}}}
          />
        );
      }}
      renderInputToolbar={({sendButtonProps, ...props}) => {
        return (
          <InputMesaage sendButtonProps={sendButtonProps} sendProps={props} />
        );
      }}
      renderBubble={props => {
        const {currentMessage} = props;
        if (currentMessage?.type == 'file') {
          return (
            <Bubble
              {...props}
              renderCustomView={() => {
                return <Documets item={currentMessage} />;
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.primaryLight,
                },
                left: {
                  backgroundColor: Colors.whiteDark,
                },
              }}
              textStyle={{right: {...Fonts.black14RobotoRegular}}}
              // tickStyle={{left: colors.white_color}}
            />
          );
        } else if (currentMessage?.type == 'voice') {
          return (
            <Bubble
              {...props}
              renderCustomView={() => {
                return <Voice item={currentMessage} uploadProgress={0} />;
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.primaryLight,
                },
                left: {
                  backgroundColor: Colors.whiteDark,
                },
              }}
              textStyle={{right: {...Fonts.black14RobotoRegular}}}
              // tickStyle={{left: colors.white_color}}
            />
          );
        } else if (currentMessage?.type == 'tarot') {
          return (
            <Bubble
              {...props}
              renderCustomView={() => {
                return (
                  <View>
                    {JSON.parse(currentMessage.tarot).map(tarotItem => (
                      <Image
                        source={tarotValue[parseInt(tarotItem.id - 1)]}
                        style={{
                          width: SCREEN_WIDTH * 0.45,
                          resizeMode: 'contain',
                          height: SCREEN_WIDTH * 0.7,
                          marginBottom: Sizes.fixPadding,
                        }}
                      />
                    ))}
                  </View>
                );
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.primaryLight,
                },
                left: {
                  backgroundColor: Colors.whiteDark,
                },
              }}
              textStyle={{right: {...Fonts.black14RobotoRegular}}}
              // tickStyle={{left: colors.white_color}}
            />
          );
        } else if (
          currentMessage?.type == 'remedy' ||
          currentMessage?.type == 'product'
        ) {
          return (
            <Bubble
              {...props}
              renderMessageText={props => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => get_remedy(currentMessage)}
                    style={{
                      width: SCREEN_WIDTH * 0.75,
                      padding: Sizes.fixPadding,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          ...Fonts.white14RobotoMedium,
                        }}>
                        Sended {currentMessage?.text}
                      </Text>
                    </View>

                    <Ionicons
                      name="arrow-forward-circle"
                      color={Colors.white}
                      size={22}
                    />
                  </TouchableOpacity>
                );
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.primaryLight,
                },
                left: {
                  backgroundColor: Colors.whiteDark,
                },
              }}
              textStyle={{right: {...Fonts.black14RobotoRegular}}}
              // tickStyle={{left: colors.white_color}}
            />
          );
        } else {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.primaryLight,
                },
                left: {
                  backgroundColor: Colors.grayLight,
                },
              }}
              textStyle={{right: {...Fonts.white14RobotoMedium}}}
              // tickStyle={{left: colors.white_color}}
            />
          );
        }
      }}
    />
  );
};

const mapStateToProps = state => ({
  chatData: state.chat.chatData,
  providerData: state.provider.providerData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CustomGiftedChat);
