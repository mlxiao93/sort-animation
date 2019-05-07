import React from 'react';
import SortService, {SortType, SortStep} from './SortService'
import Bash from './Bash'
import styles from './DemoCard.module.scss'

import {
  MAX_VALUE,
  RECT_WIDTH,
  RECT_GAP,
  heightMaxValueRatio,
  viewBoxHeight,
  viewBoxWidth,
  svgHeight,
  svgWidth, } from '../../consts'

const INTEAVAL = 500;

const SortTitleMap = {
  [SortType.selectionSort]: '选择排序',
  [SortType.insertionSort]: '插入排序',
  [SortType.bubbleSort]: '冒泡排序',
  [SortType.quickSort]: '快速排序',
  [SortType.heapSort]: '堆排序',
};

enum ColorMap {
  default = '#57AFFF',
  active = 'rgb(247, 163, 92)',
  swapping = 'rgb(244, 91, 91)',
  success = '#51CB73',
}

/**
 * 得到贝塞尔曲线基准点
 * @param a
 * @param b
 * @param delta 基准点与两点中点在两点垂线上的距离
 */
function getBesselBasePoint(a: any, b: any, delta: number = 15) {
  a = a.split(/\s+/);
  b = b.split(/\s+/);
  const xa = Number(a[0]), xb = Number(b[0]);
  const xMid = (xa + xb) / 2;

  return `${xMid} ${MAX_VALUE * heightMaxValueRatio + delta}`
}

export default class DemoCard extends React.Component<{
  arr: number[];
  sortType: SortType;
}, {
  arr?: number[];
  steps?: SortStep[];
  currentStepIndex: number;
  autoplay: boolean;
}> {

  state = {
    arr: [],
    steps: [],
    currentStepIndex: 0,

    autoplay: true,
  };

  handleResetClick(): void {
    this.genArrayAndSteps();
  }
  handleToggleAutoplayClick(): void {
    this.timer && clearTimeout(this.timer);
    const oldStatus = this.state.autoplay;
    const newStatus = !oldStatus;
    this.setState({
      autoplay: newStatus
    }, () => {
      if (this.state.autoplay) {
        this.nextStep();
      }
    })
  }
  handlePrevClick(): void {
    this.setState({
      autoplay: false
    }, () => {
      this.preStep();
    });
  }
  handleNextClick(): void {
    this.setState({
      autoplay: false
    }, () => {
      this.nextStep();
    });
  }

  preStep(): void {
    this.timer && clearTimeout(this.timer);
    const {currentStepIndex} = this.state;
    if (currentStepIndex <= 0) return;
    this.setState({
      currentStepIndex: currentStepIndex - 1
    });
  }

  timer?: any;

  nextStep(): void {
    this.timer && clearTimeout(this.timer);
    const {steps, currentStepIndex, autoplay} = this.state;
    const maxStepIndex = steps.length - 1;
    let newStepIndex;
    if (currentStepIndex < maxStepIndex) {
      newStepIndex = currentStepIndex + 1;
    } else {
      newStepIndex = 0;
    }
    this.setState({
      currentStepIndex: newStepIndex
    });

    if (autoplay) {
      let interval = INTEAVAL;
      if (newStepIndex === 0 || newStepIndex === maxStepIndex) interval = 2400;
      this.timer = setTimeout(() => {
        this.nextStep();
      }, interval);
    }
  }

  genArrayAndSteps(): void {
    const arr = [...this.props.arr];
    this.setState({
      arr,
    });
    const sortInstance = new SortService(this.props.sortType);
    const steps = sortInstance.sort(arr);
    this.setState({
      currentStepIndex: 0,
      steps
    }, () => {
      this.nextStep();
    });
  }

  getCurrentStep(): SortStep {
    const {steps, currentStepIndex} = this.state;
    return steps[currentStepIndex];
  }

  getRectFillColor(index: number): ColorMap {
    const { steps, currentStepIndex } = this.state;
    const lastStepIndex = steps.length - 1;
    if (currentStepIndex === lastStepIndex) return ColorMap.success;
    const {swap, active} = this.getCurrentStep();
    if (swap && swap.some(item => item === index)) return  ColorMap.swapping;
    if (active && active.some(item => item === index)) return  ColorMap.active;
    return ColorMap.default;
  }

  getBesselLocate(): string {
    const {swap} = this.getCurrentStep();
    if (!swap) return '';
    const startPoint = `${swap[0] * (RECT_WIDTH + RECT_GAP) + RECT_GAP} ${MAX_VALUE * heightMaxValueRatio}`;
    const endPoint = `${swap[1] * (RECT_WIDTH + RECT_GAP) + RECT_GAP} ${MAX_VALUE * heightMaxValueRatio}`;

    const besselBasePoint = getBesselBasePoint(startPoint, endPoint);

    return `M${startPoint} Q${besselBasePoint}, ${endPoint}`;
  }

  componentWillMount(): void {
    this.genArrayAndSteps();
  }

  componentWillReceiveProps(nextProps: Readonly<{ arr?: number[]; sortType: SortType }>, nextContext: any): void {
    this.genArrayAndSteps();
  }

  render(): React.ReactNode {
    const {steps, currentStepIndex, autoplay} = this.state;
    if (!steps.length) return null;
    const currentStep = this.getCurrentStep();
    const currentArr = currentStep.arr;
    const sortType = this.props.sortType;
    return (
      <div className={styles.DemoCard}>
        <h4 className={styles.title}>{SortTitleMap[sortType]}</h4>
        <div className={styles.content}>
          <div className={styles.GraphContainer}>
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMinYMid meet">

              {/* 可视柱图 */}
              <g style={{transform: 'scaleY(-1)', transformOrigin: '50%'}}>
                {currentArr.map((value: number, index: number) => {
                  return <rect key={index} x={index * (RECT_WIDTH + RECT_GAP)} width={RECT_WIDTH} height={value * heightMaxValueRatio} fill={this.getRectFillColor(index)} />
                })}
              </g>

              {/* 数值文字 */}
              <g>
                {currentArr.map((value: number, index: number) => {
                  return <text textAnchor="middle" fontSize="5" key={index} x={index * (RECT_WIDTH + RECT_GAP) + RECT_WIDTH / 2} y={(MAX_VALUE - value) * heightMaxValueRatio - 1.5} >{value}</text>
                })}
              </g>

              {/* 箭头 & 文字 */}
              <defs>
                <marker id="arrowLeft" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M3,3 L6 0" fill="transparent" stroke={ColorMap.swapping}/>
                  <path d="M3,3 L6 6" fill="transparent" stroke={ColorMap.swapping}/>
                </marker>
                <marker id="arrowRight" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M3,3 L0 0" fill="transparent" stroke={ColorMap.swapping}/>
                  <path d="M3,3 L0 6" fill="transparent" stroke={ColorMap.swapping}/>
                </marker>
              </defs>

              {/* 连接线 */}
              {this.getBesselLocate() && <g style={{transform: 'translateY(2px)'}}>
                <path d={this.getBesselLocate()} stroke={ColorMap.swapping} fill="transparent" strokeWidth="0.5" markerStart="url(#arrowLeft)"  markerEnd="url(#arrowRight)" />
              </g>}

            </svg>
          </div>
          <div className={styles.BashContainer}>
            <Bash steps={steps} currStepIndex={currentStepIndex} />
          </div>
          <div className={styles.OpContainer}>
            <button style={{marginRight: '3em'}} onClick={this.handleResetClick.bind(this)}>reset</button>
            <button onClick={this.handleToggleAutoplayClick.bind(this)}>{autoplay ? 'pause' : 'play'}</button>
            <button onClick={this.handlePrevClick.bind(this)} disabled={autoplay}>prev</button>
            <button onClick={this.handleNextClick.bind(this)} disabled={autoplay}>next</button>
          </div>
        </div>

      </div>
    );
  }
}