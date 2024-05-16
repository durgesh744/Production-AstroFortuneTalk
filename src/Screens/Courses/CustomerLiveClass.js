import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View,
  findNodeHandle,
} from 'react-native';
import React, {Component} from 'react';
import {
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
} from 'zego-express-engine-reactnative';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import MyStatusBar from '../../component/MyStatusBar';
import {Colors} from '../../assets/style';
import Header from '../../component/LiveClass/Header';
import Footer from '../../component/LiveClass/Footer';
import Orientation, {OrientationLocker} from 'react-native-orientation-locker';

const granted =
  Platform.OS == 'android'
    ? PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.RECORD_AUDIO,
      )
    : undefined;

export class CustomerLiveClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveID: 'ram123',
      userID: '1',
      userName: 'Ranjeet',
      muted: false,
      isScreenSharing: false,
      activeOrientation: 'PORTRAIT',
    };
  }

  componentDidMount() {
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
      (roomID, messageList) => {},
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

    ZegoExpressEngine.instance().startPlayingStream(this.state.liveID, {
      reactTag: findNodeHandle(this.refs.zego_play_view),
      viewMode: 1,
      backgroundColor: 0,
    });    

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
      ZegoPublishChannel.Third,
    );
    ZegoExpressEngine.instance().startScreenCapture();
    ZegoExpressEngine.instance().startPublishingStream(
      this.state.liveID,
      ZegoPublishChannel.Third,
    );
  };

  stopScreenShare = () => {
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

  speeckerHandle = () => {

  };

  callEnd = () => {};

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
            ref="zego_play_view"
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
            <Header rotateScreen={this.rotateScreen} />
            <Footer
              muted={this.state.muted}
              updateState={this.updateState}
              micHandle={this.micHandle}
              startScreenShare={this.startScreenShare}
              stopScreenShare={this.stopScreenShare}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default CustomerLiveClass