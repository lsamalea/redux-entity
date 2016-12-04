'use strict';

const ACTION_TYPES = require('./common/const').ACTION_TYPES;
const CONST = require('./common/const');

module.exports = function model (state, action) {
    if (!state) state = Object.assign({}, CONST.INITIAL_STATE);
    switch (action.type) {
        case ACTION_TYPES.RESET_ENTITY:  // fall through
        case ACTION_TYPES.FETCH_SUCCESS: // fall through
        case ACTION_TYPES.FETCH_FAILURE: // fall through
        case ACTION_TYPES.FETCH_REQUEST: {
            return Object.assign({}, state, {
                [action.entity]: entity(
                    state[action.entity],
                    action
                )
            });
        }
        case ACTION_TYPES.DELETE_ENTITY: {
            delete state[action.entity];
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
};

function entity (state, action) {
    if (!state) state = Object.assign({}, CONST.INITIAL_ENTITY_STATE);
    switch (action.type) {
        case ACTION_TYPES.FETCH_REQUEST: {
            return Object.assign({}, state, {
                isFetching: true,
                error     : null
            });
        }
        case ACTION_TYPES.FETCH_SUCCESS: {
            return Object.assign({}, state, {
                isFetching : false,
                lastUpdated: action.lastUpdated,
                data       : !action.append
                                ? action.data
                                : state.data
                                    ? state.data.concat(__toArray(action.data))
                                    : __toArray(action.data),
                error: null
            });
        }
        case ACTION_TYPES.FETCH_FAILURE: {
            return Object.assign({}, state, {
                isFetching : false,
                lastUpdated: action.lastUpdated,
                data       : null,
                error      : action.error
            });
        }
        case ACTION_TYPES.RESET_ENTITY: {
            return Object.assign({}, CONST.INITIAL_ENTITY_STATE, {
                lastUpdated: action.lastUpdated
            });
        }
        default: {
            return state;
        }
    }
}
function __toArray (obj) {
    return Array.isArray(obj) ? obj : [obj];
}
