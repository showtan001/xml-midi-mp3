/*
 * @Author: showtan
 * @Date: 2021-09-23 11:50:08
 * @Version: 1.0
 * @LastEditTime: 2021-09-28 10:56:32
 * @LastEditors: showtan
 * @Description: 
 * @FilePath: /my-app/src/OpenSheetMusicDisplay.js
 */

import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import AudioPlayer from 'osmd-audio-player';
import { Midi } from '@tonejs/midi';

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.remindRef = React.createRef();
    this.audioPlayer = new AudioPlayer();
    // this.midiHandle();
    this.state = { value: 0 }
  }

  midiHandle = async () => {
    const midi = await Midi.fromUrl('./敕勒歌_MIDI.mid');
    // const midi = await Midi.fromUrl('./004_怀念战友_MIDI.mid');
    console.log('midi', midi)
  }

  // 初始化
  setupOsmd = async () => {
    this.osmd = new OSMD(this.divRef.current, { autoResize: false, followCursor: true });
    this.osmd.load(this.props.file).then(() => {
      // this.osmd.graphic.measureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      // this.osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      // this.osmd.graphic.measureList[1][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      // this.osmd.graphic.measureList[0][0].staffEntries[1].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      this.osmd.zoom = 0.5;
      return this.osmd.render();
    }).then(async () => {
      this.osmd.cursor.show();
      console.log('osmd', this.osmd)
      let allNotes = [];
      const iterator = this.osmd.cursor.Iterator;
      while (!iterator.EndReached) {
        const voices = iterator.CurrentVoiceEntries;
        for (let i = 0; i < voices.length; i++) {
          const v = voices[i];
          const notes = v.Notes;
          for (let j = 0; j < notes.length; j++) {
            const note = notes[j];
            // make sure our note is not silent
            if ((note != null) && (note.halfTone !== 0)) {
              allNotes.push({
                'note': note.halfTone + 12, // see issue #224
                'time': iterator.currentTimeStamp.RealValue * 4
              })
            }
          }
        }
        iterator.moveToNext();
      }
      console.log('allNotes', allNotes)
      console.log('BPM', this.osmd.Sheet.userStartTempoInBPM)
      await this.audioPlayer.loadScore(this.osmd);
      this.audioPlayer.setBpm(this.osmd.Sheet.userStartTempoInBPM)
      window.ReactNativeWebView?.postMessage('loadingEnd_' + this.audioPlayer.iterationSteps);
      console.log('audioPlayer', this.audioPlayer)
    });
  }

  // Called after render
  componentDidMount() {
    this.setupOsmd();
    window.addEventListener('message', (event) => {
      switch (event.data) {
        case 'render': // xml刷新
          this.osmd.render();
          break;
        case 'play': // 光标播放
          this.audioPlayer.play();
          break;
        case 'pause': // 光标暂停
          this.audioPlayer.pause();
          break;
        case 'stop': // 光标重置
          this.audioPlayer.stop();
          break;
        case 'show': // 光标显示
          this.osmd.cursor.show();
          break;
        case 'hide': // 光标隐藏
          this.osmd.cursor.hide();
          break;
        default:
          break;
      }
    }, false);
  }

  play1 = () => {
    this.remindRef.current.play();
  }

  play2 = () => {
    this.audioPlayer.play();
  }

  handelChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  jumpToStep = () => {
    this.audioPlayer.jumpToStep(Number(this.state.value));
  }

  nextHandle = () => {
    this.osmd.cursor.next();
  }

  render() {
    return <>
      <div className='omsd' ref={this.divRef} />
      <audio muted ref={this.remindRef} src="敕勒歌_钢琴.mp3" controls="controls" id="audio" />
      {/* <audio muted ref={this.remindRef} src="004_怀念战友_钢琴.mp3" controls="controls" id="audio" /> */}
      <div className='div'>
        <button onClick={this.play1}>play mp3</button>
        <button onClick={this.play2}>play xml</button>
        <button onClick={this.midiHandle}>midi parse</button>
        <input type="number" onChange={this.handelChange} defaultValue={this.state.value} />
        <button onClick={this.jumpToStep}>jump to step</button>
        <button onClick={this.nextHandle}>next step</button>
      </div>
    </>
  }
}

export default OpenSheetMusicDisplay;
