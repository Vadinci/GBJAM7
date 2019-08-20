define('game/modules/statemachine', [

], function (

) {
    return function (settings) {
        let _states = [];
        let _currentState;

        let _machineData = {};

        let _isUpdating = false;

        let _applyOnState = function (funcName) {
            if (!_currentState) return;
            if (!_currentState[funcName]) return;

            _currentState[funcName].call(_currentState, _machineData);
        };

        let addState = function (state) {
            let key = state.name;
            if (!key) throw "state needs a name!";

            if (_states[key]) throw "already added a state with the name " + key;

            _states[key] = state;
        };

        let setState = function (key) {
            if (_currentState) {
                if (_currentState.name === key) return;
                _applyOnState('stop');
            }
            _currentState = undefined;
            if (!_states[key]) return;

            console.log(key);

            _currentState = _states[key];
            _applyOnState('start');

            if (_isUpdating) _applyOnState('update');
        };

        let getCurrentState = function () {
            return _currentState;
        };

        let setData = function (key, val) {
            _machineData[key] = val;
        };

        let getData = function () {
            return _machineData;
        }

        let self = {
            name: settings.name || 'stateMachine',
            update: function () {
                _isUpdating = true;
                _applyOnState('update');
                _isUpdating = false;
            },

            addState: addState,
            setState: setState,
            getCurrentState: getCurrentState,

            setData: setData,
            getData: getData,


            //only used when added as a component
            start: function (data) {

            },
            die: function (data) {

            }
        };
        _machineData.stateMachine = self;
        return self;
    };
});