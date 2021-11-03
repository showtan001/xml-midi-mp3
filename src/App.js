/*
 * @Author: showtan
 * @Date: 2021-09-23 11:51:04
 * @Version: 1.0
 * @LastEditTime: 2021-11-02 10:45:33
 * @LastEditors: showtan
 * @Description: 
 * @FilePath: /my-app/src/App.js
 */

import React from 'react';
import './App.css';
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay';

const App = () => {
  const data = [
    {
      id: 1,
      name: '怀恋战友',
      midi: './1.mid',
      xml: '1.xml'
    },
    {
      id: 2,
      name: '敕勒歌',
      midi: './2.mid',
      xml: '2.xml'
    },
    {
      id: 3,
      name: '跟着你到天边',
      midi: './3.mid',
      xml: '3.xml'
    },
    {
      id: 4,
      name: '红旗颂',
      midi: './4.mid',
      xml: '4.xml'
    },
    {
      id: 5,
      name: '九儿',
      midi: './5.mid',
      xml: '5.xml'
    }
  ];
  const index = Number(window.location.search.substring(1).split('=')[1]) - 1 || 0;

  return <div className='App'>
    {/* <OpenSheetMusicDisplay file='004_怀念战友_降B.xml' /> */}
    {/* <OpenSheetMusicDisplay file='001_敕勒歌_降A.xml' /> */}
    <OpenSheetMusicDisplay midi={data[index].midi} file={data[index].xml} />
  </div>
}

export default React.memo(App, () => {
  return true;
});
