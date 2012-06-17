// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    var app = WinJS.Application;
    var appdata = Windows.Storage.ApplicationData;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    WinJS.strictProcessing();

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                Windows.UI.Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().clear();

                Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync()
                .done(function (channel) {
                    var wsc = Windows.Security.Cryptography;
                    var buffer = wsc.CryptographicBuffer.convertStringToBinary(channel.uri, wsc.BinaryStringEncoding.utf8);

                    var uri = wsc.CryptographicBuffer.encodeToBase64String(buffer);

                    WinJS.xhr({ url: "http://ContosoRecipes8.cloudapp.net?uri=" + uri })
                    .done(function (xhr) {
                        if (xhr.status < 200 || xhr.status >= 300) {
                            var dialog = new Windows.UI.Popups.MessageDialog("Unable to open push notification channel");
                            dialog.showAsync();
                        }
                    });
                });


                if (args.detail.arguments !== "") {
                    Application.activationArgs = args.detail.arguments;
                } else {

                    var remember = appdata.current.roamingSettings.values["remember"];
                    remember = !remember ? false : remember;

                    if (remember) {
                        var location = appdata.current.roamingSettings.values["location"];
                        if (typeof (location !== "undefined" && location !== "")) {
                            Application.activationArgs = location;
                        }
                    }
                }

            } else {
                // TODO: This application has been reactivated from suspension.
                var location = appdata.current.roamingSettings.values["location"];

                if (typeof (location) !== "undefined" && location != "")
                    Application.activationArgs = location;
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        var location = document.querySelector("#contenthost").winControl.currentLocation;
        appdata.current.roamingSettings.values["location"] = location;
    };

    app.onsettings = function (args) {
        args.detail.applicationcommands = {
            "about": {
                href: "/pages/about/about.html",
                title: "About"
            },
            "preferences": {
                href: "/pages/preferences/preferences.html",
                title: "Preferences"
            }
        }

        WinJS.UI.SettingsFlyout.populateSettings(args);
    }

    app.start();
})();
