(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var item;

    var ondatarequest = function (e) {
        var request = e.request;
        request.data.properties.title = item.title;

        if (media.shareFile == null) {
            request.data.properties.description = "recipe ingredients and directions";

            var recipe = "INGREDIENTS\r\n";

            item.ingredients.forEach(function (ingredient) {
                recipe += ingredient + "\r\n";
            });

            recipe += ("\r\nDIRECTIONS\r\n" + item.directions);
            request.data.setText(recipe);

            var image = document.querySelector(".item-image");
            var uri = image.getAttribute("src");

            if (uri.indexOf("http://") == 0)
                uri = new Windows.Foundation.Uri(image.src);

            var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(uri);

            reference.openReadAsync().then(function displayThumbnail(stream) {
                document.querySelector(".shared-thumbnail").src = window.URL.createObjectURL(stream, false);
            });

            request.data.properties.thumbnail = reference;
            var deferral = request.getDeferral();
            request.data.setBitmap(reference);
            deferral.complete();
        }
        else {
            request.data.properties.description = "Recipe photo or video";
            
            var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(media.shareFile);
            request.data.properties.thumbnail = reference;
            request.data.setBitmap(reference);
            media.shareFile = null;
        }
    }

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.preptime;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.shortTitle;

            tiles.currentItem = item;

            var ingredients = element.querySelector("article .item-ingredients");
            for (var i = 0; i < item.ingredients.length; i++) {
                var ingredient = document.createElement("h2");
                ingredient.textContent = item.ingredients[i];
                ingredient.className = "ingredient";
                ingredients.appendChild(ingredient);
            }

            element.querySelector("article .item-directions").textContent = item.directions;
            element.querySelector(".content").focus();

            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

            dtm.removeEventListener("datarequested", ondatarequest);
            dtm.addEventListener("datarequested", ondatarequest);

            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["photo", "video", "home", "pin"]);

            document.querySelector("#photo").addEventListener("click", media.sharePhoto, false);
            document.querySelector("#video").addEventListener("click", media.shareVideo, false);
            document.querySelector("#pin").addEventListener("click", tiles.pinRecipe, false);
        },
    });
})();
