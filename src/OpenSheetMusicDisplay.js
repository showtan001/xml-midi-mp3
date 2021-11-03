/*
 * @Author: showtan
 * @Date: 2021-09-23 11:50:08
 * @Version: 1.0
 * @LastEditTime: 2021-11-03 13:53:56
 * @LastEditors: showtan
 * @Description: 
 * @FilePath: /my-app/src/OpenSheetMusicDisplay.js
 */

import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import AudioPlayer from 'osmd-audio-player';
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
    this.audioPlayer = new AudioPlayer();
    this.state = { value: 0 }
    this.allCursor = [];
    this.playCursor = 0;
    this.id = 0;
    this.pauseTime = 0;
    this.differenceTime = [];
    this.midXmlAllTimeRatio = 1;
    this.isRepeat = false;
  }

  midiHandle = async () => {
    // const midi = await Midi.fromUrl('./敕勒歌_MIDI.mid'); // MID file given by the customer
    this.midiData = await Midi.fromUrl(this.props.midi);
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
    this.handerTime = []; this.copyNotes = []; let repeat = 0;
    
    this.handerTime = [
      { midi: 46, time: 0 },
      { midi: 65, time: 0.5135416666666667 },
      { midi: 53, time: 0.735416666666666 },
      { midi: 58, time: 0.9916666666666667 },
      { midi: 53, time: 1.459375 },
      { midi: 46, time: 2.03 },
      { midi: 53, time: 2.76875 },
      { midi: 72, time: 2.7708333333333335 },
      { midi: 58, time: 3.0364583333333335 },
      { midi: 53, time: 3.490625 }, // 10
      { midi: 46, time: 4.001041666666667 },
      { midi: 65, time: 4.503125 },
      { midi: 53, time: 4.761458333333334 },
      { midi: 74, time: 4.998958333333333 },
      { midi: 53, time: 5.473958333333333 },
      { midi: 74, time: 5.989583333333333 },
      { midi: 53, time: 6.673958333333333 },
      { midi: 75, time: 6.673958333333333 },
      { midi: 74, time: 6.929166666666666 },
      { midi: 53, time: 7.375 }, // 20
      { midi: 43, time: 7.919791666666667 },
      { midi: 70, time: 8.419791666666667 },
      { midi: 82, time: 8.632291666666667 },
      { midi: 60, time: 8.90625 },
      { midi: 55, time: 9.3625 },
      { midi: 63, time: 9.8625 },
      { midi: 89, time: 10.2 },
      { midi: 87, time: 10.327083333333333 },
      { midi: 74, time: 10.575 },
      { midi: 84, time: 10.789583333333333 }, // 30
      { midi: 55, time: 11.03125 },
      { midi: 53, time: 11.283333333333333 },
      { midi: 52, time: 11.496875 },
      { midi: 39, time: 11.78125 },
      { midi: 55, time: 12.566666666666666 },
      { midi: 63, time: 12.840625 },
      { midi: 82, time: 13.05 },
      { midi: 81, time: 13.358333333333333 },
      { midi: 67, time: 13.572916666666666 },
      { midi: 81, time: 13.840625 }, // 40
      { midi: 63, time: 14.179166666666667 },
      { midi: 63, time: 14.626041666666667 },
      { midi: 63, time: 14.875 },
      { midi: 63, time: 15.411458333333334 },
      { midi: 65, time: 15.994791666666666 },
      { midi: 60, time: 16.498958333333334 }, // voice
      { midi: 60, time: 16.744791666666668 },
      { midi: 65, time: 16.991666666666667 },
      { midi: 65, time: 17.542708333333334 },
      { midi: 65, time: 18.09375 }, // 50
      { midi: 53, time: 18.739583333333332 },
      { midi: 69, time: 18.969791666666666 },
      { midi: 53, time: 19.438541666666666 },
      { midi: 69, time: 19.686458333333334 },
      { midi: 48, time: 19.890625 },
      { midi: 67, time: 20.157291666666666 },
      { midi: 55, time: 20.626041666666666 },
      { midi: 69, time: 20.869791666666668 },
      { midi: 55, time: 21.332291666666666 },
      { midi: 69, time: 21.823958333333334 }, // 60
      { midi: 75, time: 22.307291666666668 },
      { midi: 53, time: 22.507291666666667 },
      { midi: 72, time: 22.722916666666666 },
      { midi: 74, time: 23.065625 },
      { midi: 72, time: 23.155208333333334 },
      { midi: 70, time: 23.35625 },
      { midi: 69, time: 23.572916666666668 },
      { midi: 65, time: 23.810416666666665 },
      { midi: 67, time: 24.063541666666666 },
      { midi: 69, time: 24.28125 }, // 70
      { midi: 65, time: 24.503125 },
      { midi: 53, time: 25.010416666666668 },
      { midi: 70, time: 25.269791666666666 },
      { midi: 46, time: 25.511458333333334 },
      { midi: 72, time: 25.991666666666667 },
      { midi: 53, time: 26.190625 },
      { midi: 58, time: 26.4625 },
      { midi: 53, time: 26.939583333333335 },
      { midi: 77, time: 27.14375 },
      { midi: 58, time: 27.358333333333334 }, // 80
      { midi: 74, time: 27.879166666666666 },
      { midi: 75, time: 28.389583333333334 },
      { midi: 72, time: 28.827083333333334 },
      { midi: 55, time: 28.978125 },
      { midi: 60, time: 29.272916666666667 },
      { midi: 77, time: 29.605208333333334 },
      { midi: 55, time: 29.678125 },
      { midi: 74, time: 29.957291666666666 },
      { midi: 72, time: 30.167708333333334 },
      { midi: 60, time: 30.377083333333335 }, // 90
      { midi: 69, time: 30.592708333333334 },
      { midi: 70, time: 30.798958333333335 },
      { midi: 72, time: 31.04375 },
      { midi: 55, time: 31.497916666666665 },
      { midi: 43, time: 31.985416666666666 },
      { midi: 67, time: 32.229166666666664 },
      { midi: 72, time: 32.671875 },
      { midi: 58, time: 32.9125 },
      { midi: 72, time: 33.264583333333334 },
      { midi: 70, time: 33.376041666666666 }, // 100
      { midi: 69, time: 33.59791666666667 },
      { midi: 70, time: 33.81979166666667 },
      { midi: 70, time: 34.05625 },
      { midi: 55, time: 34.25416666666667 },
      { midi: 79, time: 34.483333333333334 },
      { midi: 69, time: 34.759375 },
      { midi: 69, time: 34.989375 }, // mid文件无
      { midi: 0, time: 35.259375 }, // mid与xml文件都无
      { midi: 65, time: 35.496875 },
      { midi: 60, time: 35.72083333333333 }, // 110
      { midi: 69, time: 36.13645833333333 },
      { midi: 67, time: 36.26770833333333 },
      { midi: 65, time: 36.52916666666667 }, // 112直接跳129
      { midi: 41, time: 36.776041666666664 },
      { midi: 75, time: 37.24375 },
      { midi: 53, time: 37.436458333333334 },
      { midi: 60, time: 37.672916666666666 },
      { midi: 74, time: 38.05 },
      { midi: 72, time: 38.084375 },
      { midi: 70, time: 38.30833333333333 }, // 120
      { midi: 65, time: 38.51145833333333 }, // 下标120
      { midi: 65, time: 38.71666666666667 },
      { midi: 67, time: 38.95 },
      { midi: 69, time: 39.14270833333333 },
      { midi: 65, time: 39.41979166666667 }, // 进入重复
      { midi: 60, time: 39.93125 }, // 126  // 重复
      { midi: 60, time: 40.166666666666664 }, // 127
      { midi: 65, time: 40.401041666666664 }, // 128
      { midi: 65, time: 40.86770833333333 }, // 129
      // { midi: 65, time: 41.33541666666667 }, // 130








      // {midi: 60, time: 39.93125}, // 126
      // {midi: 60, time: 40.166666666666664}, // 127
      // {midi: 65, time: 40.401041666666664}, // 128
      // {midi: 65, time: 59.896875}, // 129
      { midi: 65, time: 60.145833333333336 }, // 130
      { midi: 65, time: 60.35520833333333 },
      { midi: 67, time: 60.609375 },
      { midi: 69, time: 60.828125 },
      { midi: 70, time: 61.02708333333333 },
      { midi: 72, time: 61.219791666666666 },
      { midi: 74, time: 61.465625 },
      { midi: 75, time: 61.657291666666666 },
      { midi: 77, time: 61.891666666666666 },
      { midi: 53, time: 62.13645833333333 },
      { midi: 70, time: 62.34791666666667 }, // 140
      { midi: 70, time: 62.56875 },
      { midi: 70, time: 62.78958333333333 },
      { midi: 69, time: 63.27395833333333 },
      { midi: 67, time: 63.75729166666667 },
      { midi: 67, time: 63.975 },
      { midi: 55, time: 64.16041666666666 },
      { midi: 72, time: 64.41145833333333 },
      { midi: 70, time: 64.62916666666666 },
      { midi: 72, time: 64.853125 },
      { midi: 69, time: 65.07708333333333 }, // 150
      { midi: 70, time: 65.30104166666666 },
      { midi: 70, time: 65.525 },
      { midi: 50, time: 65.70833333333333 },
      { midi: 55, time: 65.94583333333334 },
      { midi: 58, time: 66.11041666666667 },
      { midi: 62, time: 66.403125 },
      { midi: 84, time: 66.74270833333334 },
      { midi: 58, time: 66.85625 },
      { midi: 82, time: 67.08958333333334 },
      { midi: 79, time: 67.31875 }, // 160
      { midi: 48, time: 67.45475 },
      { midi: 51, time: 67.58645833333334 },
      { midi: 60, time: 67.79375 },
      { midi: 79, time: 68.24375 },
      { midi: 67, time: 68.71979166666667 },
      { midi: 65, time: 69.17916666666666 },
      { midi: 65, time: 69.4125 },
      { midi: 53, time: 69.64583333333333 },
      { midi: 67, time: 69.878125 },
      { midi: 69, time: 70.10208333333334 }, // 170
      { midi: 65, time: 70.353125 },
      { midi: 62, time: 70.59375 },
      { midi: 63, time: 70.83541666666666 },
      { midi: 63, time: 71.07708333333333 },
      { midi: 48, time: 71.32708333333333 },
      { midi: 51, time: 71.53854166666666 },
      { midi: 79, time: 71.79791666666667 },
      { midi: 75, time: 72.03541666666666 },
      { midi: 77, time: 72.35416666666667 },
      { midi: 74, time: 72.459375 }, // 180
      { midi: 75, time: 72.690625 },
      { midi: 0, time: 72.75 }, // xml无
      { midi: 72, time: 72.915625 },
      { midi: 65, time: 73.134375 },
      { midi: 67, time: 73.378125 },
      { midi: 69, time: 73.61666666666666 },
      { midi: 70, time: 73.79270833333334 },
      { midi: 72, time: 74.0875 },
      { midi: 74, time: 74.31666666666666 },
      { midi: 75, time: 74.55 }, // 190
      { midi: 77, time: 74.82083333333334 },
      { midi: 65, time: 75.34166666666667 },
      { midi: 65, time: 75.61041666666667 },
      { midi: 65, time: 75.87916666666666 },
      { midi: 53, time: 76.40104166666667 },
      { midi: 77, time: 76.59791666666666 },
      { midi: 77, time: 76.8375 },
      { midi: 77, time: 77.30729166666667 },
      { midi: 79, time: 77.77604166666667 },
      { midi: 77, time: 78.01770833333333 }, // 200
      { midi: 63, time: 78.228125 },
      { midi: 75, time: 78.50208333333333 },
      { midi: 86, time: 78.71770833333333 },
      { midi: 72, time: 79.08020833333333 },
      { midi: 74, time: 79.19166666666666 },
      { midi: 75, time: 79.415625 },
      { midi: 77, time: 79.63958333333333 },
      { midi: 79, time: 80.0125 },
      { midi: 77, time: 80.1125 },
      { midi: 75, time: 80.36458333333333 }, // 210
      { midi: 86, time: 80.55833333333334 },
      { midi: 72, time: 80.80729166666667 },
      { midi: 74, time: 81.01770833333333 },
      { midi: 87, time: 81.215625 },
      { midi: 77, time: 81.459375 },
      { midi: 72, time: 81.68958333333333 },
      { midi: 39, time: 81.92083333333333 },
      { midi: 69, time: 82.16979166666667 },
      { midi: 69, time: 82.3625 },
      { midi: 69, time: 82.78229166666667 }, // 220
      { midi: 65, time: 83.21041666666666 },
      { midi: 65, time: 83.453125 },
      { midi: 62, time: 83.73333333333333 },
      { midi: 77, time: 83.959375 },
      { midi: 77, time: 84.18020833333334 },
      { midi: 77, time: 84.65 },
      { midi: 79, time: 85.128125 },
      { midi: 77, time: 85.36770833333334 },
      { midi: 55, time: 85.62916666666666 },
      { midi: 75, time: 85.82083333333334 }, // 230
      { midi: 74, time: 86.02916666666667 },
      { midi: 72, time: 86.375 },
      { midi: 74, time: 86.48854166666666 },
      { midi: 75, time: 86.715625 },
      { midi: 77, time: 86.94270833333333 },
      { midi: 91, time: 87.28854166666666 },
      { midi: 77, time: 87.40208333333334 },
      { midi: 87, time: 87.61354166666666 },
      { midi: 63, time: 87.825 },
      { midi: 72, time: 88.04479166666667 }, // 240
      { midi: 86, time: 88.24791666666667 },
      { midi: 87, time: 88.45416666666667 },
      { midi: 89, time: 88.684375 },
      { midi: 65, time: 88.94166666666666 },
      { midi: 79, time: 89.10625 },
      { midi: 81, time: 89.34166666666667 },
      { midi: 34, time: 89.54375 },
      { midi: 86, time: 89.803125 },
      { midi: 75, time: 89.996875 },
      { midi: 89, time: 90.21770833333333 }, // 250
      { midi: 79, time: 90.471875 },
      { midi: 62, time: 91.15208333333334 },
      { midi: 70, time: 91.215625 },
      { midi: 70, time: 91.39270833333333 },
      { midi: 67, time: 91.83958333333334 },
      { midi: 77, time: 92.321875 },
      { midi: 77, time: 92.56770833333333 },
      { midi: 55, time: 92.99479166666667 },
      { midi: 79, time: 93.04375 },
      { midi: 77, time: 93.278125 }, // 260
      { midi: 79, time: 93.62395833333333 },
      { midi: 77, time: 93.73854166666666 },
      { midi: 75, time: 93.965625 },
      { midi: 67, time: 94.19166666666666 },
      { midi: 55, time: 94.65520833333333 },
      { midi: 72, time: 94.94270833333333 },
      { midi: 75, time: 95.16666666666667 },
      { midi: 75, time: 95.43333333333334 },
      { midi: 63, time: 95.88645833333334 },
      { midi: 77, time: 95.91666666666667 }, // 270
      { midi: 75, time: 96.16354166666666 },
      { midi: 75, time: 96.62916666666666 },
      { midi: 67, time: 96.853125 },
      { midi: 72, time: 97.10104166666666 },
      { midi: 72, time: 97.33958333333334 },
      { midi: 63, time: 97.78229166666667 },
      { midi: 74, time: 97.815625 },
      { midi: 75, time: 98.05 },
      { midi: 75, time: 98.51145833333334 },
      { midi: 67, time: 98.96041666666666 }, // 280
      { midi: 77, time: 99.43645833333333 },
      { midi: 79, time: 99.684375 },
      { midi: 74, time: 99.92083333333333 },
      { midi: 74, time: 100.165625 },
      { midi: 55, time: 100.421875 },
      { midi: 77, time: 100.63125 },
      { midi: 75, time: 100.86458333333333 },
      { midi: 74, time: 101.31041666666667 },
      { midi: 63, time: 101.85208333333334 },
      { midi: 63, time: 102.39583333333333 }, // 290
      { midi: 91, time: 102.61145833333333 },
      { midi: 60, time: 102.859375 },
      { midi: 74, time: 102.88229166666666 }, // midi无
      { midi: 55, time: 103.25520833333333 },
      { midi: 74, time: 103.51041666666667 },
      { midi: 72, time: 103.69791666666667 },
      { midi: 63, time: 103.93229166666667 },
      { midi: 48, time: 104.121875 },
      { midi: 63, time: 104.3875 },
      { midi: 63, time: 104.61770833333334 }, // 300
      { midi: 67, time: 105.04791666666667 },
      { midi: 74, time: 105.56770833333333 },
      { midi: 50, time: 105.81875 }, // midi无
      { midi: 55, time: 106.02291666666666 }, // midi无
      { midi: 79, time: 106.22083333333333 },
      { midi: 79, time: 106.4875 },
      { midi: 58, time: 106.71666666666667 },
      { midi: 79, time: 106.921875 },
      { midi: 50, time: 107.14583333333333 },
      { midi: 75, time: 107.38020833333333 }, // 310 09
      { midi: 75, time: 107.609375 }, // 10
      { midi: 51, time: 107.94333333333334 }, // 11
      { midi: 84, time: 108.284375 }, // 12
      { midi: 77, time: 108.06666666666666 }, // 13
      { midi: 55, time: 108.405 }, // midi无 14
      { midi: 77, time: 108.63854166666667 }, // 15
      { midi: 75, time: 108.753125 }, // 16
      { midi: 74, time: 108.98229166666667 }, // 17
      { midi: 72, time: 109.21041666666666 }, // 18
      { midi: 51, time: 109.435 }, // 320 midi无 19
      { midi: 69, time: 109.665625 },
      { midi: 70, time: 109.89270833333333 },
      { midi: 81, time: 110.08645833333334 },
      { midi: 72, time: 110.35520833333334 },
      { midi: 50, time: 110.6 },
      { midi: 54, time: 110.81875 },
      { midi: 57, time: 111.028125 },
      { midi: 62, time: 111.27083333333333 },
      { midi: 66, time: 111.48333333333333 },
      { midi: 69, time: 111.70416666666667 }, // 330
      { midi: 79, time: 111.92291666666667 },
      { midi: 67, time: 112.75625 },
      { midi: 62, time: 112.81979166666666 },
      { midi: 58, time: 113.44583333333334 },
      { midi: 62, time: 113.80416666666666 },
      { midi: 67, time: 114.26770833333333 },
      { midi: 48, time: 114.796875 },
      { midi: 65, time: 116.06770833333333 },
      { midi: 67, time: 116.45833333333333 },
      { midi: 69, time: 117.259375 }, // 340
      { midi: 58, time: 117.50729166666666 },
      { midi: 65, time: 118.19583333333334 },
      { midi: 65, time: 118.87083333333334 },
      { midi: 57, time: 119.425 },
      { midi: 60, time: 119.65416666666667 },
      { midi: 65, time: 119.95104166666667 },
      { midi: 57, time: 120.428125 },
      { midi: 41, time: 120.96041666666666 },
      { midi: 69, time: 121.23645833333333 }, // midi无
      { midi: 72, time: 121.5125 }, // 350
      { midi: 69, time: 121.77291666666666 },
      { midi: 77, time: 122.05416666666666 },
      { midi: 77, time: 122.58020833333333 },
      { midi: 41, time: 123.18229166666667 },
      { midi: 84, time: 123.75104166666667 },
      { midi: 53, time: 124.178125 },
      { midi: 89, time: 124.5125 },
      { midi: 82, time: 125.278125 },
      { midi: 84, time: 127.246875 },
      { midi: 0, time: 127.6 }, // 都无
    ];

    for (const key in this.handerTime) {
      if (key >= 46 && key <= 112) { // 跳转到45 next就是46
        let keyTime = this.handerTime[key].time - 16.498958333333334 + 0.2; // 124到125时间 还有 45到46时间
        this.copyNotes.push({ time: keyTime, midi: this.handerTime[key].midi });
        Number(key) === 112 && (repeat = keyTime); // 重复的截止时间
      }
      if (key >= 129) {
        this.copyNotes.push({ time: this.handerTime[key].time - this.handerTime[129].time + repeat + 0.5, midi: this.handerTime[key].midi });
      }
    }
    this.osmd.load(this.props.file).then(() => {
      // this.osmd.graphic.measureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      // this.osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      // this.osmd.graphic.measureList[1][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      // this.osmd.graphic.measureList[0][0].staffEntries[1].graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = '#FF0000';
      this.osmd.zoom = 0.5;
      return this.osmd.render();
    }).then(async () => {
      this.osmd.cursor.show();
      // let midiDatas = this.midiData.tracks[0].notes.concat(this.midiData.tracks[1].notes).sort((a, b) => a.time - b.time);
      // let midiDatas = this.midiData.tracks[1].notes.sort((a, b) => a.time - b.time);
      // let midiData = [];
      // for (let val of midiDatas) {
      //   midiData.push({ midi: val.midi, octave: val.octave, time: val.time });
      // }
      // // array 后期this.midiData需要循环
      // console.log('osmd', this.osmd, JSON.parse(JSON.stringify(midiData)));
      // const staffEntryContainers = this.osmd.graphic.verticalGraphicalStaffEntryContainers;
      // let arr = [];
      // for (const index in staffEntryContainers) {
      //   const values = staffEntryContainers[index];
      //   // 数组             对象                数组             数组      
      //   // staffEntries => sourceStaffEntry => voiceEntries => notes => halfTone + 12、(pitch => octave + 3)
      //   // 上面获取的halfTone和octave与midi中文件midi和octave字段相对应
      //   let singleCursorXmlNotes = [];
      //   if (values?.staffEntries) {
      //     for (const value of values.staffEntries) {
      //       if (value?.sourceStaffEntry?.voiceEntries) {
      //         for (const val of value.sourceStaffEntry.voiceEntries) {
      //           if (val?.notes) {
      //             for (const v of val?.notes) {
      //               v?.halfTone && singleCursorXmlNotes.push({ midi: v.halfTone + 12, octave: v.pitch.octave + 3, time: values.absoluteTimestamp.realValue * 4 * this.midiData.duration / 110 });
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      //   arr.push(singleCursorXmlNotes);
      //   let singleCursorMidiNotes = [];
      //   for (const keys in singleCursorXmlNotes) {
      //     const val = singleCursorXmlNotes[keys];
      //     for (const key in midiData) {
      //       const value = midiData[key];
      //       if (val.midi === value.midi && val.octave === value.octave) {
      //         singleCursorMidiNotes.push({ midi: value.midi, time: value.time });
      //         midiData.splice(key, 1); // 只删除当前项
      //         break;
      //       }
      //     }
      //   }
      //   // let avgTime = 0;
      //   // if (singleCursorMidiNotes.length > 0) {
      //   //   avgTime = singleCursorMidiNotes.reduce((a, b) => a + b) / singleCursorMidiNotes.length;
      //   // }
      //   // this.allCursor.push(singleCursorMidiNotes.sort()[0] || { time: 0, midi: 0 });
      // }
      // for (const val of staffEntryContainers) {
      //   this.allCursor.push({ time: val.absoluteTimestamp.realValue * 4 });
      // }
      // this.midXmlAllTimeRatio = this.midiData.duration / this.allCursor[this.allCursor.length - 1].time;
      // let allNotes = [];
      // const iterator = this.osmd.cursor.Iterator;
      // while (!iterator.EndReached) {
      //   const voices = iterator.CurrentVoiceEntries;
      //   for (let i = 0; i < voices.length; i++) {
      //     const v = voices[i];
      //     const notes = v.Notes;
      //     for (let j = 0; j < notes.length; j++) {
      //       const note = notes[j];
      //       // make sure our note is not silent
      //       if ((note != null) && (note.halfTone !== 0)) {
      //         allNotes.push({
      //           'note': note.halfTone + 12, // see issue #224
      //           'time': iterator.currentTimeStamp.RealValue * 4
      //         })
      //       }
      //     }
      //   }
      //   iterator.moveToNext();
      // }
      // console.log(this.midXmlAllTimeRatio, arr)
      // console.log('allNotes', allNotes)
      await this.audioPlayer.loadScore(this.osmd);
      // // this.audioPlayer.setBpm(30)
      window.ReactNativeWebView?.postMessage('loadingEnd');
      console.log('audioPlayer', this.audioPlayer)
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
    this.audioPlayer.jumpToStep(Number(this.state.value));
  }

  nextHandle = () => {
    this.osmd.cursor.next();
  }


  upHandle = () => {
    this.osmd.cursor.prev();
  }

  // play
  play = () => {
    console.log(this.copyNotes)
    // audioE.play(); audioE1.play();
    if (this.playCursor) {
      this.differenceTime.push(this.pauseTime - this.playTime);
      let differenceTime = eval(this.differenceTime.join("+"));
      this.playTime = new Date();
      if (this.isRepeat) {
        for (let key in this.copyNotes) {
          if (key > this.playCursor) {
            this.id = setTimeout(() => {
              this.osmd.cursor.next();
              this.playCursor++;
              if (112 - 46 + 2 === this.playCursor) {
                this.audioPlayer.jumpToStep(129, 112);
              }
            }, Math.round(this.copyNotes[key].time * 1000) - differenceTime);
          }
        }
      } else {
        for (let key in this.handerTime) {
          if (key > this.playCursor) {
            this.id = setTimeout(() => {
              this.osmd.cursor.next();
              this.playCursor++;
            }, Math.round(this.handerTime[key].time * 1000) - differenceTime);
          }
        }
      }
    } else {
      this.playTime = new Date();
      for (let value of this.handerTime) {
        if (value.time) {
          this.id = setTimeout(() => {
            this.osmd.cursor.next();
            this.playCursor++;
            if (this.playCursor === 125) { // 124进入重复
              this.isRepeat = true; this.playTime = new Date();
              console.log(this.id);
              while (this.id > 0) {
                clearTimeout(this.id);
                this.id--;
              }
              console.log(this.id, this.playCursor);
              this.audioPlayer.jumpToStep(45, this.playCursor);
              this.playCursor = 0;
              for (let value of this.copyNotes) {
                if (value.time) {
                  this.id = setTimeout(() => {
                    this.osmd.cursor.next();
                    this.playCursor++;
                    if (112 - 46 + 2 === this.playCursor) {
                      this.audioPlayer.jumpToStep(129, 112);
                    }
                  }, Math.round(value.time * 1000));
                }
              }
              console.log('value', value)
            }
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
    this.isRepeat = false;
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
      {/* <div className='div'>
        <button onClick={this.play}>播放</button>
        <button onClick={this.pause}>暂停</button>
        <button onClick={this.reset}>重置</button>
        <button onClick={this.nextHandle}>下一个</button>
        <input type="number" onChange={this.handelChange} defaultValue={this.state.value} />
        <button onClick={this.jumpToStep}>jump to step</button>
      </div> */}
    </>
  }
}

export default OpenSheetMusicDisplay;
