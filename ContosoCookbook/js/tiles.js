(function () {
    "use strict";

    var start = Windows.UI.StartScreen;

    WinJS.Namespace.define("tiles", {
        pinRecipe: function () {
            var logo = new Windows.Foundation.Uri("ms-appx:///images/logo.png");

            var tile = new start.SecondaryTile(
                tiles.currentItem.key,              // Tile ID
                tiles.currentItem.shortTitle,       // Tile short name
                tiles.currentItem.title,            // Tile display name
                tiles.currentItem.key,              // Activation argument
                start.TileOptions.showNameOnLogo,   // Tile options
                logo                                // Tile logo
            );

            tile.requestCreateAsync();
        },

        currentItem: null
    });
})();