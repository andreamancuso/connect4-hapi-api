import * as firebase from "firebase";
import {GameResult, IFirestoreGame, IMove} from "../types";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    readonly player1: string;

    @IsNotEmpty()
    @IsString()
    readonly player2: string;
}

export class UpdateGameDto {
    readonly moves: IMove[];
    readonly result: GameResult;
}

export const getGameFirestoreModel = (): IFirestoreGame => ({
    player1: '',
    player2: '',
    moves: [],
    date: firebase.firestore.Timestamp.now(),
    result: GameResult.InProgress,
});

export const convertGameFirestoreModelIntoGameModel = (firestoreGameModel: IFirestoreGame) => ({
    ...firestoreGameModel,
    date: firestoreGameModel.date.toDate()
});
