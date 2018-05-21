import * as firebase from "firebase";
import {
    convertGameFirestoreModelIntoGameModel,
    CreateGameDto,
    getGameFirestoreModel,
    UpdateGameDto
} from "./games.model";
import {IFirestoreGame, IGameEntity} from "../types";

export class GamesService {
    private gamesCollectionRef: firebase.firestore.CollectionReference;

    constructor(private readonly firestore: firebase.firestore.Firestore) {
        this.gamesCollectionRef = firestore.collection('games');
    }

    findAll(): Promise<IGameEntity[]> {
        return new Promise((resolve, reject) => {
            this.gamesCollectionRef
                .get()
                .then((gamesSnapshot: firebase.firestore.QuerySnapshot) => {
                    resolve(gamesSnapshot.docs
                        .map((gameSnapshot: firebase.firestore.QueryDocumentSnapshot): IGameEntity => {
                            const {id} = gameSnapshot;
                            const documentData: firebase.firestore.DocumentData = gameSnapshot.data();
                            const game: IFirestoreGame = documentData as IFirestoreGame;

                            return {
                                id,
                                ...convertGameFirestoreModelIntoGameModel(game)
                            }
                        })
                    );
                })
                .catch(error => reject(error));
        });
    }

    findOne(id: string): Promise<IGameEntity|null> {
        return new Promise((resolve, reject) => {
            this.gamesCollectionRef
                .doc(id)
                .get()
                .then((gameSnapshot: firebase.firestore.DocumentSnapshot) => {
                    let result: IGameEntity|null = null;

                    if (gameSnapshot.exists) {
                        const {id} = gameSnapshot;
                        const documentData: firebase.firestore.DocumentData = gameSnapshot.data() as firebase.firestore.DocumentData;
                        const game: IFirestoreGame = documentData as IFirestoreGame;

                        result = {
                            id,
                            ...convertGameFirestoreModelIntoGameModel(game)
                        };
                    }

                    resolve(result);
                })
                .catch(error => reject(error));
        });
    }

    create(createGameDto: CreateGameDto): Promise<IGameEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const newGameRef = this.gamesCollectionRef.doc();
                const newGameData: IFirestoreGame = {
                    ...getGameFirestoreModel(),
                    ...createGameDto
                };

                await newGameRef.set(newGameData);

                resolve({
                    ...convertGameFirestoreModelIntoGameModel(newGameData),
                    id: newGameRef.id
                });
            } catch(error) {
                reject(error);
            }
        });
    }

    /**
     * Optimistic update here, should verify that document exists first
     */
    update(id: string, updateGameDto: UpdateGameDto) {
        const dataToUpdate = {
            moves: updateGameDto.moves,
            result: updateGameDto != null ? updateGameDto.result : null
        };

        return this.gamesCollectionRef
            .doc(id)
            .update(dataToUpdate);
    }

    delete(id: string) {
        return this.gamesCollectionRef
            .doc(id)
            .delete();
    }
}
