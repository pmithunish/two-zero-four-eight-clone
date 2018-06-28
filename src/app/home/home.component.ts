import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromStore from './../store';
import { Generator, MoveUp, MoveDown, MoveLeft, MoveRight } from './../store';
import {
  trigger,
  query,
  style,
  transition,
  stagger,
  animate
} from '@angular/animations';

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
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('page-animation', [
      transition(':enter', [
        query(
          '.mat-card',
          style({ opacity: 0, transform: 'translateY(-200px)' })
        ),
        query('.mat-card', [
          stagger(100, [
            animate(
              '500ms cubic-bezier(.56,.1,.53,1.33)',
              style({ opacity: 1, transform: '*' })
            )
          ])
        ])
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  game: Array<Array<Tile>>;
  sampleSpace: Array<Position>;
  newTileSampleSpace: Array<Tile>;
  changed: Boolean = null;
  $tester;
  $input;
  $game: Observable<Array<Array<Tile>>>;
  constructor(private store: Store<fromStore.AppState>) {}

  ngOnInit() {
    this.$game = this.store.pipe(
      select('game'),
      map(state => state.data)
    );
    this.$game.subscribe(data => (this.game = data));
    this.newTileSampleSpace = [
      { label: 2, color: '#E57373' },
      { label: 4, color: '#F06292' }
    ];

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
        map(event => {
          event.preventDefault();
          return event.code;
        })
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
    let outerIndex = null;
    let innerIndex = null;
    let tile = null;
    let gameAfterGenerator = null;
    const sampleSpace = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.game[i][j].label === 0) {
          sampleSpace.push({ x: i, y: j });
        }
      }
    }
    if (sampleSpace.length) {
      const index = Math.floor(Math.random() * sampleSpace.length);
      outerIndex = sampleSpace[index].x;
      innerIndex = sampleSpace[index].y;
      const tileIndex = Math.floor(
        Math.random() * this.newTileSampleSpace.length
      );
      const innerArray = this.game[outerIndex];
      tile = this.newTileSampleSpace[tileIndex];
      gameAfterGenerator = [
        ...innerArray.slice(0, innerIndex),
        tile,
        ...innerArray.slice(innerIndex + 1)
      ];
      this.store.dispatch(
        new Generator([
          ...this.game.slice(0, outerIndex),
          gameAfterGenerator,
          ...this.game.slice(outerIndex + 1)
        ])
      );
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

  setChanged(before: Array<Tile>, after: Array<Tile>) {
    for (let i = 0; i < 4; i++) {
      if (after[i] && after[i].label !== before[i].label) {
        this.changed = true;
      }
    }
  }

  AddTile(param: Array<Tile>): Array<Tile> {
    return [AllNumbers[param.pop().label * 2]];
  }

  singleReducer(array: Array<Tile>) {
    return new Promise(resolve => {
      const filtered = array.filter(tile => tile.label !== 0);
      this.setChanged(array, filtered);
      if (filtered.length <= 1) {
        resolve(this.normalizer(filtered));
      } else if (filtered.length === 2) {
        if (filtered[0].label === filtered[1].label) {
          this.changed = true;
          const beforeNormalize = this.AddTile(filtered);
          resolve(this.normalizer(beforeNormalize));
        } else {
          resolve(this.normalizer(filtered));
        }
      } else if (filtered.length > 2) {
        const arr1 = [];
        const arr2 = [];
        const arr3 = [];
        if (filtered.length === 3) {
          arr1.push(filtered[0]);
          arr1.push(filtered[1]);
          arr2.push(filtered[1]);
          arr2.push(filtered[2]);
          if (arr1[0].label === arr1[1].label) {
            this.changed = true;
            const beforeNormalize = this.AddTile(arr1);
            beforeNormalize.push(filtered[2]);
            resolve(this.normalizer(beforeNormalize));
          } else if (arr2[0].label === arr2[1].label) {
            this.changed = true;
            const beforeNormalize = [filtered[0], ...this.AddTile(arr2)];
            resolve(this.normalizer(beforeNormalize));
          } else {
            resolve(this.normalizer(filtered));
          }
        } else if (filtered.length === 4) {
          arr1.push(filtered[0]);
          arr1.push(filtered[1]);
          arr2.push(filtered[1]);
          arr2.push(filtered[2]);
          arr3.push(filtered[2]);
          arr3.push(filtered[3]);
          if (
            arr1[0].label === arr1[1].label &&
            arr3[0].label === arr3[1].label
          ) {
            this.changed = true;
            const beforeNormalise = [
              ...this.AddTile(arr1),
              ...this.AddTile(arr2)
            ];
            resolve(this.normalizer(beforeNormalise));
          } else if (
            arr1[0].label === arr1[1].label &&
            arr3[0].label !== arr3[1].label
          ) {
            this.changed = true;
            const beforeNormalise = [
              ...this.AddTile(arr1),
              filtered[2],
              filtered[3]
            ];
            resolve(this.normalizer(beforeNormalise));
          } else if (arr2[0].label === arr2[1].label) {
            this.changed = true;
            const beforeNormalise = [
              filtered[0],
              ...this.AddTile(arr2),
              filtered[3]
            ];
            resolve(this.normalizer(beforeNormalise));
          } else if (
            arr1[0].label !== arr1[1].label &&
            arr3[0].label === arr3[1].label
          ) {
            this.changed = true;
            const beforeNormalise = [
              filtered[0],
              filtered[1],
              ...this.AddTile(arr3)
            ];
            resolve(this.normalizer(beforeNormalise));
          } else {
            resolve(this.normalizer(filtered));
          }
        }
      }
    });
  }

  generateAfterResolve() {
    if (this.changed) {
      this.generator();
      this.changed = null;
    }
  }

  resolveUp() {
    const splitGame: Array<Array<Tile>> = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        splitGame[i].push(this.game[j][i]);
      }
    }
    const promiseArray = splitGame.map(splitArray =>
      this.singleReducer(splitArray)
    );
    Promise.all(promiseArray).then(processed => {
      const reconstructGame = [[], [], [], []];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          reconstructGame[i].push(processed[j][i]);
        }
      }
      this.store.dispatch(new MoveUp(reconstructGame));
      this.generateAfterResolve();
    });
  }

  resolveDown() {
    const splitGame: Array<Array<Tile>> = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      for (let j = 3; j >= 0; j--) {
        splitGame[i].push(this.game[j][i]);
      }
    }
    const promiseArray = splitGame.map(spiltArray =>
      this.singleReducer(spiltArray)
    );
    Promise.all(promiseArray).then((processed: Array<Array<Tile>>) => {
      const reconstructGame = [[], [], [], []];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          reconstructGame[i].push(processed[j].pop());
        }
      }
      this.store.dispatch(new MoveDown(reconstructGame));
      this.generateAfterResolve();
    });
  }

  resolveLeft() {
    const splitGame: Array<Array<Tile>> = [];
    this.game.forEach(array => {
      splitGame.push(array);
    });
    const promiseArray = splitGame.map(splitArray =>
      this.singleReducer(splitArray)
    );
    Promise.all(promiseArray).then(processed => {
      const reconstructGame = [];
      processed.forEach(splitArray => {
        reconstructGame.push(splitArray);
      });
      this.store.dispatch(new MoveLeft(reconstructGame));
      this.generateAfterResolve();
    });
  }

  resolveRight() {
    const splitGame: Array<Array<Tile>> = [];
    this.game.forEach(array => {
      const temp = [];
      for (let i = 3; i >= 0; i--) {
        temp.push(array[i]);
      }
      splitGame.push(temp);
    });
    const promiseArray = splitGame.map(splitArray =>
      this.singleReducer(splitArray)
    );
    Promise.all(promiseArray).then(processed => {
      const reconstructGame = [];
      processed.forEach((internalArray: Array<Tile>) => {
        const temp = [];
        for (let i = 0; i < 4; i++) {
          temp.push(internalArray.pop());
        }
        reconstructGame.push(temp);
      });
      this.store.dispatch(new MoveRight(reconstructGame));
      this.generateAfterResolve();
    });
  }
}

interface Position {
  x: number;
  y: number;
}

export interface Tile {
  label: number;
  color: string;
}
