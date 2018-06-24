import { Action } from '@ngrx/store';
import { Tile } from './../../home/home.component';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum GameActionTypes {
  MOVE_UP = '[Game] Move Up',
  MOVE_DOWN = '[Game] Move Down',
  MOVE_LEFT = '[Game] Move Left',
  MOVE_RIGHT = '[Game] Move Right',
  GENERATOR = '[Game] Generator'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class MoveUp implements Action {
  readonly type = GameActionTypes.MOVE_UP;

  constructor(public payload: Array<Array<Tile>>) {}
}

export class MoveDown implements Action {
  readonly type = GameActionTypes.MOVE_DOWN;

  constructor(public payload: Array<Array<Tile>>) {}
}

export class MoveLeft implements Action {
  readonly type = GameActionTypes.MOVE_LEFT;

  constructor(public payload: Array<Array<Tile>>) {}
}

export class MoveRight implements Action {
  readonly type = GameActionTypes.MOVE_RIGHT;

  constructor(public payload: Array<Array<Tile>>) {}
}

export class Generator implements Action {
  readonly type = GameActionTypes.GENERATOR;
  constructor(public payload: Array<Array<Tile>>) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type GameActions = MoveUp | MoveDown | MoveLeft | MoveRight | Generator;
