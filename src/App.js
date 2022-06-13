import "./styles.css";
import React, { useEffect, useRef, useState } from "react";

import gsap from "gsap";

import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper.js"
import { CustomEase } from "gsap/CustomEase.js";
import { TweenLite } from "gsap/gsap-core";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import sunImg from "../src/assets/img/sun1.png";
import mercuryImg from "../src/assets/img/mercury1.png";
import earthImg from "../src/assets/img/earth1.png";
import mercuryPathImg from "../src/assets/img/mercury-path1.png";
import retrogradeImg from "../src/assets/img/retrograde.png";

const style = { width: 600, margin: 50 };

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(MotionPathHelper);
gsap.registerPlugin(CustomEase)

export default function App() {

  const el = useRef();
  const q = gsap.utils.selector(el);

  const [t1, setT1] = useState();
  const [t2, setT2] = useState();
  const [t3, setT3] = useState();

  let helper = document.querySelector("#helper"),
    line = document.querySelector("#line"),
    line01 = document.querySelector("#line01"),
    point = { x: 0, y: 0 };
  let beamCircle = document.querySelector("#beamCircle");

  const [value, setValue] = useState(0);
  const [count, setCount] = useState(0);
  const sliderProps = {
    min: 0.0,
    max: 1.0,
    step: 0.00001
  };
  
  // Polyfill for getTransformToElement
  SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());  
  };

  const updateSlider = () => {

    t3.duration();
    let angle, mag;
    let earthCenterX, earthCenterY, earthRadius = 32, widthStroke = 6;
    let beamRadius;

    let path = document.querySelector("#retrogradePath"); 
    let retro = path.getTotalLength() || 0;
    let pos = path.getPointAtLength(retro * t3.progress());

    setValue(t3.progress());
    
    let p = MotionPathPlugin.convertCoordinates(helper, line, point);
    earthCenterX = p.x - earthRadius - widthStroke;
    earthCenterY = p.y - earthRadius - widthStroke;

    // Earth
    line01.setAttribute("x2", earthCenterX);
    line01.setAttribute("y2", earthCenterY);
    
    // Retrograde path
    line01.setAttribute("x1", pos.x);
    line01.setAttribute("y1", pos.y);
    
    angle = Math.atan2(pos.y - earthCenterY, pos.x - earthCenterX);
    mag = Math.sqrt(Math.pow((pos.y - earthCenterY), 2) + Math.pow((pos.x - earthCenterX), 2));
    beamRadius = Math.tan(Math.PI / 80) * mag
    
    beamCircle.setAttribute("cx", pos.x);
    beamCircle.setAttribute("cy", pos.y);
    beamCircle.setAttribute("r", beamRadius);
    
    let x1 = earthCenterX + Math.cos(angle + Math.PI / 80) * mag;
    let y1 = earthCenterY + Math.sin(angle + Math.PI / 80) * mag;
    let x2 = earthCenterX + Math.cos(angle - Math.PI / 80) * mag;
    let y2 = earthCenterY + Math.sin(angle - Math.PI / 80) * mag;
    
    let newPoints = parseInt(x1) + ", " + parseInt(y1) + ", " + parseInt(x2) + ", " + parseInt(y2) + ", " +  parseInt(earthCenterX) + ", " + parseInt(earthCenterY);
    TweenLite.to("#beamTriangle", 0, {attr: {points: newPoints}})
  }

  const onSliderChange = (value) => {
    console.log("value = ", value);
    console.log("t3 = ", t3);
    t1 && t1.progress(value);
    t2 && t2.progress(value);
    t3 && t3.progress(value);
  }

  const onBeforeChange = () => {
    t1 && t1.pause();
    t2 && t2.pause();
    t3 && t3.pause();
  }

  const onAfterChange = (value) => {
    setValue(value);
	};

  useEffect(() => {
    t1 && t1.to("#earthGroup", {
      duration: 24, 
      ease: "none",
      motionPath:{
        path: "#earthPath",
        align: "#earthPath",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    });
  }, [t1]);

  useEffect(() => {
    t2 && t2.to("#mercuryGroup", {
      duration: 3.6, 
      ease: CustomEase.create("custom", "M0,0,C0,0,0.093,0.085,0.18,0.172,0.244,0.236,0.288,0.288,0.334,0.33,0.391,0.382,0.436,0.439,0.608,0.642,0.674,0.72,0.7,0.76,0.776,0.84,0.864,0.932,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath1",
        align: "#mercuryPath1",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    }).to("#mercuryGroup", {
      duration: 1.84, 
      ease: CustomEase.create("custom", "M0,0,C0,0,-0.007,0.253,0.08,0.34,0.144,0.404,0.21,0.467,0.264,0.5,0.33,0.54,0.311,0.547,0.534,0.692,0.614,0.744,0.658,0.776,0.75,0.834,0.857,0.901,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath2",
        align: "#mercuryPath2",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    }).to("#mercuryGroup", { 
      duration: 6.4, 
      ease: CustomEase.create("custom", "M0,0,C0,0,0.012,0.116,0.094,0.21,0.15,0.275,0.241,0.337,0.29,0.374,0.374,0.438,0.458,0.51,0.55,0.582,0.771,0.755,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath3",
        align: "#mercuryPath3",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    }).to("#mercuryGroup", { 
      duration: 1.72, 
      ease: CustomEase.create("custom", "M0,0,C0,0,0.042,0.222,0.224,0.334,0.302,0.382,0.371,0.449,0.456,0.496,0.553,0.549,0.665,0.583,0.748,0.66,0.901,0.803,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath4",
        align: "#mercuryPath4",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    }).to("#mercuryGroup", {
      duration: 6.32, 
      ease: CustomEase.create("custom", "M0,0,C0,0,0.004,0.01,0.11,0.09,0.152,0.122,0.23,0.191,0.28,0.234,0.311,0.26,0.355,0.3,0.386,0.327,0.44,0.376,0.49,0.425,0.54,0.474,0.608,0.541,0.713,0.649,0.778,0.724,0.899,0.865,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath5",
        align: "#mercuryPath5",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    }).to("#mercuryGroup", { 
      duration: 1.68, 
      ease: CustomEase.create("custom", "M0,0,C0,0,0.004,0.147,0.076,0.274,0.101,0.319,0.15,0.344,0.19,0.384,0.287,0.481,0.423,0.503,0.542,0.576,0.602,0.613,0.678,0.765,0.73,0.814,0.883,0.957,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath6",
        align: "#mercuryPath6",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    }).to("#mercuryGroup", {
      duration: 2.24, 
      ease: CustomEase.create("custom", "M0,0,C0,0,0.064,0.172,0.184,0.292,0.234,0.342,0.297,0.388,0.356,0.444,0.64,0.713,1,1,1,1"),
      motionPath:{
        path: "#mercuryPath7",
        align: "#mercuryPath7",
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    })

  }, [t2]);

  useEffect(() => {
    t3 && t3.from("#retrogradePath1", {
      duration: 3.56, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    }).from("#retrogradePath2", {
      duration: 1.28, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    }).from("#retrogradePath3", {
      duration: 7.2, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    }).from("#retrogradePath4", {
      duration: 1.4, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    }).from("#retrogradePath5", {
      duration: 6.28, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    }).from("#retrogradePath6", {
      duration: 1.28, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    }).from("#retrogradePath7", {
      duration: 2.8, 
      ease: "none",
      drawSVG:0,
      onUpdate: updateSlider
    })
  }, [t3]);
  
  useEffect(() => {
    const t1 = gsap.timeline();
    setT1(t1);
    const t2 = gsap.timeline();
    setT2(t2);
    const t3 = gsap.timeline();
    setT3(t3);
  }, []);

  return (
    <div className="App" ref={el}>
      <div className="container">
        <div class="ribbon">
          <a href="https://github.com/RisingStar522/Mercury-Retrograde">Fork me on GitHub</a>
        </div>
        <div className="section-left">
          <div className="container-left">
            <div className="text-1">
              Mercury in
            </div>
            <div className="text-1">
              <span>"retrograde"</span>
            </div>
          </div>
          <div className="group-planet">
            <img className="planet" src={sunImg} width={60} height={60} alt="sun" />
            <span className="planet-text">Sun</span>
          </div>
          <div className="group-planet">
            <img className="planet" src={mercuryImg} width={60} height={60} alt="mercury" />
            <span className="planet-text">Mercury</span>
          </div>
          <div className="group-planet">
            <img className="planet" src={earthImg} width={60} height={60} alt="earth" />
            <span className="planet-text">Earth</span>
          </div>
          <div className="group-4">
            <p className="planet-path">Path of Mercury in</p>
            <p className="planet-path">the Earth's sky</p>
            <img className="planet" src={mercuryPathImg} alt="mercury-retro" />
          </div>
        </div>
        <div className="section-center">
          <div className="svg-container">
            <svg viewBox="0 0 500 400" height="100%" id="svg">
              <g id="line">
                <line id="line01"  stroke="#f96feb" strokeWidth="0" x1="70" y1="70" x2="70" y2="70" />
              </g>
              <path id="earthPath" d="M438.399,619.999C471.8115,614.48155,496.277,602.238,512.357,593.949,534.364,582.603,547.8252,569.7078,563.718,554.651,603.289,517.161,625.4375,458.7175,632.205,422.038,648.367,334.437,634.494,278.199,569.205,204.038,519.909,148.043,422.199,110.229,337,128.999,253.799,147.327,189.411,204.969,159.794,268.961,138.291,315.42,132.044,395.14,145.794,441.953,159.535,488.744,182.233,538.222,243.477,579.744,315.928,628.864,391.214,626.986,438.399,619.999" fill="none"/>
              <path id="mercuryPath" d="M397,261C279,251,261.514,429.2,374,442,495.182,455.789,531,280,397,261" fill="none"/>
              <path id="mercuryPath1" d="M400,260.666C343.984,255.33,303.901,289.47,299.999,345.999,296.538,396.129,322.363,424.778,344.127,433.325" fill="none"/>
              <path id="mercuryPath2" d="M344.264,433.33C383.718,447.467,439.204,449.607,470.796,393.731,498.766,344.26,473.464,293.474,439.199,274.933" fill="none"/>
              <path id="mercuryPath3" d="M441.598,275.864C417.587,261.192,390.23,256.91,368.46434,262.06482,329.695,271.246,303.1206,300.7758,299.999,345.999,297.5763,381.09,309.627,405.529,324.3433,420.16793,339.041,434.788,389.936,454.356,430.853,433.225,459.9746,418.185,478.80628,389.15524,481.76673,356.20983,482.50684,347.97348,482.25,323.488,473.721,312.523" fill="none"/>
              <path id="mercuryPath4" d="M474.429,313.785C453.061,273.511,421.259,260.641,384.852,260.244,345.523,259.815,318.152,286.862,306.867,313.367,291.753,348.864,300.436,379.165,312.796,405.902" fill="none"/>
              <path id="mercuryPath5" d="M312.264,405.329C326.126,430.458,361.04,439.727,376.23666,440.96427,407.791,443.532,447.102,435.638,470.796,393.731,490.375,359.1013,481.485,325.353,466.42115,299.41993,455.964,281.418,427.509,262.761,396.329,260.232,381.1831,259.0035,360.22482,260.59446,342.5663,271.14561,326.198,282.067,315.233,297.829,309.596,310.13" fill="none"/>
              <path id="mercuryPath6" d="M309.598,311.064C299.178,324.383,296.982,353.736,299.998,372.398,301.522,381.83,309.627,405.529,324.3433,420.16793,339.041,434.788,369.397,445.447,399.652,441.222,429.994,436.984,440.647,427.484,460.92,408.522" fill="none"/>
              <path id="mercuryPath7" d="M459.995,410.262C472.764,387.575,473.118,397.972,479.542,372.966,486.273,346.761,483.764,332.176,475.651,313.222,466.619,292.121,439.044,267.477,401.72,261.322" fill="none"/>

              <g strokeWidth="8" strokeLinejoin="round" stroke="#c92d00">
                <path id="retrogradePath" d="M381.798,12.599C354.997,12.694,356.371,15.693,339.265,17.957,314.282,21.262,299.589,28.281,280.259,37.036,249.244,51.082,224.744,62.394,200.766,81.885,172.608,104.773,158.106,119.644,145.626,138.224,130.778,160.328,116.221,188.733,108.28,217.117,102.927,236.25,98.698,297.454,102.999,322.333,108.008,351.309,117.722,400.018,167.628,399.786,232.727,390.463,287.683,242.223,260.733,197.951,247.595,176.369,235.121,166.926,200.014,172.798,169.167,177.957,159.095,192.479,138.156,209.498,118.933,225.122,100.644,253.329,92.879,267.029,73.427,301.307,62.277,364.044,63.08,394.897,64.25,439.851,79.127,496.048,99.72,530.79,111.529,550.713,120.5532,565.5846,129.348,577.041,147.263,600.377,172.86955,625.2125,200.49,640.739,221.034,652.287,275.716,680.167,330.941,677.81,381.494,675.652,415.882,671.082,464.484,651.785,502.116,636.843,523.913,617.961,548.19,592.206,572.442,566.473,601.512,523.233,592.515,492.158,581.842,455.307,531.866,442.462,440.288,475.378,353.478,506.57,333.814,543.541,348.983,577.943,363.097,609.953,402.332,618.868,433.184,624.629,481.41,633.634,512.823,631.188,547.431,623.615,589.505,614.404,621.136,603.093,644.148,580.973,652.114,573.315,669.256,551.943,684.814,525.794,700.372,499.644,713.215,467.6915,717.19,451.795,726.117,416.09,725.761,388.529,725.254,359.066,724.609,321.601,709.931,284.759,698.754,260.927,672.713,205.404,640.368,168.017,597.671,138.923,552.041,107.83,474.88,86.512,422.544,113.748,375.639,138.156,446.446,208.437,485.398,253.333,527.663,302.048,572.5,311.38,594.213,270.786,611.228,238.975,606.508,181.267,594.324,147.718,582.143,114.177,572.993,100.896,553.577,79.348,533.445,57.006,502.377,37.15,474.635,26.297,458.58,20.016,413.742,9.24,373.997,11.798" fill="none" stroke="black" />
                <path id="retrogradePath1" d="M381.798,12.599C346.997,12.694,299.589,28.281,280.259,37.036,249.244,51.082,224.744,62.394,200.766,81.885,172.608,104.773,158.106,119.644,145.626,138.224,130.778,160.328,116.221,188.733,108.28,217.117,102.927,236.25,97.555,290.596,102.999,322.333,107.97,351.315,115.343,376.321,137.911,391.785,148.21,398.842,172.575,405.774,189.992,388.935" fill="none" stroke="black" />
                <path id="retrogradePath2" d="M187.511,390.883C209.839,377.251,233.234,346.867,246.481,315.211,260.088,282.694,270.857,244.649,266.562,215.221" fill="none" stroke="black" />
                <path id="retrogradePath3" d="M266.367,217.168C258.97,178.392,235.483,169.813,200.014,172.798,179.452,174.528,155.665,189.049,141.584,202.64,123.76,219.843,99.5,253.327,90.593,271.6,73.324,307.027,62.277,364.044,63.08,394.897,64.25,439.851,79.127,496.048,99.72,530.79,111.529,550.713,120.5532,565.5846,129.348,577.041,147.263,600.377,172.86955,625.2125,200.49,640.739,221.034,652.287,275.716,680.167,330.941,677.81,381.494,675.652,415.882,671.082,464.484,651.785,502.116,636.843,523.913,617.961,548.19,592.206,572.442,566.473,601.589,522.966,592.515,492.158,584.907,466.328,565.724,458.366,538.566,456.364" fill="none" stroke="black" />
                <path id="retrogradePath4" d="M539.509,456.025C525.25,456.112,495.307,453.926,440.288,475.378,382.637,497.855,362.305,516.63,351.136,534.08" fill="none" stroke="black" />
                <path id="retrogradePath5" d="M352.076,531.451C350.407,538.387,338.384,558.396,348.982,583.656,362.516,615.915,402.332,618.868,433.184,624.629,481.41,633.634,512.823,631.188,547.431,623.615,589.505,614.404,615.106,602.611,639.576,582.115,655.541,568.742,669.256,551.943,684.814,525.794,700.372,499.644,713.215,467.6915,717.19,451.795,726.117,416.09,725.761,388.529,725.254,359.066,724.609,321.601,709.931,284.759,698.754,260.927,672.713,205.404,640.368,168.017,597.671,138.923,552.041,107.83,505.993,88.637,448.829,101.176,430.725,105.147,402.301,130.368,408.278,150.081" fill="none" stroke="black" />
                <path id="retrogradePath6" d="M408.083,147.455C420.126,184.114,446.592,208.31,485.398,253.333,518.52,291.762,542.869,296.089,549.993,295.226" fill="none" stroke="black" />
                <path id="retrogradePath7" d="M547.511,294.882C562.977,293.824,580.335,299.729,597.641,257.071,610.084,226.399,606.508,181.267,594.324,147.718,582.143,114.177,572.993,100.896,553.577,79.348,533.445,57.006,502.377,37.15,474.635,26.297,458.58,20.016,413.742,9.24,373.997,11.798" fill="none" stroke="black" />
              </g> 
              <g>
                <polygon id="beamTriangle" fill="#f96feb" points="0,0 0,0 0,0" />
              </g>
              <g>
                <circle id="beamCircle" cx="30" cy="30" r="0" fill="#f96feb" />
              </g>
              <g id="mercuryGroup">
                <circle className="mercury" cx="32" cy="32" r="26" fill="#b7b7b7" />
                <text id="mercury-text" x="13" y="46">M</text>
              </g>
              <g id="earthGroup">
                <line id="helper"  stroke="blue" strokeWidth="4" x1="70" y1="70" x2="70" y2="70" fill="#f96feb" />
                <circle className="earth" cx="32" cy="32" r="26" fill="#1c44ff" />
                <text id="earth-text" x="18" y="48" fill="#ffffff">E</text>
              </g>
              <g id="sunGroup">
                <circle id="sun" cx="390" cy="370" r="30" fill="#fdfbf2" />
                <text id="sun-text" x="374" y="386">S</text>
              </g>
            </svg>
          </div>

          <Slider
            id="slider"
            value={value}
            onChange={onSliderChange}
            onBeforeChange={onBeforeChange}
            onAfterChange={onAfterChange}
            style={style}
            {...sliderProps}
          />

          {/* <div style={{ marginTop: 40, color: 'white' }}><b>Selected Value: </b>{value}</div> */}
        </div>
        <div className="section-right">
          <div className="container-right">
            <div className="text-1">
              <span>Retrograde occurs when</span>
            </div>
            <div className="text-1">
              <span>a plane appears to move</span>
            </div>
            <div className="text-1">
              <span>'backwards' in a sky</span>
            </div>
            <div className="text-1">
              <span>(relative to stars)</span>
            </div>
          </div>
          <div className="group-4">
            <p className="planet-path">2022 Mercury Retrograde</p>
            <p className="planet-path">Jan 14 - Feb 3, 2022</p>
            <p className="planet-path">May 10 - Jun 2, 2022</p>
            <p className="planet-path">Sep 9 - Oct 2, 2022</p>
            <p className="planet-path">Dec 29, 2022 - Jan 18, 2023</p>
          </div>
          <div className="group-4">
            <p className="planet-retrograde">Retrograde</p>
            <img className="planet" src={retrogradeImg} alt="retrograde" />
          </div>
        </div>
      </div>
    </div>
  );
}
