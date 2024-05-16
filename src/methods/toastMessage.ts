import { ToastAndroid, Platform } from "react-native";
 
export const showToastWithGravityAndOffset = (text: string) => {
  if(Platform.OS == 'android'){
    ToastAndroid.showWithGravityAndOffset(
      text,
      200,
      20,
      25,
      10,
    );
  }else{
    
  }
 
  };

