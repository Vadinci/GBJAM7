define('game/utils/recorder', [
    'engine/core',
], function (
    Core
) {
    'use strict';
    //based on the source of this web example:
    //https://webrtc.github.io/samples/src/content/capture/canvas-record/
    const FPS = 30;
    const FILE_TYPE = 'mp4';
    const MIME_TYPE = 'video/mp4';
    const CODECS = 'codecs="avc1.42E01E, mp4a.40.2"';

    let _source = new MediaSource();
    let _sourceBuffer;
    let _recordedBlobs;
    let _superBuffer;

    let _canvas;
    let _stream;

    let _recorder;

    let _isRecording = false;

    //EVENT LISTENERS
    let onSourceOpen = function (evt) {
        sourceBuffer = mediaSource.addSourceBuffer(MIME_TYPE + '; ' + CODECS);
    };
    let onDataAvailable = function (evt) {
        if (evt.data && evt.data.size > 0) {
            _recordedBlobs.push(evt.data);
        }
    };
    let onRecorderStop = function (event) {
        _superBuffer = new Blob(_recordedBlobs, { type: MIME_TYPE });
    };

    _source.addEventListener('sourceopen', onSourceOpen, false);

    let self = {
        start: function (canvas) {
            if (_isRecording) return;
            _isRecording = true;

            _canvas = canvas || Core.canvas.getCanvasElement();
            _stream = _canvas.captureStream(FPS);

            _recorder = new MediaRecorder(_stream, {
                //options
            });

            _recordedBlobs = [];
            _superBuffer = undefined;

            _recorder.onstop = onRecorderStop;
            _recorder.ondataavailable = onDataAvailable;
            _recorder.start();

            console.log('started recording');
        },
        stop: function () {
            if (!_isRecording) return;
            _isRecording = false;

            _recorder.stop();
            console.log('finished recording');
        },
        save: function () {
            if (!_superBuffer) {
                console.warn('no buffer to save');
                return;
            }
            let link = document.createElement("a");
            link.download = 'video.' + FILE_TYPE;
            link.href = window.URL.createObjectURL(_superBuffer);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return self;
});