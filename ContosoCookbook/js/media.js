(function () {
    "use strict";

    var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;

    var capture = Windows.Media.Capture;

    WinJS.Namespace.define("media", {
        shareFile: null,
        sharePhoto: function () {
            var camera = new capture.CameraCaptureUI();

            camera.captureFileAsync(capture.CameraCaptureUIMode.photo)
            .done(function (file) {
                if (file != null) {
                    media.shareFile = file;
                    dtm.showShareUI();
                }
            });
        },
        shareVideo: function () {
            var camera = new capture.CameraCaptureUI();

            camera.videoSettings.format = capture.CameraCaptureUIVideoFormat.wmv;

            camera.captureFileAsync(capture.CameraCaptureUIMode.video)
            .done(function (file) {
                if (file != null) {
                    media.shareFile = file;
                    dtm.showShareUI();
                }
            });
        }
    });
})();