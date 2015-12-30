/**
 * Created by Eric on 12/10/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var SpaceRocks = require('../../src/game/SpaceRocks');
var actualModules = {
    Time: require('../../src/engine/Time'),
    SpaceEngine: require('../../src/engine/SpaceEngine'),
    StateManager: require('../../src/subsystems/state/StateManager'),
    PlayerSubsystem: require('../../src/subsystems/PlayerSubsystem'),
    EffectsSubsystem: require('../../src/subsystems/fx/EffectsSubsystem'),
    EntitySubsystem: require('../../src/subsystems/entities/EntitySubsystem'),
    UserInterface: require('../../src/subsystems/UserInterface'),
};

describe('SpaceRocks', function () {
    var mockedModules = {
        stubs: {}
    };

    function mockModule(name) {
        var mockModule = spies.createStub(name + 'Module');
        mockedModules[name] = mockModule;
        var moduleInstance = spies.createStubInstance(actualModules[name], name);
        mockModule.returns(moduleInstance);
        mockedModules.stubs[name] = moduleInstance;
        return mockModule;
    }

    beforeEach(function () {
        var stateManager = mockModule('StateManager');
        var playerSubsystem = mockModule('PlayerSubsystem');
        var entitySubsystem = mockModule('EntitySubsystem');
        var spaceEngine = mockModule('SpaceEngine');
        var timeModule = mockModule('Time');
        var effectsSubsystemModule = mockModule('EffectsSubsystem');
        var uiModule = mockModule('UserInterface');

        SpaceRocks = proxy('../../src/game/SpaceRocks', {
            '../engine/Time': timeModule,
            '../engine/SpaceEngine': spaceEngine,
            '../subsystems/state/StateManager': stateManager,
            '../subsystems/PlayerSubsystem': playerSubsystem,
            '../subsystems/entities/EntitySubsystem': entitySubsystem,
            '../subsystems/UserInterface': uiModule,
            '../subsystems/fx/EffectsSubsystem': effectsSubsystemModule,
        });

    });

    it('should call SpaceEngine with correct configuration', function () {
        var expectedCanvasId = 'my-test-id';
        var expectedConfig = {
            audioPath: 'audio/',
            canvas: expectedCanvasId,
            fps: 30,
            subsystems: [
                mockedModules.stubs.StateManager,
                mockedModules.stubs.PlayerSubsystem,
                mockedModules.stubs.EntitySubsystem,
                mockedModules.stubs.EffectsSubsystem,
                mockedModules.stubs.UserInterface,
            ]
        };
        var spaceRocks = new SpaceRocks(expectedCanvasId);
        verify(mockedModules.SpaceEngine).wasCalledWithNew();
        verify(mockedModules.SpaceEngine).wasCalledWithConfig(0, expectedConfig);
    });

    it('will initialize subsystems correctly', function () {
        var expectedPlayerSubsystemConfig = {
            entitySubsystem: mockedModules.stubs.EntitySubsystem,
            time: mockedModules.stubs.Time,
            playerWeaponDelay: 250
        };

        var spaceRocks = new SpaceRocks('mycanvas');

        verify(mockedModules.StateManager).wasCalledWithNew();
        verify(mockedModules.PlayerSubsystem).wasCalledWithNew();
        verify(mockedModules.EntitySubsystem).wasCalledWithNew();
        verify(mockedModules.EffectsSubsystem).wasCalledWithNew();
        verify(mockedModules.UserInterface).wasCalledWithNew();

        verify(mockedModules.PlayerSubsystem).wasCalledWithConfig(0, expectedPlayerSubsystemConfig);
        verify(mockedModules.StateManager).wasCalledWith(mockedModules.stubs.EntitySubsystem);
        verify(mockedModules.EffectsSubsystem).wasCalledWith(mockedModules.stubs.EntitySubsystem);
    });

    it('will call start on  engine', function () {
        var spaceRocks = new SpaceRocks('');
        verify(mockedModules.stubs.SpaceEngine.start).wasCalled();
    });
});