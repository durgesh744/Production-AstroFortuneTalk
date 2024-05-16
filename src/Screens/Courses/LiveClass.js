import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View,
  findNodeHandle,
  Alert,
  BackHandler,
} from 'react-native';
import React, {Component} from 'react';
import {
  api_url,
  complete_course_demo,
  complete_course_live,
  live_streaming_app_id,
  live_streaming_app_sign,
} from '../../config/Constants';
import ZegoExpressEngine, {
  ZegoTextureView,
  ZegoMixerTask,
  ZegoAudioConfig,
  ZegoAudioConfigPreset,
  ZegoMixerInputContentType,
  ZegoScenario,
  ZegoVideoSourceType,
  ZegoPublishChannel,
  ZegoAudioSourceType,
} from 'zego-express-engine-reactnative';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import MyStatusBar from '../../component/MyStatusBar';
import {Colors} from '../../assets/style';
import Header from '../../component/LiveClass/Header';
import Footer from '../../component/LiveClass/Footer';
import Orientation, {OrientationLocker} from 'react-native-orientation-locker';
import RightSidebar from '../../component/LiveClass/RightSidebar';
import Comments from '../../component/LiveClass/Comments';
import {connect} from 'react-redux';
import * as Actions from '../../redux/actions/LiveClassActions';
import axios from 'axios';
import {ApiRequests} from '../../config/requests';

const granted =
  Platform.OS == 'android'
    ? PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.RECORD_AUDIO,
      )
    : undefined;

export class LiveClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveID: this.props.route.params.liveID,
      userID: this.props.route.params.userID,
      userName: this.props.route.params.userName,
      muted: false,
      isScreenSharing: false,
      activeOrientation: 'PORTRAIT',
      commentsVisible: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    let profile = {
      appID: live_streaming_app_id,
      appSign: live_streaming_app_sign,
      scenario: ZegoScenario.General,
    };

    ZegoExpressEngine.createEngineWithProfile(profile).then(engine => {
      // 动态获取设备权限（android）
      if (Platform.OS == 'android') {
        granted
          .then(data => {
            console.log(
              'Do you already have camera and microphone permissions?: ' + data,
            );
            if (!data) {
              const permissions = [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
              ];
              //返回得是对象类型
              PermissionsAndroid.requestMultiple(permissions);
            }
          })
          .catch(err => {
            console.log('check err: ' + err.toString());
          });
      }

      engine.getVersion().then(ver => {
        console.log('Express SDK Version: ' + ver);
      });

      this.onStartLive();

      // if (this.state.liveStartVisible) {
      //   ZegoExpressEngine.instance().startPreview({
      //     reactTag: findNodeHandle(this.refs.zego_preview_view_start),
      //     viewMode: 0,
      //     backgroundColor: 0,
      //   });
      // }

      // this.onClickA();
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.props.dispatch(Actions.setLiveClassComments([]));
    if (ZegoExpressEngine.instance()) {
      console.log('[LZP] destroyEngine');
      ZegoExpressEngine.instance().logoutRoom();
      ZegoExpressEngine.destroyEngine();
    }
  }

  onStartLive = () => {
    ZegoExpressEngine.instance().on(
      'roomOnlineUserCountUpdate',
      (roomID, data) => {},
    );

    ZegoExpressEngine.instance().on(
      'roomStateUpdate',
      (roomID, state, errorCode, extendedData) => {
        console.log(
          'JS onRoomStateUpdate: ' +
            state +
            ' roomID: ' +
            roomID +
            ' err: ' +
            errorCode +
            ' extendData: ' +
            extendedData,
        );
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvBroadcastMessage',
      (roomID, messageList) => {
        let new_comments = this.props.commentsData;
        new_comments.push({
          message: messageList[0].message,
          sendTime: messageList[0].sendTime,
          fromUser: {
            userID: messageList[0].fromUser.userID,
            userName: messageList[0].fromUser.userName,
          },
        });
        this.props.dispatch(Actions.setLiveClassComments(new_comments));
      },
    );

    ZegoExpressEngine.instance().on(
      'IMRecvBarrageMessage',
      (roomID, messageList) => {},
    );

    ZegoExpressEngine.instance().on(
      'IMRecvCustomCommand',
      (roomID, fromUser, command) => {},
    );

    ZegoExpressEngine.instance().on(
      'publisherStateUpdate',
      (streamID, state, errorCode, extendedData) => {
        console.log(
          'JS onPublisherStateUpdate: ' +
            state +
            ' streamID: ' +
            streamID +
            ' err: ' +
            errorCode +
            ' extendData: ' +
            extendedData,
        );
      },
    );

    ZegoExpressEngine.instance().on(
      'playerStateUpdate',
      (streamID, state, errorCode, extendedData) => {
        console.log(
          'JS onPlayerStateUpdate: ' +
            state +
            ' streamID: ' +
            streamID +
            ' err: ' +
            errorCode +
            ' extendData: ' +
            extendedData,
        );
      },
    );

    ZegoExpressEngine.instance().on('mixerSoundLevelUpdate', soundLevels => {
      /*soundLevels.array.forEach(element => {
                  console.log("JS onMixerSoundLevelUpdate: " + element)
                });*/
      var level = soundLevels[0];

      console.log(
        'JS onMixerSoundLevelUpdate: ' +
          soundLevels[0] +
          ' type of: ' +
          typeof level,
      );
    });

    ZegoExpressEngine.instance().on(
      'mixerRelayCDNStateUpdate',
      (taskID, infoList) => {
        console.log('JS onMixerRelayCDNStateUpdate: ' + taskID);
        infoList.forEach(item => {
          console.log(
            'item: ' +
              item.url +
              ' ,state: ' +
              item.state +
              ' ,reason: ' +
              item.updateReason,
            ' ,time: ' + item.stateTime,
          );
        });
      },
    );

    ZegoExpressEngine.instance().loginRoom(this.state.liveID, {
      userID: this.state.userID,
      userName: this.state.userName,
    });

    ZegoExpressEngine.instance().startPreview({
      reactTag: findNodeHandle(this.refs.zego_preview_view),
      viewMode: 1,
      backgroundColor: 0,
    });

    ZegoExpressEngine.instance().startPublishingStream(this.state.liveID);
  };

  cameraHandle = () => {};

  micHandle = () => {
    if (this.state.muted) {
      this.updateState({muted: false});
    } else {
      this.updateState({muted: true});
    }
  };

  startScreenShare = () => {
    ZegoExpressEngine.instance().setVideoSource(
      ZegoVideoSourceType.ScreenCapture,
      ZegoPublishChannel.Aux,
    );
    ZegoExpressEngine.instance().startScreenCapture({});
    ZegoExpressEngine.instance().startPublishingStream(
      this.state.liveID,
      ZegoPublishChannel.Aux,
    );
  };

  stopScreenShare = () => {
    ZegoExpressEngine.instance().stopScreenCapture();
    ZegoExpressEngine.instance().startPublishingStream(this.state.liveID);
  };

  rotateScreen = () => {
    if (this.state.activeOrientation == 'LANDSCAPE') {
      this.updateState({activeOrientation: 'PORTRAIT'});
      Orientation.lockToPortrait();
    } else {
      this.updateState({activeOrientation: 'LANDSCAPE'});
      Orientation.lockToLandscape();
    }
  };

  speeckerHandle = () => {};

  callEnd = () => {
    Alert.alert('Alert!', 'Are you sure to end this class?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Back',
        style: 'default',
        onPress: () => this.props.navigation.goBack(),
      },
      {text: 'Completed', style: 'destructive', onPress: () => this.onExit()},
    ]);
  };

  handleBackPress = () => {
    Alert.alert('Alert!', 'Are you sure to end this class?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Back',
        style: 'default',
        onPress: () => this.props.navigation.goBack(),
      },
      {text: 'Completed', style: 'destructive', onPress: () => this.onExit()},
    ]);
    return true;
  };

  onExit = async () => {
    try {
      let response;
      if (this.props.route.params?.type == 'demo') {
        response = await ApiRequests.postRequest({
          url: api_url + complete_course_demo,
          data: {
            id: this.props.route.params?.demoID,
          },
        });
      } else {
        response = await ApiRequests.postRequest({
          url: api_url + complete_course_live,
          data: {
            live_class_id: this.props.route.params?.courseID,
            id: this.props.route.params?.classID,
          },
        });
      }

      if (response?.status == '200') {
        ZegoExpressEngine.instance()
          .sendCustomCommand(
            this.state.liveID,
            JSON.stringify({command: 'end_host'}),
          )
          .then(() => {
            console.log('sended');
            this.props.navigation.pop(3);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  sendMessage = message => {
    ZegoExpressEngine.instance()
      .sendBroadcastMessage(this.state.liveID, message)
      .then(result => {
        let new_comments = this.props.commentsData;
        new_comments.push({
          message: message,
          sendTime: new Date().getTime(),
          fromUser: {
            userID: this.state.userID,
            userName: this.state.userName,
          },
        });
        this.props.dispatch(Actions.setLiveClassComments(new_comments));
      });
  };

  cameraBackFrontChange = data => {
    ZegoExpressEngine.instance().useFrontCamera(data);
  };

  muteUnmuteHandle = data => {};

  updateState = data => {
    this.setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.black}}>
        <MyStatusBar
          backgroundColor={
            this.state.activeOrientation != 'PORTRAIT'
              ? 'transparent'
              : Colors.black
          }
          barStyle={'light-content'}
          translucent={this.state.activeOrientation != 'PORTRAIT'}
        />
        <OrientationLocker
          orientation={this.state.activeOrientation}
          onChange={orientation => console.log('onChange', orientation)}
          onDeviceChange={orientation =>
            console.log('onDeviceChange', orientation)
          }
        />

        <View
          style={{
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            alignSelf: 'center',
          }}>
          <ZegoTextureView
            ref="zego_preview_view"
            style={{
              flex: 1,
              width: SCREEN_WIDTH,
              alignSelf: 'center',
            }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              justifyContent: 'space-between',
            }}>
            <Header
              rotateScreen={this.rotateScreen}
              cameraBackFrontChange={this.cameraBackFrontChange}
            />
            <RightSidebar updateState={this.updateState} />
            <Footer
              muted={this.state.muted}
              updateState={this.updateState}
              micHandle={this.micHandle}
              startScreenShare={this.startScreenShare}
              stopScreenShare={this.stopScreenShare}
              callEnd={this.callEnd}
            />
          </View>
          <Comments
            sendMessage={this.sendMessage}
            commentsVisible={this.state.commentsVisible}
            updateState={this.updateState}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  commentsData: state.liveClass.commentsData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(LiveClass);
