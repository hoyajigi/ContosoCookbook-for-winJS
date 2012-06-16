(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            //element.querySelector("article .item-subtitle").textContent = item.subtitle;
            //element.querySelector("article .item-image").src = item.backgroundImage;
            //element.querySelector("article .item-image").alt = item.subtitle;
            //element.querySelector("article .item-content").innerHTML = item.content;
            //element.querySelector(".content").focus();
          //  var item = options && options.item ? options.item : data.items.getAt(0);
            //element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            //element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.preptime;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.shortTitle;

            // Display ingredients list
            var ingredients = element.querySelector("article .item-ingredients");
            for (var i = 0; i < item.ingredients.length; i++) {
                var ingredient = document.createElement("h2");
                ingredient.textContent = item.ingredients[i];
                ingredient.className = "ingredient";
                ingredients.appendChild(ingredient);
            }

            // Display cooking directions
            element.querySelector("article .item-directions").textContent = item.directions;

        }
    });
})();
