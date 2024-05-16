import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Home from '../Screens/Home/Home';
import ChatScreen from '../Screens/ChatScreen';
import MyHeader from '../component/MyHeader';
import AcceptCall from '../Screens/AcceptCall';
import AcceptChat from '../Screens/AcceptChat';
import OnCall from '../Screens/OnCall';
import HostPage from '../Screens/HostPage';
import AudiencePage from '../Screens/AudiencePage';
import WalletHistory from '../Screens/History/WalletHistory';
import WaitList from '../Screens/WaitList';
import LiveEvent from '../Screens/LiveEvent';
import SupportChat from '../Screens/SupportChat';
import ReviwList from '../Screens/ReviwList';
import Followers from '../Screens/Followers';
import Offer from '../Screens/Offer';
import Settings from '../Screens/Settings';
import Remedy from '../Screens/Remedy';
import Profile from '../Screens/Profile';
import SuggestRemdies from '../Screens/SuggestRemdies';
// import SelectTarot from '../Screens/Tarot/SelectTarot';
import GoLive from '../Screens/GoLive';
import AddRemedy from '../Screens/Remedy/AddRemedy';
import Astromall from '../Screens/ECommerce/Astromall';
import BookPooja from '../Screens/ECommerce/BookPooja';
import PoojaDetails from '../Screens/ECommerce/PoojaDetails';
import RegisterPooja from '../Screens/ECommerce/RegisterPooja';
import SceduledList from '../Screens/ECommerce/SceduledList';
import BookingDetailes from '../Screens/ECommerce/BookingDetailes';
import UploadEcommerce from '../Screens/ECommerce/UploadEcommerce';
import PoojaHistory from '../Screens/ECommerce/PoojaHistory';
import HistoryDetails from '../Screens/ECommerce/HistoryDetails';
import PoojaAstrologer from '../Screens/ECommerce/PoojaAstrologer';
import CourseList from '../Screens/Courses/CourseList';
import AddCourseDetails from '../Screens/Courses/AddCourseDetails';
import DemoClassDetails from '../Screens/Courses/DemoClassDetails';
import LiveClassDetails from '../Screens/Courses/LiveClassDetails';
import PhotoGallery from '../Screens/PhotoGallery';
import UpdateNumber from '../Screens/UpdateNumber';
import UpdateBankDetails from '../Screens/UpdateBankDetails';
import DownloadForm16A from '../Screens/DownloadForm16A';
import ReferAnAstrologer from '../Screens/ReferAnAstrologer';
import PoojaList from '../Screens/ECommerce/PoojaList';
import SuggestedPoojaDetails from '../Screens/ECommerce/SuggestedPoojaDetails';
import Products from '../Screens/ECommerce/Products';
import ProductDetailes from '../Screens/ECommerce/ProductDetailes';
import LiveClass from '../Screens/Courses/LiveClass';
import CallHistory from '../Screens/History/CallHistory';
import ChatHistory from '../Screens/History/ChatHistory';
import AstromallHistory from '../Screens/AstromallHistory';
import UserKundli from '../Screens/Kundli/UserKundli';
import Numerolgy from '../Screens/Kundli/Numerolgy';
import CallTarot from '../Screens/Tarot/CallTarot';
import CustomerLiveClass from '../Screens/Courses/CustomerLiveClass';
import Reels from '../Screens/Shorts/Reels';
import DemoClassCreated from '../Screens/Courses/DemoClassCreated';
import LiveClassCreated from '../Screens/Courses/LiveClassCreated';
import ClassHistory from './ClassHistory';
import SupportChatScreen from '../Screens/SupportChatScreen';
import Privacy from '../Screens/Privacy';
import Terms from '../Screens/Terms';
import Performance from '../Screens/Performance';
import ForgetPassword from '../Screens/ForgetPassword';
import ChatSummary from '../Screens/History/ChatSummary';
import IncommingChat from '../../IncommingChat';
import PriceChange from '../Screens/PriceChange';
import PriceChangeRequest from '../Screens/PriceChangeRequest';
import ChatKundli from '../Screens/Kundli/ChatKundli';
// import KundliInfo from '../Screens/Kundli/KundliInfo';
import SelectTaroat from '../Screens/Tarot/SelectTaroat';
import KundliCategory from '../Screens/Kundli/KundliInfo';

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="chatKundli" component={ChatKundli} />
      <Stack.Screen name="MyHeader" component={MyHeader} />
      <Stack.Screen name="chatHistory" component={ChatHistory} />
      <Stack.Screen name="callHistory" component={CallHistory} />
      <Stack.Screen name="AstromallHistory" component={AstromallHistory} />
      <Stack.Screen name="acceptCall" component={AcceptCall} />
      <Stack.Screen name="acceptChat" component={AcceptChat} />
      <Stack.Screen name="incommingChat" component={IncommingChat} />
      <Stack.Screen name="OnCall" component={OnCall} />
      <Stack.Screen name="hostPage" component={HostPage} />
      <Stack.Screen name="audiencePage" component={AudiencePage} />
      <Stack.Screen name="walletHistory" component={WalletHistory} />
      <Stack.Screen name="waitList" component={WaitList} />
      <Stack.Screen name="LiveEvent" component={LiveEvent} />
      <Stack.Screen name="SupportChat" component={SupportChat} />
      <Stack.Screen name="ReviwList" component={ReviwList} />
      <Stack.Screen name="Followers" component={Followers} />
      <Stack.Screen name="Offer" component={Offer} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Remedy" component={Remedy} />
      <Stack.Screen name="addRemedy" component={AddRemedy} />
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="SuggestRemdies" component={SuggestRemdies} />
      {/* <Stack.Screen name="selectTarot" component={SelectTarot} /> */}
      <Stack.Screen name="goLive" component={GoLive} />
      <Stack.Group>
        <Stack.Screen name="astromall" component={Astromall} />
        <Stack.Screen name="poojaList" component={PoojaList} />
        <Stack.Screen name="poojaDetails" component={PoojaDetails} />
        <Stack.Screen name="products" component={Products} />
        <Stack.Screen name="productDetailes" component={ProductDetailes} />
        <Stack.Screen name="registerPooja" component={RegisterPooja} />
        <Stack.Screen name="sceduledList" component={SceduledList} />
        <Stack.Screen name="bookingDetailes" component={BookingDetailes} />
        <Stack.Screen name="uploadEcommerce" component={UploadEcommerce} />
        <Stack.Screen name="poojaHistory" component={PoojaHistory} />
        <Stack.Screen name="historyDetails" component={HistoryDetails} />
        <Stack.Screen name="bookPooja" component={BookPooja} />
        <Stack.Screen name="poojaAstrologer" component={PoojaAstrologer} />
        <Stack.Screen
          name="suggestedPoojaDetails"
          component={SuggestedPoojaDetails}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="courseList" component={CourseList} />
        <Stack.Screen name="addCourseDetails" component={AddCourseDetails} />
        <Stack.Screen name="demoClassCreated" component={DemoClassCreated} />
        <Stack.Screen name="liveClassCreated" component={LiveClassCreated} />
        <Stack.Screen name="demoClassDetails" component={DemoClassDetails} />
        <Stack.Screen name="liveClassDetails" component={LiveClassDetails} />
        <Stack.Screen name="liveClass" component={LiveClass} />
        <Stack.Screen name="classHistory" component={ClassHistory} />
      </Stack.Group>
      <Stack.Screen name="photoGallery" component={PhotoGallery} />
      <Stack.Screen name="updateNumber" component={UpdateNumber} />
      <Stack.Screen name="updateBankDetails" component={UpdateBankDetails} />
      <Stack.Screen name="downloadForm16A" component={DownloadForm16A} />
      <Stack.Screen name="referAnAstrologer" component={ReferAnAstrologer} />
      <Stack.Group>
        <Stack.Screen name="numerology" component={Numerolgy} />
        <Stack.Screen name="userKundli" component={UserKundli} />
        <Stack.Screen name="CallTarot" component={CallTarot} />
        <Stack.Screen name="kundliInfo" component={KundliCategory} />
        <Stack.Screen name="selectTaroat" component={SelectTaroat} />
      </Stack.Group>
      <Stack.Screen name="customerLiveClass" component={CustomerLiveClass} />
      <Stack.Screen name="reels" component={Reels} />
      <Stack.Screen name="supportChatScreen" component={SupportChatScreen} />
      <Stack.Screen name="privacy" component={Privacy} />
      <Stack.Screen name="terms" component={Terms} />
      <Stack.Screen name="performance" component={Performance} />
      <Stack.Screen name="chatSummary" component={ChatSummary} />
      <Stack.Screen name="priceChange" component={PriceChange} />
      <Stack.Screen name="priceRequest" component={PriceChangeRequest} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
