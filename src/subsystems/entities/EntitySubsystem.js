/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var entitySubsystem = function () {
        this._entities = [];
    };

    entitySubsystem.prototype.render = function (renderer) {
        this._entities.forEach(function (singleEntity) {
            singleEntity.render(renderer);
        });
    };

    entitySubsystem.prototype.update = function (gameContainer) {
        this._entities.forEach(function (singleEntity) {
            singleEntity.update(gameContainer.delta);
        })
    };

    entitySubsystem.prototype.initialize = function (container) {

    };

    entitySubsystem.prototype.addEntity = function (newEntity) {
        this._entities.push(newEntity);
    };

    return entitySubsystem;
})();