/**
 * Created by omnic on 12/27/2015.
 */
module.exports = {
    entities: {
        ASTEROID_LARGE: 'asteroid-large',
        ASTEROID_MEDIUM: 'asteroid-medium',
        ASTEROID_SMALL: 'asteroid-small',
        PLAYER: 'player',
        FX: 'fx',
        BULLET: 'bullet'
    },
    events: {
        ENGINE_START: 'engine-start',
        NEW_GAME: 'new-game',
        NEW_LEVEL: 'new-level',
        GAME_RESET: 'game-reset',
        ENTITY_DEATH: 'entity-death',
        ENTITY_ADDED: 'entity-added',
        ENTITY_REMOVED: 'entity-removed',
        SCORE_CHANGE: 'score-change',
        PLAYER_LIFE_CHANGE: 'player-life-change',
        PLAYER_FIRE: 'player-fire',
        PLAYER_THRUST: 'player-thrust'
    },
    state: {
        LOADING: 'loading',
        START: 'start-screen',
        PLAY: 'play'
    }
};