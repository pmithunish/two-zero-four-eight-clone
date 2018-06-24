import * as fromGame from './game.reducer';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

export interface AppState {
  game: fromGame.GameState;
}

export const reducers: ActionReducerMap<AppState> = {
  game: fromGame.reducer
};

const AppState = {
  game: {}
};

export const getAppState = createFeatureSelector<AppState>('game');

export const getGameState = createSelector(
  getAppState,
  (state: AppState) => state.game
);

export const getGameData = createSelector(getGameState, fromGame.getGameData);
