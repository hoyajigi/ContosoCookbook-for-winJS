// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var appdata = Windows.Storage.ApplicationData;

    WinJS.UI.Pages.define("/pages/preferences/preferences.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            var remember = appdata.current.roamingSettings.values["remember"];
            remember = !remember ? false : remember;
            document.querySelector("#rememberPosition").checked = remember;
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            // TODO: Respond to changes in viewState.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        }
    });

    WinJS.Namespace.define("preferences", {
        rememberPosition: function () {
            appdata.current.roamingSettings.values["remember"] = document.querySelector("#rememberPosition").checked;
        }
    });
})();
