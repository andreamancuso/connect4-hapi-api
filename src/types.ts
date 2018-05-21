import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export interface IFirebaseConfig {
    readonly apiKey: string,
    readonly projectId: string,
    readonly authDomain: string
}

export enum CoinSlot {
    Blank = 0,
    Player1 = 1,
    Player2 = 2,
}

export type PlayerCoinSlot = CoinSlot.Player1|CoinSlot.Player2;

export enum GameResult {
    InProgress = -1,
    Draw = 0, // Not yet supported
    Player1Won = 1,
    Player2Won = 2
}

export interface IMove {
    player: PlayerCoinSlot,
    columnIndex: number
}

export interface IGame {
    player1: string,
    player2: string,
    moves: IMove[],
    date: Date,
    result: GameResult
}

export interface IGameEntity extends IGame {
    id: string,
}

export interface IFirestoreGame {
    player1: string,
    player2: string,
    moves: IMove[],
    date: Timestamp,
    result: GameResult
}
