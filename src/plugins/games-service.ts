'use strict';

import * as hapi from "hapi";
import {
    PLUGIN_FIREBASE,
    PLUGIN_FIREBASE_FIRESTORE_CLIENT,
    PLUGIN_GAMES_SERVICE,
    PLUGIN_GAMES_SERVICE_INSTANCE
} from "../constants";
import {GamesService} from "../services/games";
import * as firebase from "firebase";
import Firestore = firebase.firestore.Firestore;

export function register(server: hapi.Server, options) {
    const firestoreClient = server.plugins[PLUGIN_FIREBASE][PLUGIN_FIREBASE_FIRESTORE_CLIENT] as Firestore;
    const gamesService: GamesService = new GamesService(firestoreClient);

    server.expose(PLUGIN_GAMES_SERVICE_INSTANCE, gamesService);

}

exports.plugin = {register, name: PLUGIN_GAMES_SERVICE, version: "0.1.0", dependencies: PLUGIN_FIREBASE};
