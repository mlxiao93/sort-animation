import React from 'react';
import './App.scss';
import {SortType} from './components/DemoCard/SortService';
import DemoCard from './components/DemoCard/DemoCard';
import styles from './app.module.scss'

class App extends React.Component<{}, {
  arr: number[]
}> {

  state = {
    arr: [8, 5, 3, 10, 4, 2, 1, 6, 7, 9]
  };

  render(): React.ReactNode {
    const { arr } = this.state;
    return (
      <div className="app">
        <div className={styles.CardContainer}>
          <div className={styles.card}>
            <DemoCard arr={arr} sortType={SortType.selectionSort} />
          </div>
          <div className={styles.card}>
            <DemoCard arr={arr} sortType={SortType.insertionSort} />
          </div>
          <div className={styles.card}>
            <DemoCard arr={arr} sortType={SortType.bubbleSort} />
          </div>
          <div className={styles.card}>
            <DemoCard arr={arr} sortType={SortType.quickSort} />
          </div>
          <div className={styles.card}>
            <DemoCard arr={arr} sortType={SortType.heapSort} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
