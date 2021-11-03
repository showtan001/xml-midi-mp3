/*
 * @Author: showtan
 * @Date: 2021-09-23 11:50:08
 * @Version: 1.0
 * @LastEditTime: 2021-10-26 11:38:25
 * @LastEditors: showtan
 * @Description: 
 * @FilePath: /my-app/src/OpenSheetMusicDisplay copy.js
 */

import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
// import AudioPlayer from 'osmd-audio-player';
import { Midi } from '@tonejs/midi';
// let audioE = document.createElement("audio");
// let audioE1 = document.createElement("audio");
// audioE.src = "敕勒歌_钢琴.mp3";
// audioE1.src = "敕勒歌_旋律.mp3";
// audioE.src = "004_怀念战友_钢琴.mp3";
// audioE1.src = "004_怀念战友_旋律.mp3";

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.midiHandle();
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.remindRef = React.createRef();
    // this.audioPlayer = new AudioPlayer();
    this.state = { value: 0 }
    this.allCursor = [];
    this.playCursor = 0;
    this.id = 0;
    this.pauseTime = 0;
    this.differenceTime = [];
  }

  midiHandle = async () => {
    // const midi = await Midi.fromUrl('./敕勒歌_MIDI.mid'); // MID file given by the customer
    this.midiData = await Midi.fromUrl('./004_怀念战友_MIDI.mid');
    // console.log('midi time', midi.duration)
    console.log('midi', this.midiData)
    // const midi1 = await Midi.fromUrl('./1.mid'); // Convert 001_敕勒歌_降A.xml to mid format file with Camunda Modeler
    // const midi1 = await Midi.fromUrl('./004_B.mid');
    // console.log('midi1', midi1)
    // console.log('midi1 time', midi1.duration)
  }

  // init
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
      let midiDatas = this.midiData.tracks[0].notes.concat(this.midiData.tracks[1].notes).sort((a, b) => a.time - b.time);
      let midiData = [];
      for (let val of midiDatas) {
        midiData.push({ midi: val.midi, octave: val.octave, time: val.time });
      }
      // array 后期this.midiData需要循环
      console.log('osmd', this.osmd, JSON.parse(JSON.stringify(midiData)));
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
      // all Cursor
      let arr = [];
      const staffEntryContainers = this.osmd.graphic.verticalGraphicalStaffEntryContainers;
      let notMidDelete = []; // xml小节数据（不确定是否删除mid）待下一个xml小节是否匹配成功前还有数据
      for (const index in staffEntryContainers) {
        const values = staffEntryContainers[index];
        // 数组             对象                数组             数组      
        // staffEntries => sourceStaffEntry => voiceEntries => notes => halfTone + 12、(pitch => octave + 3)
        // 上面获取的halfTone和octave与midi中文件midi和octave字段相对应
        let singleCursorXmlNotes = [];
        if (values?.staffEntries) {
          for (const value of values.staffEntries) {
            if (value?.sourceStaffEntry?.voiceEntries) {
              for (const val of value.sourceStaffEntry.voiceEntries) {
                if (val?.notes) {
                  for (const v of val?.notes) {
                    v?.halfTone && singleCursorXmlNotes.push({ midi: v.halfTone + 12, octave: v.pitch.octave + 3 });
                  }
                }
              }
            }
          }
        }
        arr.push(singleCursorXmlNotes);
        // console.log(11, singleCursorXmlNotes)
        let singleCursorMidiNotes = [], sameTimes = 0;
        for (const keys in singleCursorXmlNotes) {
          const val = singleCursorXmlNotes[keys];
          let lastKey = 0;
          for (const key in midiData) {
            const value = midiData[key];
            if ((!lastKey || (key - lastKey < 4))) { // 不能匹配到后面的数据
              Number(index) === 43 && console.log('key1', lastKey, JSON.parse(JSON.stringify(midiData)), sameTimes, val, value, this.allCursor[index - 1]?.time - value.time)
              if (val.midi === value.midi && val.octave === value.octave && (this.allCursor[index - 1]?.time - value.time > -2 || !this.allCursor[index - 1]?.time)) {
                singleCursorMidiNotes.push({ midi: value.midi, time: value.time });
                lastKey = Number(key);
                sameTimes++;
                // 上次xml41小节的最后一个55未与mid中53匹配成功  未删除mid未匹配成功的   下次xml42小节又因为多出一个60
                Number(index) === 43 && console.log('key2', Number(keys), singleCursorXmlNotes, sameTimes)
                if (Number(keys) === singleCursorXmlNotes.length - 1 && !(singleCursorXmlNotes.length - sameTimes)) { // xml小节最后一个音符也匹配成功
                  midiData.splice(0, Number(key) + 1); // 删除小节完全匹配成功后前面的音符
                } else { // 如果没有完成匹配
                  Number(index) === 43 && console.log('key3', JSON.parse(JSON.stringify(midiData)), JSON.parse(JSON.stringify(notMidDelete)), key)
                  if (notMidDelete.length > 0) {
                    for (const midKey in notMidDelete) {
                      for (let i = 0; i < Number(key); i++) {
                        Number(index) === 43 && console.log('key4', midiData[i], notMidDelete, midKey)
                        if (midiData[i]?.midi === notMidDelete[midKey]?.midi) {
                          if (val.midi !== notMidDelete[midKey].midi) {
                            midiData.splice(i, 1);
                          }
                          notMidDelete.splice(midKey, 1);
                        }
                      }
                    }
                  }
                  midiData.splice(key, 1); // 只删除当前项   
                }
                break;
              } else {
                // 当一个小节匹配后，mid中前小节音符数有音符未匹配成功的需删除 如果mid还有多余的  匹配到下一个光标再删除多余
                if (Number(keys) === singleCursorXmlNotes.length - 1) {
                  if (singleCursorXmlNotes.length - sameTimes) { // xml小节有数据未匹配成功 存储mid未与xml匹配成功数据
                    notMidDelete.push({ midi: value.midi, xmlMidi: val.midi });
                    Number(index) === 41 && console.log(123, JSON.parse(JSON.stringify(notMidDelete)));
                  } else { // 全部匹配成功

                  }
                  // console.log(index, value, singleCursorXmlNotes, sameTimes)
                  // midiData.splice(0, singleCursorXmlNotes.length - sameTimes);
                  break;
                }
              }
            }
          }
        }
        // let avgTime = 0;
        // if (singleCursorMidiNotes.length > 0) {
        //   avgTime = singleCursorMidiNotes.reduce((a, b) => a + b) / singleCursorMidiNotes.length;
        // }
        // const allCursorEndTime = this.allCursor[this.allCursor.length - 1].time;
        this.allCursor.push(singleCursorMidiNotes.sort()[0] || { time: 0, midi: 0 });
      }
      console.log(this.allCursor, arr)
      // await this.audioPlayer.loadScore(this.osmd);
      // // this.audioPlayer.setBpm(30)
      window.ReactNativeWebView?.postMessage('loadingEnd');
      // console.log('audioPlayer', this.audioPlayer)
    });
  }

  // Called after render
  componentDidMount() {
    this.setupOsmd();
    window.addEventListener('message', (event) => {
      switch (event.data) {
        case 'render': // xml render
          this.osmd.render();
          break;
        case 'play': // Cursor play
          // this.audioPlayer.play();
          this.play();
          break;
        case 'pause': // Cursor pause
          // this.audioPlayer.pause();
          this.pause();
          break;
        case 'reset': // Cursor reset
          this.reset();
          // this.audioPlayer.stop();
          break;
        case 'show': // Cursor show
          this.osmd.cursor.show();
          break;
        case 'hide': // Cursor hide
          this.osmd.cursor.hide();
          break;
        case 'next': // Cursor hide
          this.nextHandle();
          break;
        default:
          break;
      }
    }, true);
  }

  play1 = () => {
    this.remindRef.current.play();
  }

  play2 = () => {
    // this.audioPlayer.play();
    while (this.id > 0) {
      window.clearTimeout(this.id);
      this.id--;
    }
    this.id = setTimeout(() => {
    }, 1000);
    console.log(this.id);
  }

  handelChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  jumpToStep = () => {
    // this.audioPlayer.jumpToStep(Number(this.state.value));
  }

  nextHandle = () => {
    this.osmd.cursor.next();
  }

  // play
  play = () => {
    // audioE.play(); audioE1.play();
    if (this.playCursor) {
      this.differenceTime.push(this.pauseTime - this.playTime);
      let differenceTime = eval(this.differenceTime.join("+"));
      this.playTime = new Date();
      for (let key in this.allCursor) {
        if (key > this.playCursor) {
          this.id = setTimeout(() => {
            this.osmd.cursor.next();
            this.playCursor++;
          }, Math.round(this.allCursor[key].time * 1000) - differenceTime);
        }
      }
    } else {
      this.playTime = new Date();
      for (let value of this.allCursor) {
        if (value.time) {
          this.id = setTimeout(() => {
            this.osmd.cursor.next();
            this.playCursor++;
          }, Math.round(value.time * 1000));
        }
      }
    }
  }

  // pause
  pause = () => {
    this.pauseTime = new Date();
    // audioE.pause(); audioE1.pause();
    while (this.id > 0) {
      clearTimeout(this.id);
      this.id--;
    }
  }

  // reset
  reset = () => {
    this.osmd.cursor.reset(); this.differenceTime = [];
    // audioE.load(); audioE1.load();
    this.pause(); this.playCursor = 0;
  }

  render() {
    return <>
      <div className='omsd' ref={this.divRef} />
      {/* <audio muted ref={this.remindRef} src="1.mp3" controls="controls" id="audio" /> */}
      {/* <audio muted ref={this.remindRef} src="004_怀念战友_钢琴.mp3" controls="controls" id="audio" /> */}
      {/* <audio muted ref={this.remindRef} src="1.mp3" controls="controls" id="audio1" /> */}
      {/* <div className='div'>
        <button onClick={this.play1}>play mp3</button>
        <button onClick={this.play2}>play xml</button>
        <button onClick={this.midiHandle}>midi parse</button>
        <input type="number" onChange={this.handelChange} defaultValue={this.state.value} />
        <button onClick={this.jumpToStep}>jump to step</button>
        <button onClick={this.nextHandle}>next step</button>
      </div> */}
      <div className='div'>
        <button onClick={this.play}>播放</button>
        <button onClick={this.pause}>暂停</button>
        <button onClick={this.reset}>重置</button>
        <button onClick={this.nextHandle}>下一个</button>
      </div>
    </>
  }
}

export default OpenSheetMusicDisplay;
