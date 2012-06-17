(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {
        groupKeySelector: function (item) {
            return item.group.key;
        },
        groupDataSelector: function (item) {
            return {
                title: item.group.title,
                shortTitle: item.group.shortTitle,
                backgroundImage: item.group.backgroundImage,
                click: function () {
                    nav.navigate("/pages/groupDetail/groupDetail.html", { group: item.group });
                }
            }
        },
        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />
            var list = Data.items.createGrouped(this.groupKeySelector,
                this.groupDataSelector);

            if (viewState === appViewState.snapped) {
                var listViews = document.querySelectorAll(".groupeditemslist");

                for (var i = 0; i < listViews.length; i++) {
                    var listView = listViews[i].winControl;

                    ui.setOptions(listView, {
                        itemDataSource: list.groups.dataSource,
                        groupDataSource: null,
                        layout: new ui.ListLayout()
                    });
                }
            }
            else {
                var zoomedInListView = document.querySelector("#zoomedInListView").winControl;

                ui.setOptions(zoomedInListView, {
                    itemDataSource: list.dataSource,
                    groupDataSource: list.groups.dataSource,
                    layout: new ui.GridLayout({ groupHeaderPosition: "top" })
                });

                var zoomedOutListView = document.querySelector("#zoomedOutListView").winControl;

                ui.setOptions(zoomedOutListView, {
                    itemDataSource: list.groups.dataSource,
                    groupDataSource: null,
                    layout: new ui.GridLayout({ groupHeaderPosition: "top" })
                });
            }
        },

        itemInvoked: function (args) {
            var zoomedOut = document.querySelector("#zoom").winControl.zoomedOut;

            if (appView.value === appViewState.snapped ||
                zoomedOut) {
                // If the page is snapped, the user invoked a group.
                var group = Data.groups.getAt(args.detail.itemIndex);
                nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: group.key });
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = Data.items.getAt(args.detail.itemIndex);
                nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
            }
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listViews = element.querySelectorAll(".groupeditemslist");

            for (var i = 0; i < listViews.length; i++) {
                var listView = listViews[i].winControl;

                ui.setOptions(listView, {
                    groupHeaderTemplate: document.querySelector(".headerTemplate"),
                    itemTemplate: document.querySelector(".itemtemplate"),
                    oniteminvoked: this.itemInvoked
                });

                var appbar = document.querySelector("#appbar").winControl;
                appbar.showOnlyCommands(["home"]);
                document.querySelector("#home").addEventListener("click", Application.navigateHome, false);

                this.initializeLayout(listView, appView.value);
                listView.element.focus();

            }
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector("#zoomedInListView").winControl;

            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this.initializeLayout(listView, viewState);
                }
            }
        }
    });
})();
