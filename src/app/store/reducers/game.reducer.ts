import * as fromGame from './../actions/game.action';
import { Tile } from './../../home/home.component';

export interface GameState {
  data: Array<Array<Tile>>;
}

export const initialState: GameState = {
  data: [
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
  ]
};

const newTileSampleSpace = [
  { label: 2, color: '#E57373' },
  { label: 4, color: '#F06292' }
];

export function reducer(
  state = initialState,
  action: fromGame.GameActions
): GameState {
  switch (action.type) {
    case fromGame.GameActionTypes.MOVE_UP: {
      return {
        ...state,
        data: action.payload
      };
    }

    case fromGame.GameActionTypes.MOVE_DOWN: {
      return {
        ...state,
        data: action.payload
      };
    }

    case fromGame.GameActionTypes.MOVE_LEFT: {
      return {
        ...state,
        data: action.payload
      };
    }

    case fromGame.GameActionTypes.MOVE_RIGHT: {
      return {
        ...state,
        data: action.payload
      };
    }

    case fromGame.GameActionTypes.GENERATOR: {
      return {
        ...state,
        data: action.payload
      };
    }
  }
  return state;
}

export const getGameData = (game: GameState) => game.data;
