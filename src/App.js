/*
 * @Author: showtan
 * @Date: 2021-09-23 11:51:04
 * @Version: 1.0
 * @LastEditTime: 2021-09-28 10:55:02
 * @LastEditors: showtan
 * @Description: 
 * @FilePath: /my-app/src/App.js
 */

import React, { useEffect } from 'react';
import './App.css';
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay';

const App = () => {

  useEffect(() => {
    let audioE = document.createElement("audio"); // 获取时长
    audioE.src = "敕勒歌_钢琴.mp3";
    // audioE.src = "004_怀念战友_钢琴.mp3";
    audioE.load();
    audioE.oncanplay = function () {
      setTimeout(() => {
        console.log('mp3 all times', audioE.duration);
      }, 1500);
    }
  }, [])

  return <div className='App'>
    <OpenSheetMusicDisplay file='001_敕勒歌_降A.xml' />
    {/* <OpenSheetMusicDisplay file={window.location.search.substring(1).split('=')[1]} /> */}
  </div>
}

export default React.memo(App, () => {
  return true;
});
