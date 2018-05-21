'use strict';

import * as hapi from "hapi";
import {PLUGIN_API_ROUTES, PLUGIN_FIREBASE} from "../constants";
import {GamesService} from "../services/games";
import * as firebase from "firebase";
import Firestore = firebase.firestore.Firestore;
import {IGameEntity} from "../types";

export function register(server: hapi.Server, options) {
    const firestoreClient = server.plugins[PLUGIN_FIREBASE].firestoreClient as Firestore;

    const gamesService: GamesService = new GamesService(firestoreClient);

    server.route({
        method: "GET",
        path: "/games/{id?}",
        options: {
            cors: {
                origin: ['*']
            }
        },
        handler: async (request: hapi.Request, h) => {
            if (request.params.userId) {
                const game: IGameEntity|null = await gamesService.findOne(request.params.userId);
                const response = h.response(game);
                if (game) {
                    response.type('application/json');
                } else {
                    response.code(404);
                }

                return response;
            } else {
                const games: IGameEntity[] = await gamesService.findAll();
                const response = h.response(games);
                response.type('application/json');
                return response;
            }
        }
    });

}

exports.plugin = {register, name: PLUGIN_API_ROUTES, version: "0.1.0", dependencies: PLUGIN_FIREBASE};
