import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as ChatActions from '../../redux/actions/ChatActions';

const CountDown = ({duration, isActive, dispatch}) => {
  const [timer, setTimer] = useState(duration);
  useEffect(() => {
    setTimer(duration);
  }, [duration]);
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prevState => {
          if (prevState > 0) {
            return prevState - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, duration]);

  const formatTime = leftTime => {
    const seconds = parseFloat(leftTime).toFixed(0);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if needed
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    remainingSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  return <Text>{formatTime(timer)}</Text>;
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CountDown);
