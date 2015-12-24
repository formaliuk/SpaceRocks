/**
 * Created by omnic on 11/29/2015.
 */
var Point = require('./Point');
var Debug = require('../../Debug');

module.exports = (function () {
    var entity = function (shape) {
        this._shape = shape;
        this._behaviors = [];
        this.isAlive = true;
        this.position = new Point(0, 0);
        this.velocity = new Point(0, 0);
        var self = this;
        Object.defineProperties(self, {
            rotation: {
                enumerable: true,
                writeable: true,
                get: function () {
                    return self._shape.rotation;
                },
                set: function (value) {
                    self._shape.rotation = value;
                }
            },
            position: {
                enumerable: true,
                writeable: true,
                get: function () {
                    return self._shape.position;
                },
                set: function (value) {
                    self._shape.position = value;
                }
            },
            shape: {
                value: shape,
                writeable: false,
                enumerable: true
            }
        });
        this.rotation = 0;
    };

    entity.prototype.render = function (renderer) {
        this._shape.render(renderer);
    };

    entity.prototype.update = function (gameContainer) {
        _invokeBehaviors.call(this, gameContainer);
        var vX = this.velocity.x * gameContainer.delta;
        var vY = this.velocity.y * gameContainer.delta;
        this.position = this.position.translate({x: vX, y: vY});
    };

    entity.prototype.addBehavior = function (newBehavior) {
        this._behaviors.push(newBehavior);
    }

    function _invokeBehaviors(gameContainer) {
        var entity = this;
        this._behaviors.forEach(function (behavior) {
            behavior(gameContainer, entity);
        });
    }

    return entity;
})
();