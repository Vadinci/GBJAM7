define('engine/engine', [
    'engine/core/input',
    'engine/core/dispatcher',
], function (
    Input,
    Dispatcher
) {
    let startTime = 0;
    let previousTime = 0;
    let currentTime = 0;
    let runningTime = 0;

    let accumulatedTime = 0

    let ticks = 0;
    let frame = 0;

    let fps = 60;
    let mspf = 1000 / fps;

    let isRunning = false;

    let canvas;

    let entities = [];
    let updateOrder = [];
    let drawOrder = [];

    let addList = [];
    let removeList = [];

    let dispatcher = new Dispatcher();

    let tick = function () {
        let deltaTime;

        dispatcher.emit('preTick');

        currentTime = Date.now();
        deltaTime = currentTime - previousTime;
        runningTime = currentTime - startTime;

        previousTime = currentTime;

        accumulatedTime += deltaTime;

        //prevent becoming too big
        if (accumulatedTime > 200) {
            accumulatedTime = 200;
        }

        while (accumulatedTime >= mspf) {
            update(1);
            accumulatedTime -= mspf;
        }

        draw(1);

        if (_drawDebug) {
            drawDebug(1);
        }

        dispatcher.emit('postTick');
    };

    let update = function (dt) {
        let ii;
        let idx;
        let data = {};

        frame++;

        data.deltaTime = dt;
        data.currentTime = currentTime;
        data.runningTime = runningTime;
        data.frame = frame;


        dispatcher.emit('preUpdate', data);

        for (ii = updateOrder.length - 1; ii >= 0; --ii) {
            data.entity = updateOrder[ii];
            updateOrder[ii].update(data);
        }

        //check if any entities need to be added
        for (ii = 0; ii < addList.length; ii++) {
            entities.push(addList[ii]);
            addList[ii].isAdded = true;
            data.entity = addList[ii];
            addList[ii].start(data);

            updateOrder.push(addList[ii]);
            drawOrder.push(addList[ii]);
        }
        addList = [];

        //check if any entities need to be removed
        for (ii = 0; ii < removeList.length; ii++) {
            data.entity = removeList[ii];
            removeList[ii].die(data);
            removeList[ii].isAdded = false;

            updateOrder.splice(updateOrder.indexOf(removeList[ii]), 1);
            drawOrder.splice(updateOrder.indexOf(removeList[ii]), 1);
            entities.splice(entities.indexOf(removeList[ii]), 1);
        }
        removeList = [];

        sortEntities()

        dispatcher.emit('postUpdate', data);
    };

    let draw = function (dt) {
        let ii;
        let idx;
        let data = {};

        frame++;

        data.deltaTime = dt;
        data.currentTime = currentTime;
        data.runningTime = runningTime;
        data.frame = frame;

        data.canvas = canvas;

        //clear canvas
        canvas.clear();

        canvas.save();

       // debugger;
        dispatcher.emit('preDraw', data);

        for (ii = 0; ii < drawOrder.length; ii++) {
            data.entity = drawOrder[ii];
            drawOrder[ii].draw(data);
        }

        dispatcher.emit('postDraw', data);
       // debugger;

        canvas.restore();
    };

    let drawDebug = function (dt) {
        let ii;
        let idx;
        let data = {};

        frame++;

        data.deltaTime = dt;
        data.currentTime = currentTime;
        data.runningTime = runningTime;
        data.frame = frame;

        data.canvas = canvas;

        canvas.save();

        dispatcher.emit('preDrawDebug', data);

        for (ii = 0; ii < drawOrder.length; ii++) {
            data.entity = drawOrder[ii];
            drawOrder[ii].drawDebug(data);
        }

        dispatcher.emit('postDrawDebug', data);

        canvas.restore();
    };

    let addEntity = function (entity) {
        if (entity.parent || addList.indexOf(entity) !== -1) {
            return;
        }
        addList.push(entity);
    };

    let removeEntity = function (entity) {
        if (!entity.parent || removeList.indexOf(entity) !== -1) {
            return;
        }
        removeList.push(entity);
    };

    let sortEntities = function () {
        //sort update order
        //TODO in place sorting
        updateOrder.sort(function (a, b) {
            return a.priority - b.priority;
        });

        //sort draw order
        //TODO in place sorting
        drawOrder.sort(function (a, b) {
            return a.z - b.z;
        });
    };

    let loop = function () {
        tick();
        Input.flush();
        requestAnimFrame(loop);
    };

    let init = function (pCanvas, settings) {
        if (isRunning) return;
        isRunning = true;

        canvas = pCanvas;

        startTime = Date.now();
        previousTime = startTime;

        requestAnimFrame(loop);
    };

    let module = {
        init: init,

        add: addEntity,
        remove: removeEntity,

        setDebug: onOff => _drawDebug = onOff,

        on: dispatcher.on,
        off: dispatcher.off
    };
    return module;
});