/*
 * @Author: showtan
 * @Date: 2021-09-23 11:51:04
 * @Version: 1.0
 * @LastEditTime: 2021-09-24 17:36:33
 * @LastEditors: showtan
 * @Description: 
 * @FilePath: /my-app/src/App copy.js
 */

import React, { Component } from 'react';
import './App.css';
import OpenSheetMusicDisplay from './OpenSheetMusicDisplay';
const data = [
  { id: 1, file: 'Beethoven_AnDieFerneGeliebte.xml' },
  { id: 2, file: 'MuzioClementi_SonatinaOpus36No1_Part2.xml' },
  { id: 3, file: '001_敕勒歌_降A.xml' }
];

class App extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    let file = '';
    for (const val of data) {
      val.id === Number(this.getQueryVariable('id')) && (file = val.file);
    }
    this.state = { file }
    console.log('props', this.getQueryVariable('id'), file);
  }

  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) { return pair[1]; }
    }
    return false;
  }

  render() {
    return (
      <div className='App'>
        <OpenSheetMusicDisplay file={this.state.file} />
      </div>
    );
  }
}

export default App;
