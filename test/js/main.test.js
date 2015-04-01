/**
 * Created by Eric on 3/14/2015.
 */

describe('Main', function () {
    describe('start function', function () {
        var canvasElement;
        var tempInput;

        beforeEach(function (done) {
            OMD.test.globalSpy(window, 'Kibo');
            OMD.test.globalSpy(SpaceRocks.InputManager, 'init');
            canvasElement = document.createElement('canvas');
            canvasElement.id = 'testCanvas';
            document.body.appendChild(canvasElement);
            done();
        });

        afterEach(function () {
            document.body.removeChild(canvasElement);
            OMD.test.restoreAll();
        });

        it('will set canvas context on Renderer', function () {
            var setCanvasSpy = SpaceRocks.Renderer.setCanvas = sinon.spy();
            var contextFromTestElement = canvasElement.getContext('2d');

            SpaceRocks.start('testCanvas');
            expect(setCanvasSpy.called).to.be(true);
            var contextPassedIn = setCanvasSpy.getCall(0).args[0];
            expect(contextPassedIn).to.be(contextFromTestElement);
        });

        it('will spawn player on EntityManager', function () {
            var tempEntity = SpaceRocks.Entity;
            var value1 = Math.random();
            var value2 = Math.random();
            var value3 = Math.random();
            SpaceRocks.Entity = function () {
                this.blarg = value1;
                this.foo = value2;
                this.bar = value3;
            };
            var playerSpy = SpaceRocks.EntityManager.player = sinon.spy();
            SpaceRocks.start('testCanvas');
            expect(playerSpy.calledOnce).to.be(true);
            var actualPlayer = playerSpy.getCall(0).args[0];
            expect(actualPlayer.blarg).to.be(value1);
            expect(actualPlayer.foo).to.be(value2);
            expect(actualPlayer.bar).to.be(value3);
            SpaceRocks.Entity = tempEntity;
        });

        it('will call setInterval with run()', function () {
            var setIntervalSpy = window.setInterval = sinon.spy();

            SpaceRocks.start(canvasElement.id);
            expect(setIntervalSpy.calledOnce).to.be(true);
            var functionCall = setIntervalSpy.getCall(0);
            expect(functionCall.args[0]).to.be(SpaceRocks.run);
            expect(functionCall.args[1]).to.be(1000 / 24);

        });

        it('will initialize InputManager with Kibo', function () {
            var initSpy = SpaceRocks.InputManager.init = sinon.spy();
            SpaceRocks.start(canvasElement.id);
            expect(initSpy.calledOnce).to.be(true);
        });
    });

    describe('the run() function', function () {
        var updateSpy;
        var drawSpy;
        var deltaStub;
        beforeEach(function (done) {
            updateSpy = OMD.test.globalSpy(SpaceRocks, 'update');
            deltaStub = OMD.test.globalStub(SpaceRocks, 'delta');
            drawSpy = OMD.test.globalSpy(SpaceRocks, 'draw');
            done();
        });

        afterEach(function () {
            OMD.test.restoreAll();
        });

        it('will call update() and draw() in the correct order', function () {
            var tempUpdate = SpaceRocks.update;
            var tempRender = SpaceRocks.draw;

            var updateCalled = false;
            var drawCalled = false;
            SpaceRocks.update = function () {
                updateCalled = true;
            };
            SpaceRocks.draw = function () {
                expect(updateCalled).to.be(true);
                drawCalled = true;
            };

            SpaceRocks.run();
            expect(updateCalled).to.be(true);
            expect(drawCalled).to.be(true);

            SpaceRocks.draw = tempRender;
            SpaceRocks.update = tempUpdate;

        });

        it('will pass delta value to update()', function () {
            var expectedDelta = 5.938;
            deltaStub.onFirstCall().returns(expectedDelta);
            SpaceRocks.run();
            expect(updateSpy.calledOnce).to.be(true);
            expect(updateSpy.getCall(0).args[0]).to.be(expectedDelta);

        });
    });
});