import { Component, OnInit, HostListener } from '@angular/core';
import { interval, fromEvent } from 'rxjs';
import { map, take, mapTo, filter, distinctUntilChanged } from 'rxjs/operators';

const AllNumbers = {
  0: {
    label: 0,
    color: ''
  },
  2: {
    label: 2,
    color: '#E57373'
  },
  4: {
    label: 4,
    color: '#F06292'
  },
  8: {
    label: 8,
    color: '#BA68C8'
  },
  16: {
    label: 16,
    color: '#9575CD'
  },
  32: {
    label: 32,
    color: '#7986CB'
  },
  64: {
    label: 64,
    color: '#64B5F6'
  },
  128: {
    label: 128,
    color: '#4FC3F7'
  },
  256: {
    label: 256,
    color: '#4DD0E1'
  },
  512: {
    label: 512,
    color: '#4DB6AC'
  },
  1024: {
    label: 1024,
    color: '#81C784'
  },
  2048: {
    label: 2048,
    color: '#AED581'
  }
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  game: Array<Array<Tile>>;
  sampleSpace: Array<Position>;
  newTileSampleSpace: Array<Tile>;
  $tester;
  $input;
  constructor() {}

  ngOnInit() {
    this.newTileSampleSpace = [
      { label: 2, color: '#E57373' },
      { label: 4, color: '#F06292' }
    ];

    this.game = [
      [
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' }
      ],
      [
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' }
      ],
      [
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' }
      ],
      [
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' },
        { label: 0, color: '' }
      ]
    ];

    // this.$tester = interval(100)
    //   .pipe(
    //     map(val => this.generator()),
    //     take(16)
    //   )
    //   .subscribe();
    this.generator();

    this.$input = fromEvent(document, 'keyup')
      .pipe(
        filter(
          (event: KeyboardEvent) =>
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown' ||
            event.code === 'ArrowRight' ||
            event.code === 'ArrowLeft'
        ),
        map(event => event.code)
      )
      .subscribe(x => {
        if (x === 'ArrowUp') {
          this.resolveUp();
        } else if (x === 'ArrowDown') {
          this.resolveDown();
        } else if (x === 'ArrowLeft') {
          this.resolveLeft();
        } else if (x === 'ArrowRight') {
          this.resolveRight();
        }
      });
  }

  generator() {
    this.sampleSpace = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.game[i][j].label === 0) {
          this.sampleSpace.push({ x: i, y: j });
        }
      }
    }
    if (this.sampleSpace.length) {
      const index = Math.floor(Math.random() * this.sampleSpace.length);
      const i = this.sampleSpace[index].x;
      const j = this.sampleSpace[index].y;
      const tileIndex = Math.floor(
        Math.random() * this.newTileSampleSpace.length
      );
      this.game[i][j] = this.newTileSampleSpace[tileIndex];
      console.log(this.newTileSampleSpace[tileIndex]);
    } else {
      console.log('game over');
    }
  }

  normalizer(array?: Array<Tile>) {
    return new Promise(resolve => {
      if (array) {
        const tempArray: Array<Tile> = array;
        for (let i = array.length; i < 4; i++) {
          tempArray.push({ label: 0, color: '' });
        }
        resolve(tempArray);
      }
    });
  }

  singleReducer(array: Array<Tile>) {
    return new Promise(resolve => {
      const tempArray = array.filter(tile => tile.label !== 0);
      if (tempArray.length <= 1) {
        const finalArray = this.normalizer(tempArray);
        resolve(finalArray);
      }
    });
  }

  resolveUp() {
    console.log('resolve up: ');
    const arrowUpArray: Array<Array<Tile>> = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        arrowUpArray[i].push(this.game[j][i]);
      }
    }
    const promiseArray = arrowUpArray.map(array => this.singleReducer(array));
    const final = Promise.all(promiseArray);
    final.then(array => {
      const reconstructGame = [[], [], [], []];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          reconstructGame[i].push(array[j][i]);
        }
      }
      this.game = reconstructGame;
      this.generator();
      // console.log('reconstruct game: ', reconstructGame);
    });
  }

  resolveDown() {
    console.log('resolve down: ');
    const arrowUpArray: Array<Array<Tile>> = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      for (let j = 3; j >= 0; j--) {
        arrowUpArray[i].push(this.game[j][i]);
      }
    }
    const promiseArray = arrowUpArray.map(array => this.singleReducer(array));
    const final = Promise.all(promiseArray);
    final.then((array: Array<Array<Tile>>) => {
      const reconstructGame = [[], [], [], []];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          reconstructGame[i].push(array[j].pop());
        }
      }
      this.game = reconstructGame;
      this.generator();
      // console.log('reconstruct game: ', reconstructGame);
    });
  }

  resolveLeft() {
    console.log('resolve left');
    const arrowUpArray: Array<Array<Tile>> = [];
    this.game.forEach(array => {
      arrowUpArray.push(array);
    });
    const promiseArray = arrowUpArray.map(array => this.singleReducer(array));
    const final = Promise.all(promiseArray);
    final.then(array => {
      const reconstructGame = [];
      array.forEach(internalArray => {
        reconstructGame.push(internalArray);
      });
      this.game = reconstructGame;
      this.generator();
      // console.log('reconstruct game: ', reconstructGame);
    });
  }

  resolveRight() {
    console.log('resolve right');
    const arrowUpArray: Array<Array<Tile>> = [];
    this.game.forEach(array => {
      const tempArray = [];
      for (let i = 3; i >= 0; i--) {
        tempArray.push(array[i]);
      }
      arrowUpArray.push(tempArray);
    });
    const promiseArray = arrowUpArray.map(array => this.singleReducer(array));
    const final = Promise.all(promiseArray);
    final.then(array => {
      const reconstructGame = [];
      array.forEach((internalArray: Array<Tile>) => {
        const tempArray = [];
        for (let i = 0; i < 4; i++) {
          tempArray.push(internalArray.pop());
        }
        reconstructGame.push(tempArray);
      });
      this.game = reconstructGame;
      this.generator();
      // console.log('reconstruct game: ', reconstructGame);
    });
  }
}

interface Position {
  x: number;
  y: number;
}

interface Tile {
  label: number;
  color: string;
}
