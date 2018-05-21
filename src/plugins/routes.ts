'use strict';

import * as hapi from "hapi";
import {plainToClass} from "class-transformer";
import {PLUGIN_API_ROUTES, PLUGIN_FIREBASE} from "../constants";
import {GamesService} from "../services/games";
import * as firebase from "firebase";
import Firestore = firebase.firestore.Firestore;
import {IGameEntity} from "../types";
import {CreateGameDto, UpdateGameDto} from "../services/games.model";

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
            if (request.params.id) {
                const game: IGameEntity|null = await gamesService.findOne(request.params.id);
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

    server.route({
        method: "POST",
        path: "/games",
        options: {
            cors: {
                origin: ['*']
            }
        },
        handler: async (request: hapi.Request, h) => {
            const createGameDto: CreateGameDto = plainToClass<CreateGameDto, object>(CreateGameDto, request.payload, {strategy: 'excludeAll'});

            if (!createGameDto.player1 || !createGameDto.player2) {
                return h
                    .response({message: 'Invalid data'})
                    .code(400);
            }

            const game: IGameEntity = await gamesService.create(createGameDto);

            return h
                .response(game)
                .header('Location', `/games/${game.id}`)
                .code(201)
                .type('application/json');
        }
    });

    server.route({
        method: "PUT",
        path: "/games/{id}",
        options: {
            cors: {
                origin: ['*']
            }
        },
        handler: async (request: hapi.Request, h) => {
            const updateGameDto: UpdateGameDto = plainToClass<UpdateGameDto, object>(UpdateGameDto, request.payload, {strategy: 'excludeAll'});

            await gamesService.update(request.params.id, updateGameDto);

            return h
                .response()
                .code(204);
        }
    });

}

exports.plugin = {register, name: PLUGIN_API_ROUTES, version: "0.1.0", dependencies: PLUGIN_FIREBASE};
