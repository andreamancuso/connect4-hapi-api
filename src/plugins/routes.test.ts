import {expect} from 'chai';
import * as hapi from "hapi";
import * as sinon from "sinon";
import {PLUGIN_GAMES_SERVICE, PLUGIN_GAMES_SERVICE_INSTANCE} from "../constants";
import {GameResult} from "../types";

const {plugin} = require('./routes');

describe('Games API', () => {
    let server, gamesService;

    beforeEach(async () => {
        gamesService = {
            findOne: sinon.stub(),
            findAll: sinon.stub(),
            create: sinon.stub(),
            update: sinon.stub(),
        };

        server = hapi.server({ port: 80 });

        await server.register({ plugin: {register: (server, options) => {
                server.expose(PLUGIN_GAMES_SERVICE_INSTANCE, gamesService);
            }, name: PLUGIN_GAMES_SERVICE, version: "0.1.0"}, options: {} });

        await server.register({ plugin});
    });

    describe('GET /games', () => {
        it('should return a collection of game entities', async () => {
            gamesService.findAll.returns(Promise.resolve([]));

            const res = await server.inject('/games');

            expect(gamesService.findAll.callCount).to.equal(1);

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.deep.equal([]);
        })
    });

    describe('GET /games/game-id', () => {
        it('should return a game entity', async () => {
            gamesService.findOne.returns(Promise.resolve({}));

            const res = await server.inject('/games/game-id');

            expect(gamesService.findOne.callCount).to.equal(1);
            expect(gamesService.findOne.firstCall.args[0]).to.equal('game-id');

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.deep.equal({});
        })
    });

    describe('POST /games', () => {
        it('should return create a game entity', async () => {
            gamesService.create.returns(Promise.resolve({id: 'game-id'}));

            const res = await server.inject({method: 'POST', url: '/games', payload: {player1: 'Andy', player2: 'Josh'}});

            expect(gamesService.create.callCount).to.equal(1);
            expect(gamesService.create.firstCall.args[0]).to.deep.equal({player1: 'Andy', player2: 'Josh'});

            expect(res.statusCode).to.equal(201);
            expect(res.headers.location).to.equal('/games/game-id');
            expect(res.result).to.deep.equal({id: 'game-id'});
        })
    });

    describe('PUT /games/game-id', () => {
        it('should return create a game entity', async () => {
            gamesService.update.returns(Promise.resolve());

            const res = await server.inject({method: 'PUT', url: '/games/game-id', payload: {
                result: GameResult.Player1Won, moves: []
            }});

            expect(gamesService.update.callCount).to.equal(1);
            expect(gamesService.update.firstCall.args[0]).to.equal('game-id');
            expect(gamesService.update.firstCall.args[1]).to.deep.equal({
                result: GameResult.Player1Won, moves: []
            });

            expect(res.statusCode).to.equal(204);
        })
    });
});
