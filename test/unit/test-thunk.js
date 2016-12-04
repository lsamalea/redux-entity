'use strict';

const expect = require('expect');
const configureStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const loadEntity = require('../../src/thunk');
const ACTION_TYPES = require('../../src/common/const').ACTION_TYPES;

// Set up mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Thunk Action Creators', () => {
    let store, getState, entity;
    beforeEach(() => {
        entity = 'mockEntity';
        getState = {};
        store = mockStore(getState);
    });

    describe('loadEntity()', () => {
        describe('when loadEntity() succeeds', () => {
            it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', (done) => {
                const data = {foo: 'bar'};
                const promise = Promise.resolve(data);

                const expectedFetch = {
                    type: ACTION_TYPES.FETCH_REQUEST,
                    entity
                };

                const expectedSuccess = {
                    type       : ACTION_TYPES.FETCH_SUCCESS,
                    lastUpdated: undefined,         // Overwrite this in assertion
                    entity,
                    data,
                    append     : false
                };

                // Under test
                store.dispatch(
                    loadEntity(entity, promise, null)
                )
                .then(() => {
                    // Assert 2 actions were invoked
                    const actions = store.getActions();
                    expect(actions.length).toEqual(2);

                    // Asset FETCH_REQUEST was well-formed
                    const request = actions[0];
                    expect(request).toEqual(expectedFetch);

                    // Assert timestamp is present and valid
                    const success = actions[1];

                    expect(success.lastUpdated).toExist();
                    expect(success.lastUpdated).toBeA('number');

                    // Force timestamps to match for easier assertion
                    expectedSuccess.lastUpdated = success.lastUpdated;

                    // Assert FETCH_SUCCESS was well-formed
                    expect(success).toEqual(expectedSuccess);
                })
                .then(done)
                .catch(done);
            });
        });
        describe('when loadEntity() fails', () => {
            it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', (done) => {
                const error = { message: 'foo' };
                const promise = Promise.reject(error);

                const expectedRequest = {
                    type: ACTION_TYPES.FETCH_REQUEST,
                    entity
                };

                const expectedFailure = {
                    type       : ACTION_TYPES.FETCH_FAILURE,
                    lastUpdated: undefined,         // Overwrite this in assertion
                    entity,
                    error
                };

                // Under test
                store.dispatch(
                    loadEntity(
                        entity, promise, false
                    )
                )
                .then(() => {
                    // Assert 2 actions were invoked
                    const actions = store.getActions();
                    expect(actions.length).toEqual(2);

                    // Asset FETCH_REQUEST was well-formed
                    const request = actions[0];
                    expect(request).toEqual(expectedRequest);

                    // Assert timestamp is present and valid
                    const failure = actions[1];
                    expect(failure.lastUpdated).toExist();
                    expect(failure.lastUpdated).toBeA('number');

                    // Force timestamps to match for easier assertion
                    expectedFailure.lastUpdated = failure.lastUpdated;

                    // Assert FETCH_FAILURE was well-formed
                    expect(failure).toEqual(expectedFailure);
                })
                .then(done)
                .catch(done);
            });
        });
        describe('when loadEntity() is configured to be silent', () => {
            it('should not dispatch a FETCH_REQUEST action', (done) => {
                const data = {foo: 'bar'};
                const promise = Promise.resolve(data);

                const expectedSuccess = {
                    type       : ACTION_TYPES.FETCH_SUCCESS,
                    lastUpdated: undefined,         // Overwrite this in assertion
                    entity,
                    data,
                    append     : false
                };

                const configOptions = { silent: true };

                // Under test
                store.dispatch(
                    loadEntity(entity, promise, configOptions)
                )
                .then(() => {
                    // Assert 1 action was invoked
                    const actions = store.getActions();
                    expect(actions.length).toEqual(1);

                    // Assert timestamp is present and valid
                    const success = actions[0];
                    expect(success.lastUpdated).toExist();
                    expect(success.lastUpdated).toBeA('number');

                    // Force timestamps to match for easier assertion
                    expectedSuccess.lastUpdated = success.lastUpdated;

                    // Assert FETCH_SUCCESS was well-formed
                    expect(success).toEqual(expectedSuccess);
                })
                .then(done)
                .catch(done);
            });
        });
        describe('when loadEntity() is passed invalid arguments', () => {
            it('should throw an error when passed no arguments', () => {
                expect(() => {
                    store.dispatch(
                        loadEntity()
                    );
                }).toThrow('name is required, and must be a String');
            });
            it('should throw an error when entity name is null/undefined', () => {
                expect(() => {
                    store.dispatch(
                        loadEntity(null)
                    );
                }).toThrow('name is required, and must be a String');
                expect(() => {
                    store.dispatch(
                        loadEntity(undefined)
                    );
                }).toThrow('name is required, and must be a String');
            });
            it('should throw an error when entity name not passed a String', () => {
                expect(() => {
                    store.dispatch(
                        loadEntity(123)
                    );
                }).toThrow('name is required, and must be a String');
                expect(() => {
                    store.dispatch(
                        loadEntity({})
                    );
                }).toThrow('name is required, and must be a String');
                expect(() => {
                    store.dispatch(
                        loadEntity(new Date())
                    );
                }).toThrow('name is required, and must be a String');
            });
            it('should throw an error with an undefined data promise', () => {
                expect(() => {
                    store.dispatch(
                        loadEntity(entity)
                    );
                }).toThrow('promise is required, and must be a Promise');
            });
            it('should throw an error when a promise is not passed', () => {
                expect(() => {
                    store.dispatch(
                        loadEntity(entity, {})
                    );
                }).toThrow('promise is required, and must be a Promise');
            });
            it('should throw an error when invalid options are passed', () => {
                expect(() => {
                    store.dispatch(
                        loadEntity(entity, Promise.resolve(), 'foo')
                    );
                }).toThrow('options must be an Object');
                expect(() => {
                    store.dispatch(
                        loadEntity(entity, Promise.resolve(), 123)
                    );
                }).toThrow('options must be an Object');
                expect(() => {
                    store.dispatch(
                        loadEntity(entity, Promise.resolve(), [])
                    );
                }).toThrow('options must be an Object');
                expect(() => {
                    store.dispatch(
                        loadEntity(entity, Promise.resolve(), function () {})
                    );
                }).toThrow('options must be an Object');
            });
        });
    });
});