import * as actionTypes from '../actionTypes';
import database from '@react-native-firebase/database';
import * as ChatActions from '../actions/ChatActions';
import {blobRequest, postRequest} from '../../utils/apiRequests';
import {takeLeading, put, call, select} from 'redux-saga/effects';
import {
  api2_get_profile,
  api_url,
  chat_history_astro,
  customer_kundli_chart,
  deductwallet_chat,
  kundli_basic_details,
  kundli_dosha,
  kundli_get_panchang,
  kundli_numerology_detailes,
  upload_voice_image_pdf,
} from '../../config/Constants';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import {MyMethods} from '../../methods/MyMethods';
import {resetToScreen} from '../../navigation/NavigationServices';
import {GiftedChat} from 'react-native-gifted-chat';

function getDuration(totalDuration, time) {
  const currentTime = new Date().getTime();
  const startTime = new Date(time).getTime();
  const diffTime = (currentTime - startTime) / 1000;
  const duration = totalDuration - parseInt(diffTime);
  if (duration < 0) {
    return 0;
  } else {
    return duration;
  }
}

function* getChatData(actions) {
  try {
    const {dispatch} = actions.payload;
    const providerData = yield select(state => state.provider.providerData);
    const chatRequestData = yield select(state => state.chat.chatRequestData);
    const chat_id = `customer${chatRequestData?.user_id}+astro${providerData.id}`;
    yield put({type: actionTypes.SET_CHAT_ID, payload: chat_id});

    database()
      .ref(`CustomerCurrentRequest/${chatRequestData?.user_id}`)
      .on('value', snapshot => {
        if (snapshot.val()?.status == 'End') {
          resetToScreen('home');
        }
      });

    const messagesRef = yield database()
      .ref(`/Messages/${chat_id}`)
      .orderByChild('createdAt');

    messagesRef.on('value', dataSnapshot => {
      const messages = [];
      dataSnapshot.forEach(childSnapshot => {
        const message = childSnapshot.val();
        // if (!message.received && message.senderId === route?.params?.astroFirebaseID) {
        //   updateMessageStatus(childSnapshot.key);
        // }
        messages.push({...message});
      });

      dispatch(ChatActions.setChatData(messages.reverse()));
    });

    database()
      .ref(`CustomerCurrentRequest/${chatRequestData?.user_id}`)
      .on('value', snapshot => {
        if (
          snapshot.val()?.status == 'active' &&
          snapshot.val()?.minutes &&
          snapshot.val()?.startTime
        ) {
          const duration = getDuration(
            snapshot.val()?.minutes,
            snapshot.val()?.startTime,
          );
          dispatch(ChatActions.setMaxDuration(duration));
          dispatch(ChatActions.setIsChatStart(true));
        } else {
          dispatch(ChatActions.setIsChatStart(false));
        }
      });

    yield put({
      type: actionTypes.GET_NUMEROLOGY_DATA,
      payload: chatRequestData?.user_id,
    });
    yield put({
      type: actionTypes.GET_USER_DATA,
      payload: chatRequestData?.user_id,
    });
    yield put({
      type: actionTypes.GET_RECENT_CHAT_DATA,
      payload: providerData?.id,
    });
  } catch (e) {
    console.log(e);
  }
}

function* onResetChat() {
  try {
    const providerData = yield select(state => state.provider.providerData);
    const userData = yield select(state => state.chat.userData);
    const chatRequestData = yield select(state => state.chat.chatRequestData);
    const chat_id = `customer${userData?.user_id}+astro${providerData.id}`;

    yield database()
      .ref(`CustomerCurrentRequest/${chatRequestData?.user_id}`)
      .off();
    yield database().ref(`CurrentRequest/${providerData?.id}`).off();
    yield put({type: actionTypes.RESET_CHAT_STORE, payload: null});
  } catch (e) {
    console.log(e);
  }
}

function* getKundliBasicData(actions) {
  try {
    const {payload} = actions;

    const basicKundli = yield postRequest({
      url: api_url + kundli_basic_details,
      header: 'form',
      data: {
        user_id: payload,
      },
    });

    const punchang = yield postRequest({
      url: api_url + kundli_get_panchang,
      header: 'form',
      data: {
        user_id: payload,
      },
    });

    const kundliChart = yield postRequest({
      url: api_url + customer_kundli_chart,
      header: 'form',
      data: {
        user_id: payload,
        chartid: 'D1',
      },
    });

    const kundliDosha = yield postRequest({
      url: api_url + kundli_dosha,
      header: 'form',
      data: {
        user_id: payload,
      },
    });

    yield put({
      type: actionTypes.SET_KUNDLI_BASIC_DATA,
      payload: basicKundli,
    });
    yield put({
      type: actionTypes.SET_PUNCHANG_DATA,
      payload: punchang,
    });
    yield put({
      type: actionTypes.SET_CHART_DATA,
      payload: kundliChart?.svg_code,
    });
    yield put({
      type: actionTypes.SET_KUNDLI_DOSHA_DATA,
      payload: kundliDosha,
    });
  } catch (e) {
    console.log(e);
  }
}

function* getRechentChatData(actions) {
  try {
    const {payload} = actions;

    const response = yield postRequest({
      url: api_url + chat_history_astro,
      header: 'form',
      data: {
        astro_id: payload,
      },
    });

    if (response?.status) {
      yield put({
        type: actionTypes.SET_RECHENT_CHAT_DATA,
        payload: response?.data.reverse(),
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getNumerologyData(actions) {
  try {
    const {payload} = actions;

    const response = yield postRequest({
      url: api_url + kundli_numerology_detailes,
      header: 'form',
      data: {
        user_id: payload,
      },
    });

    if (response?.status) {
      yield put({
        type: actionTypes.SET_NUMEROLOGY_DATA,
        payload: response?.getNumeroTable,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* getUserData(actions) {
  try {
    const {payload} = actions;
    const response = yield postRequest({
      url: api_url + api2_get_profile,
      header: 'form',
      data: {
        user_id: payload,
      },
    });

    if (response?.status) {
      yield put({
        type: actionTypes.SET_USER_DATA,
        payload: response?.user_details[0],
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* sendImage(actions) {
  try {
    const {imageUri, fileName, message} = actions.payload;
    const response = yield blobRequest({
      url: api_url + upload_voice_image_pdf,
      data: [
        {
          name: 'image_file',
          filename: `${fileName}`,
          type: 'jpg/png',
          data: RNFetchBlob.wrap(imageUri),
        },
      ],
    });

    if (response?.data) {
      const sendMessage = {
        ...message,
        image: response.data,
      };

      yield put({type: actionTypes.SEND_MESSAGES, payload: sendMessage});
    }
  } catch (e) {
    console.log('hii', e);
  }
}

function* sendVoiceMessage(actions) {
  try {
    const {data, message} = actions.payload;
    const response = yield blobRequest({
      url: api_url + upload_voice_image_pdf,
      data: data,
    });

    if (response?.data) {
      const sendMessage = {
        ...message,
        voice: response.data,
      };

      yield put({type: actionTypes.SEND_MESSAGES, payload: sendMessage});
    }
  } catch (e) {
    console.log('hii', e);
  }
}

function* sendMessages(actions) {
  try {
    const {payload} = actions;
    const chatId = yield select(state => state.chat.chatId);
    const node = database().ref(`/Messages/${chatId}`).push();
    const key = node.key;
    database()
      .ref(`/Messages/${chatId}/${key}`)
      .set({
        ...payload,
        createdAt: new Date().getTime(),
        addedAt: database.ServerValue.TIMESTAMP,
        sent: true
      });
  } catch (e) {
    console.log(e);
  }
}

async function getFirebaseData(path) {
  try {
    const response = (await database().ref(path).once('value')).val();
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function* onDeductWallet(actions) {
  try {
    const {payload} = actions;
    yield put({type: actionTypes.SET_EXIT_VISIBELE, payload: false});
    const chatRequestData = yield select(state => state.chat.chatRequestData);
    const providerData = yield select(state => state.provider.providerData);
    const invoiceId = yield getFirebaseData(
      `/CustomerCurrentRequest/${chatRequestData?.user_id}/trans_id`,
    );
    const startTime = yield getFirebaseData(
      `/CustomerCurrentRequest/${chatRequestData?.user_id}/startTime`,
    );
    const chatId = yield getFirebaseData(
      `/CustomerCurrentRequest/${chatRequestData?.user_id}/chat_id`,
    );

    const duration =
      (new Date().getTime() - new Date(startTime).getTime()) / 1000;

    const response = yield postRequest({
      url: api_url + deductwallet_chat,
      data: {
        user_id: chatRequestData.user_id,
        astro_id: providerData.id,
        chat_id: chatRequestData?.booking_id,
        start_time: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
        duration: parseInt(duration),
        invoice_id: invoiceId,
        chat_id: chatId,
      },
    });

    if (response?.status == 1) {
      const messages = {
        _id: yield call(MyMethods.generateUniqueId),
        text: 'Astrologer ended chat',
        type: 'text',
        data: null,
        createdAt: new Date().getTime(),
        user: {
          _id: `astro${providerData?.id}`,
          name: '',
          // avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: false,
        // Mark the message as pending with a clock loader
        pending: false,
        // Any additional custom parameters are passed through
      };

      const astroRef = database().ref(
        `/CustomerCurrentRequest/${chatRequestData?.user_id}`,
      );
      yield put({type: actionTypes.SEND_MESSAGES, payload: messages});
      astroRef.update({
        status: 'EndbyAstrologer',
        invoiceData: response?.data,
        startTime: '',
        trans_id: '',
        chat_id: '',
        minutes: '',
        moa: '',
      });
      database()
        .ref(`CurrentRequest/${providerData?.id}`)
        .update({status: 'End'});
      yield call(resetToScreen, 'home');
    }
  } catch (e) {
    console.log('hii', e);
  }
}

function* addMessage(actions) {
  try {
    const {payload} = actions;
    const chatData = yield select(state => state.chat.chatData);
    yield put({
      type: actionTypes.SET_CHAT_DATA,
      payload: GiftedChat.append(chatData, payload),
    });
  } catch (e) {
    console.log(e);
  }
}

export default function* chatSaga() {
  yield takeLeading(actionTypes.GET_CHAT_DATA, getChatData);
  yield takeLeading(actionTypes.ON_RESET_CHAT, onResetChat);
  yield takeLeading(actionTypes.ON_DEDUCT_WALLET, onDeductWallet);
  yield takeLeading(actionTypes.GET_KUNDLI_BASIC_DATA, getKundliBasicData);
  yield takeLeading(actionTypes.GET_RECENT_CHAT_DATA, getRechentChatData);
  yield takeLeading(actionTypes.GET_NUMEROLOGY_DATA, getNumerologyData);
  yield takeLeading(actionTypes.GET_USER_DATA, getUserData);
  yield takeLeading(actionTypes.SEND_IMAGE, sendImage);
  yield takeLeading(actionTypes.SEND_VOICE_MESSAGE, sendVoiceMessage);
  yield takeLeading(actionTypes.SEND_MESSAGES, sendMessages);
  yield takeLeading(actionTypes.ADD_MESSAGE, addMessage);
}
