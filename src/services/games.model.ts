import * as firebase from "firebase";
import {GameResult, IFirestoreGame, IMove} from "../types";
import {IsNotEmpty, IsString} from "class-validator";
import {Expose} from "class-transformer";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    readonly player1: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    readonly player2: string;
}

export class UpdateGameDto {
    @Expose()
    readonly moves: IMove[];

    @Expose()
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
