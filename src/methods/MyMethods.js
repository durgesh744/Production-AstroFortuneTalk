import AsyncStorage from '@react-native-async-storage/async-storage';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment';

class _MyMethods {

  add_uid_in_firebase = async ({
    userId = null,
    uid = '',
    data = null,
    fcmToekn = null, 
  }) => {
    try {
      await AsyncStorage.setItem('FirebaseId', uid.toString());
      database().ref(`/AstroId/${userId}`).set(uid);
      database().ref(`/Users/${uid}`).set({
        date: new Date().getTime(),
        email: data?.email,
        image: data?.img_url,
        name: data?.owner_name,
        token: fcmToekn,
        type: 'astro',
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  create_firebase_account = async ({
    userId = null,
    userAccount = null,
    data = null,
    fcmToekn = null,
  }) => {
    try {
      const result = await auth().createUserWithEmailAndPassword(
        `${userAccount}`,
        '12345678',
      );
      if (result) {
        return await this.add_uid_in_firebase({
          userId: userId,
          uid: result.user.uid,
          data,
          fcmToekn: fcmToekn,
        });
      }
    } catch (e) {
      console.log(e);
      const result = await auth().signInWithEmailAndPassword(
        `${userAccount}`,
        '12345678',
      );
      return this.add_uid_in_firebase({
        userId: userId,
        uid: result.user.uid,
        data,
        fcmToekn: fcmToekn,
      });
    }
  };

  get_calender_months = () => {
    const today = new Date();
    //const yesterday = new Date();
              const yesterday = new Date(today); 
              yesterday.setDate(today.getDate() - 1);
              console.log(yesterday);
    const months = [];

    // Add current month
    months.push({
      label: 'Today',
      value: today.toISOString().split('T')[0],
    });
    months.push({
      label: 'Yesterday',
      value: yesterday.toISOString().split('T')[0],
    });
    months.push({
      label: 'Custom',
      value: 'custom',
    });

    for (let i = 1; i <= 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
      }).format(nextMonth);

      months.push({
        label: monthName,
        value: nextMonth.toISOString().split('T')[0],
      });
    }

    // Add custom month (e.g., 7 months from today)

    return months;
  };

  check_current_day = ({date = new Date(), type = 'equal'}) => {
    try {
      const targetDate = new Date(moment(date).format('YYYY-MM-DD'));
      const today = new Date();
      if (type == 'equal') {
        if (
          targetDate.getDate() === today.getDate() &&
          targetDate.getMonth() === today.getMonth() &&
          targetDate.getFullYear() === today.getFullYear()
        ) {
          return true;
        }
        return false;
      } else if (type == 'greater') {
        if (
          targetDate.getDate() <= today.getDate() &&
          targetDate.getMonth() <= today.getMonth() &&
          targetDate.getFullYear() <= today.getFullYear()
        ) {
          return true;
        }
        return false;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  generateUniqueId = () => {
    const timestamp = Date.now().toString(16); // Convert current timestamp to hexadecimal
    const randomString = Math.random().toString(16).substr(2, 8); // Generate a random hexadecimal string

    // Combine timestamp and random string, and ensure it is 16 characters long
    const uniqueId = (timestamp + randomString).substr(0, 16);

    return uniqueId;
  }
  

}

export const MyMethods = new _MyMethods();
