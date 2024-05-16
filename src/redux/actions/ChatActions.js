import * as actionTypes from '../actionTypes';

export const setCustomerFirebaseId = payload => ({
  type: actionTypes.SET_CUSTOMER_FIREBASE_ID,
  payload,
});

export const setAstroFirebaseId = payload => ({
  type: actionTypes.SET_ASTRO_FIREBASE_ID,
  payload,
});

export const setScreenType = payload => ({
  type: actionTypes.SET_SCREEN_TYPE,
  payload,
});

export const setChatRequestData = payload => ({
  type: actionTypes.SET_CHAT_REQUEST_DATA,
  payload,
});

export const setIsActiveDevice = payload => ({
  type: actionTypes.SET_IS_ACTIVE_DEVICE,
  payload,
});

export const setUserData = payload => ({
  type: actionTypes.SET_USER_DATA,
  payload,
});

export const getUserData = payload => ({
  type: actionTypes.GET_USER_DATA,
  payload,
});

export const setChatData = payload => ({
  type: actionTypes.SET_CHAT_DATA,
  payload,
});

export const getChatData = payload => ({
  type: actionTypes.GET_CHAT_DATA,
  payload,
});

export const setTaroatModalVisible = payload => ({
  type: actionTypes.SET_TAROAT_MODAL_VISIBLE,
  payload,
});

export const setTaroatCount = payload => ({
  type: actionTypes.SET_TAROAT_COUNT,
  payload,
});

export const setTaroatSelectionModalVisible = payload => ({
  type: actionTypes.SET_TAROAT_SELECTION_MODAL_VISIBLE,
  payload,
});

export const setTaroatType = payload => ({
  type: actionTypes.SET_TAROAT_TYPE,
  payload,
});

export const setCustomerModalVisible = payload => ({
  type: actionTypes.SET_CUSTOMER_MODAL_VISIBLE,
  payload,
});

export const setWaitingModalVisible = payload => ({
  type: actionTypes.SET_WAITING_MODAL_VISIBLE,
  payload,
});

export const setNumerologyData = payload => ({
  type: actionTypes.SET_NUMEROLOGY_DATA,
  payload,
});

export const getNumerologyData = payload => ({
  type: actionTypes.GET_NUMEROLOGY_DATA,
  payload,
});

export const setKundliBasicData = payload => ({
  type: actionTypes.SET_KUNDLI_BASIC_DATA,
  payload,
});

export const getKundliBasicData = payload => ({
  type: actionTypes.GET_KUNDLI_BASIC_DATA,
  payload,
});

export const setKundliDoshaData = payload => ({
  type: actionTypes.SET_KUNDLI_DOSHA_DATA,
  payload,
});

export const setPunchangData = payload => ({
  type: actionTypes.SET_PUNCHANG_DATA,
  payload,
});

export const setChartData = payload => ({
  type: actionTypes.SET_CHART_DATA,
  payload,
});

export const setRechentChatData = payload => ({
  type: actionTypes.SET_RECHENT_CHAT_DATA,
  payload,
});

export const getRechentChatData = payload => ({
  type: actionTypes.GET_RECHENT_CHAT_DATA,
  payload,
});

export const endChatInFirebase = payload => ({
  type: actionTypes.END_CHAT_IN_FIREBASE,
  payload,
});

export const setExitVisible = payload => ({
  type: actionTypes.SET_EXIT_VISIBELE,
  payload,
});

export const onResetChat = payload => ({
  type: actionTypes.ON_RESET_CHAT,
  payload,
});

export const onDeductWallet = payload => ({
  type: actionTypes.ON_DEDUCT_WALLET,
  payload,
});

export const setMaxDuration = payload => ({
  type: actionTypes.SET_MAX_DURATION,
  payload,
});

export const setIsChatStart = payload => ({
  type: actionTypes.SET_IS_CHAT_START,
  payload,
});

export const setChatId = payload => ({
  type: actionTypes.SET_CHAT_ID,
  payload,
});

export const sendMessages = payload => ({
  type: actionTypes.SEND_MESSAGES,
  payload,
});

export const sendVoiceMessage = payload => ({
  type: actionTypes.SEND_VOICE_MESSAGE,
  payload,
});

export const sendImage = payload => ({
  type: actionTypes.SEND_IMAGE,
  payload,
});

export const addMessage = payload => ({
  type: actionTypes.ADD_MESSAGE,
  payload,
})

export const resetChatStore = payload => ({
  type: actionTypes.RESET_CHAT_STORE,
  payload,
})

