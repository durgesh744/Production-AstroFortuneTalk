import React, {useRef} from 'react';
import {LayoutRectangle} from 'react-native';
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';

export const getYoutubeIdFromURL = (url: string): string | undefined => {
  console.log(url)
  const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)?|youtu\.be\/(?:shorts\/)?)([a-zA-Z0-9_-]{11})/;


    
  // Extract video ID from the URL using the regular expressions
  const youtubeId = url.match(youtubeRegex);
  // console.log('sh',youtubeShortsId)
  // Check if there is a match for regular video or Shorts and return the video ID
  if (youtubeId && youtubeId[1]) {
    console.log(url)
    return youtubeId[1];
  }
  return '';
};

type ShortItemProps = {
  index: number;
  visible: boolean;
  playing: boolean;
  paused: boolean;
  url: string;
  layout: LayoutRectangle;
};

function ShortItem({visible, playing, url, layout}: ShortItemProps) {
  const youtubeId = getYoutubeIdFromURL(url);
  const youtubePlayerRef = useRef<YoutubeIframeRef>(null);

  return (
    <YoutubePlayer
      ref={youtubePlayerRef}
      height={layout.height}
      width={layout.width}
      videoId={youtubeId}
      play={playing}
      onChangeState={event => {
        if (event === 'ended' && visible) {
          youtubePlayerRef?.current?.seekTo(0, true);
        }
      }}
      webViewProps={{
        injectedJavaScript: `
          var element = document.getElementsByClassName('container')[0];
          element.style.position = 'unset';
          true;
        `,
      }}
    />
  );
}

export default ShortItem;
