/**
 * Created by omnic on 11/29/2015.
 */

var Shape = require('../../../src/subsystems/entities/Shape');
var Point = require('../../../src/subsystems/entities/Point');
var Renderer = require('../../../src/engine/Renderer');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Shape', function () {

    var stubRenderer;
    beforeEach(function () {
        stubRenderer = spies.createStub(new Renderer(sinon.spy()));
    });

    it('should render points', function () {
        var points = [
            new Point(2, 3),
            new Point(6, 2),
            new Point(7, 1),
        ];
        var shape = new Shape(points);

        shape.render(stubRenderer);
        verify(stubRenderer.drawLine).wasCalledWith(2, 3, 6, 2);
        verify(stubRenderer.drawLine).wasCalledWith(6, 2, 7, 1);
        verify(stubRenderer.drawLine).wasCalledWith(7, 1, 2, 3);
    });
});