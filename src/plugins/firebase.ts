'use strict';

import * as hapi from "hapi";
import * as firebase from "firebase";
import {PLUGIN_FIREBASE, PLUGIN_FIREBASE_FIRESTORE_CLIENT} from "../constants";
import {initFirestore} from "../firestore-client";

export async function register(server: hapi.Server, options) {
    const {fbApiKey, fbProjectId} = server.settings.app;

    const firestoreClient: firebase.firestore.Firestore = await initFirestore({
        apiKey: fbApiKey,
        projectId: fbProjectId,
        authDomain: `${fbProjectId}.firebaseapp.com`
    });

    server.expose(PLUGIN_FIREBASE_FIRESTORE_CLIENT, firestoreClient);
}

exports.plugin = {register, name: PLUGIN_FIREBASE, version: "0.1.0"};
