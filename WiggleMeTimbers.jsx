// wiggle application script
// Adobe After Effects

{
    function applyWiggle(freq, amp) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Please open a composition");
            return 0;
        }
        var props = comp.selectedProperties;
        if (props.length === 0) {
            alert("Select a property(Position, Scale, Rotation, etc.)");
            return 0;
        }
        var successCount = 0;
        var failedProps = [];
        app.beginUndoGroup("Apply");

        try {
            for (var i = 0; i < props.length; i++) {
                try {
                    if (props[i].canSetExpression) {
                        props[i].expression = "wiggle(" + freq + ", " + amp + ");";
                        successCount++;
                    }
                } catch (err) {
                    failedProps.push(props[i].name); // Added missing semicolon
                }
            }
        } finally {
            app.endUndoGroup();
        }
        if (failedProps.length > 0) {
            alert("Could not apply wiggle to:" + failedProps.join(", "));
        }
        return successCount;
    }

    function buildUI(thisObj) {
        var panel = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Wiggle Tool", undefined, {resizeable: true});

        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 8;
        panel.margins = 12;

        // main tool section
        var toolPanel = panel.add("panel", undefined, "Wiggle Settings");
        toolPanel.orientation = "column";
        toolPanel.alignChildren = ["fill", "top"];
        toolPanel.spacing = 6;
        toolPanel.margins = 8;

        // frequency 
        var freqGroup = toolPanel.add('group'); // Added missing semicolon
        freqGroup.add("statictext", undefined, "Frequency:");
        var freqInput = freqGroup.add("edittext", undefined, "2");
        freqInput.characters = 5;

        // amplitude
        var ampGroup = toolPanel.add("group");
        ampGroup.add("statictext", undefined, "Amplitude:");
        var ampInput = ampGroup.add("edittext", undefined, "10");
        ampInput.characters = 5;

        // Apply button
        var applyButton = toolPanel.add("button", undefined, "Apply Wiggle");

        // status label
        var statusLabel = toolPanel.add("statictext", undefined, "");
        statusLabel.alignment = ["fill", "top"];
        statusLabel.justify = "center";

        // credit
        var creditLabel = panel.add("statictext", undefined, "Made by pi-vfx-aep");
        creditLabel.alignment = ["fill", "top"];
        creditLabel.justify = "center";

        // apply logic
        applyButton.onClick = function () {
            var freq = parseFloat(freqInput.text);
            var amp = parseFloat(ampInput.text);

            if (isNaN(freq) || isNaN(amp) || freq < 0 || amp < 0) {
                statusLabel.text = "⚠ Please enter valid positive numbers.";
                return;
            }
            var count = applyWiggle(freq, amp);

            if (count > 0) {
                statusLabel.text = "✓ Applied to " + count + " propert" + (count === 1 ? "y." : "ies.");
            } else if (count === 0) {
                statusLabel.text = "⚠ No eligible properties found.";
            }
        };
        panel.layout.layout(true);
        return panel;
    }

    var myUI = buildUI(this);

    if (myUI instanceof Window) {
        myUI.center();
        myUI.show();
    }
}