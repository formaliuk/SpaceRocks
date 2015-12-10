/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {

    var allStubs = [];

    function createNamedSpy(name) {
        var spy = sinon.spy();
        spy.methodName = name;
        return spy;
    }

    function createNamedStub(name) {
        var stub = sinon.stub();
        stub.methodName = name;
        return stub;
    }

    function createStubOfObject(obj) {
        var propName;
        var objMethods = [];
        for (propName in obj) {
            if (typeof obj[propName] === 'function') {
                objMethods.push(propName);
            }
        }
        objMethods.forEach(function (methodName) {
            obj[methodName] = createNamedStub(methodName);
        });
        return obj;
    }

    function createStubOfClass(targetClass, name) {
        var stubInstance = createStubOfObject(sinon.create(targetClass.prototype));
        stubInstance.methodName = name;
        return stubInstance;
    }

    function stubConstructor(name) {
        var realStub = sinon.stub();
        var ConstructorStub = function () {
            return realStub.apply(realStub, arguments);
        }
        ConstructorStub.getCalls = function () {
            return realStub.getCalls.apply(realStub);
        }
        ConstructorStub.returns = function () {
            return realStub.returns.apply(realStub, arguments);
        }
        ConstructorStub.methodName = name;
        Object.defineProperty(ConstructorStub, 'called', {
            get: function () {
                return realStub.called;
            },
            set: function () {
            }
        });
        Object.defineProperty(ConstructorStub, 'firstCall', {
            get: function () {
                return realStub.firstCall;
            },
            set: function () {
            }
        })
        return ConstructorStub;
    }


    return {
        create: function (name) {
            return createNamedSpy(name);
        },
        createStub: function (stubTarget) {
            if (typeof stubTarget == 'string') {
                return createNamedStub(stubTarget);
            } else if (typeof stubTarget == 'object') {
                return createStubOfObject(stubTarget);
            }
        },
        createStubInstance: function (stubTarget, name) {
            return createStubOfClass(stubTarget, name);
        },
        createComplex: function (params) {
            if (params.length) {
                var mockObj = {};
                params.forEach(function (spyName) {
                    mockObj[spyName] = createNamedSpy(spyName);
                });
                return mockObj;
            } else {
                throw new Error('createComplex spy requires an array of method names');
            }
        },
        replace: function (object, property) {
            var newStub = sinon.stub(object, property);
            newStub.methodName = property;
            allStubs.push(newStub);
            return newStub;
        },
        stubConstructor : function(name){
            return stubConstructor(name);
        },
        restoreAll: function () {
            allStubs.forEach(function (singleStub) {
                singleStub.restore();
            });
            allStubs = [];
        }
    };
})();