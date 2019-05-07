import React from 'react';
import {SortStep} from "./SortService";
import styles from './Bash.module.scss';

export default class Bash extends React.Component<{
  steps: SortStep[];
  currStepIndex: number;
}, {}> {

  static renderStepContent(step: SortStep, index: number, length: number): React.ReactNode {
    const {arr, swap, active, swapStart} = step;
    if (swap) {
      if (swapStart) {
        return (<div><span className="color-swapping">交换</span>&nbsp;<span className="color-code">{arr[swap[0]]}</span>&nbsp;<span className="color-swapping">和</span>&nbsp;<span className="color-code">{arr[swap[1]]}</span></div>);
      } else {
        return <div><span className="color-swapping">交换后：</span><span className="color-code">[{arr.join(', ')}]</span></div>
      }
    }
    if (active) {
      return <div><span className="color-active">比较</span>&nbsp;<span className="color-code">{arr[active[0]]}</span>&nbsp;<span className="color-active">和</span>&nbsp;<span className="color-code">{arr[active[1]]}</span></div>;
    }
    if (index === 0) {
      return <div><span className="color-default">原数组：</span><span className="color-code">[{arr.join(', ')}]</span></div>
    }
    if (index === length - 1) {
      return <div><span className="color-success">排序后：</span><span className="color-code">[{arr.join(', ')}]</span></div>
    }
    return null;
  }

  static renderStep(step: SortStep, index: number, length: number): React.ReactNode {
    return <div key={index} className={styles.step}>
      <div className={styles.LineNum}>{index + 1}</div>
      <div className={styles.Content}>
        { Bash.renderStepContent(step, index, length) }
      </div>
    </div>;
  }

  bashScrollRef: React.RefObject<any> = React.createRef();

  componentDidUpdate(prevProps: Readonly<{ steps: SortStep[]; currStepIndex: number }>, prevState: Readonly<{}>, snapshot?: any): void {
    const bashScrollEl = this.bashScrollRef.current as HTMLElement;
    bashScrollEl.scrollTop = bashScrollEl.scrollHeight;
  }

  render(): React.ReactNode {
    const {steps, currStepIndex} = this.props;
    if (!steps) return null;
    const length = steps.length;
    return <div className={styles.bash +  ' code'}>
      <div className={styles.ToolBar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14"><g fill="none" fillRule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" strokeWidth=".5"/><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" strokeWidth=".5"/><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" strokeWidth=".5"/></g></svg>
      </div>
      <div ref={this.bashScrollRef} className={styles.BashScroll}>
        {steps.map((step, index) => {
          if (index <= currStepIndex) {
            return Bash.renderStep(step, index, length);
          }
          return null;
        })}
      </div>
    </div>
  }
}