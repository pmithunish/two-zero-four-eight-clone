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
  multiTiles: Array<Array<Tile>>;
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

    this.multiTiles = [
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
        if (this.multiTiles[i][j].label === 0) {
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
      this.multiTiles[i][j] = this.newTileSampleSpace[tileIndex];
      console.log(this.newTileSampleSpace[tileIndex]);
    } else {
      console.log('game over');
    }
  }

  resolveUp() {
    console.log('resolve up');
    for (let i = 0; i < 4; i++) {
      let first = null;
      for (let j = 0; j < 4; j++) {
        if (this.multiTiles[j][i].label === 0) {
          if (first === null) {
            first = j;
          }
        }
        if (this.multiTiles[j][i].label > 0) {
          if (first !== null) {
            this.multiTiles[first][i] = this.multiTiles[j][i];
            this.multiTiles[j][i] = { label: 0, color: '' };
          }
          for (let k = j + 1; k < 4; k++) {
            if (this.multiTiles[k][i].label === this.multiTiles[j][i].label) {
              this.multiTiles[j][i] =
                AllNumbers[this.multiTiles[j][i].label * 2];
              this.multiTiles[k][i] = AllNumbers[0];
            }
          }
        }
      }
    }
    this.generator();
  }

  resolveDown() {
    console.log('resolve down');
  }

  resolveLeft() {
    console.log('resolve left');
    for (let i = 0; i < 4; i++) {
      let first = null;
      for (let j = 0; j < 4; j++) {
        if (this.multiTiles[i][j].label === 0) {
          if (first === null) {
            first = j;
          }
        }
        if (this.multiTiles[i][j].label > 0) {
          if (first !== null) {
            this.multiTiles[i][first] = this.multiTiles[i][j];
            this.multiTiles[i][j] = { label: 0, color: '' };
          }
          for (let k = j + 1; k < 4; k++) {
            if (this.multiTiles[i][k].label === this.multiTiles[i][j].label) {
              this.multiTiles[i][j] =
                AllNumbers[this.multiTiles[i][j].label * 2];
              this.multiTiles[i][k] = AllNumbers[0];
            }
          }
        }
      }
    }
    this.generator();
  }

  resolveRight() {
    console.log('resolve right');
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
