// Adobe Illustrator - Batch Resize
// Resize selected objects to a specified height in millimetres.
// Supports groups, paths, compound paths, embedded and linked images.

#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("Please open an Illustrator document first.");
        return;
    }

    var doc = app.activeDocument;
    var items = doc.selection;

    if (!items || items.length === 0) {
        alert("Please select one or more objects before running this script.");
        return;
    }

    var input = prompt(
        "Enter the desired height for all selected objects (in mm):",
        "50"
    );

    if (input === null) {
        return;
    }

    var newHeightMM = Number(input);

    if (!isFinite(newHeightMM) || newHeightMM <= 0) {
        alert("Please enter a valid positive height in millimetres.");
        return;
    }

    var pointsPerMM = 72 / 25.4;
    var newHeightPoints = newHeightMM * pointsPerMM;

    var resized = 0;
    var skipped = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        try {
            var supported =
                item.typename === "GroupItem" ||
                item.typename === "PathItem" ||
                item.typename === "CompoundPathItem" ||
                item.typename === "RasterItem" ||
                item.typename === "PlacedItem";

            if (!supported) {
                skipped++;
                continue;
            }

            // Illustrator bounds: [left, top, right, bottom]
            var bounds = item.visibleBounds;
            var currentHeight = Math.abs(bounds[1] - bounds[3]);

            if (currentHeight <= 0) {
                skipped++;
                continue;
            }

            var scaleFactor = (newHeightPoints / currentHeight) * 100;

            // Uniform scaling preserves the object's aspect ratio.
            item.resize(scaleFactor, scaleFactor);

            resized++;

        } catch (error) {
            skipped++;
        }
    }

    app.redraw();

    alert(
        "Batch resize complete.\n\n" +
        "Target height: " + newHeightMM + " mm\n" +
        "Objects resized: " + resized + "\n" +
        "Objects skipped: " + skipped
    );
})();



