import * as actionTypes from '../actionTypes';

const initialState = {
  screenType: null,
  chatRequestData: null,
  isActiveDevice: true,
  tarotModalVisible: false, 
  customerModalVisible: false,
  waitingModalVisible: false,
  tarotSelectionModalVisible: false,
  taroatModalVisible: false,
  tarotType: 1,
  taroatCount: 1, 
  numerologyData: null,
  basicKundliData: null,
  kundliDoshaData: null,
  panchangData: null,
  chartData: null,
  recentChatData: null,
  userData: null,
  exitVisible: false,
  chatData: null,
  maxDuration: 0,
  isChatStart: false,
  chatId: null
};

const chat = (state = initialState, actions) => {
  const {payload, type} = actions;

  switch (type) {
    case actionTypes.SET_USER_DATA: {
      return {
        ...state,
        userData: payload,  
      };
    }
    
    case actionTypes.SET_CUSTOMER_MODAL_VISIBLE: {
      return {
        ...state,
        customerModalVisible: payload,
      };
    }
    case actionTypes.SET_WAITING_MODAL_VISIBLE: {
      return {
        ...state,
        waitingModalVisible: payload,
      };
    }

    case actionTypes.SET_SCREEN_TYPE: {
      return {
        ...state,
        screenType: payload,
      };
    }
    case actionTypes.SET_CHAT_REQUEST_DATA: {
      return {
        ...state,
        chatRequestData: payload,
      };
    }
    case actionTypes.SET_EXIT_VISIBELE: {
      return {
        ...state,
        exitVisible: payload,
      };
    }
    case actionTypes.SET_NUMEROLOGY_DATA: {
      return {
        ...state,
        numerologyData: payload,
      };
    }

    case actionTypes.SET_IS_ACTIVE_DEVICE: {
      return {
        ...state,
        isActiveDevice: payload,
      };
    }

    case actionTypes.SET_RECHENT_CHAT_DATA: {
      return {
        ...state,
        recentChatData: payload,
      };
    }
 
    case actionTypes.SET_CHART_DATA: {
      return {
        ...state,
        chartData: payload,
      };
    }

    case actionTypes.SET_CHAT_DATA: {
      return {
        ...state,
        chatData: payload,
      };
    }

    case actionTypes.SET_KUNDLI_BASIC_DATA: {
      return {
        ...state,
        basicKundliData: payload,
      };
    }

    case actionTypes.SET_PUNCHANG_DATA: {
      return {
        ...state,
        panchangData: payload,
      };
    }

    case actionTypes.SET_KUNDLI_DOSHA_DATA: {
      return {
        ...state,
        kundliDoshaData: payload,
      };
    }

    case actionTypes.SET_MAX_DURATION: {
      return {
        ...state,
        maxDuration: payload,
      };
    }

    case actionTypes.SET_IS_CHAT_START: {
      return {
        ...state,
        isChatStart: payload,
      };
    }

    case actionTypes.SET_CHAT_ID: {
      return {
        ...state,
        chatId: payload,
      };
    }

    case actionTypes.SET_TAROAT_MODAL_VISIBLE: {
      return {
        ...state,
        taroatModalVisible: payload,
      };
    }

    case actionTypes.SET_TAROAT_SELECTION_MODAL_VISIBLE: {
      return {
        ...state,
        tarotSelectionModalVisible: payload,
      };
    }

    case actionTypes.RESET_CHAT_STORE: {
      return {
        ...initialState,
        screenType: 'APP_SCREEN'
      };
    }

    default: {
      return state;
    }
  }
};

export default chat;
