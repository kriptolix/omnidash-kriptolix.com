const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function buildPrefsWidget() {

    // Copy the same GSettings code from `extension.js`
    this.settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.omnidash@kriptolix.com');

    // Create a parent widget that we'll return from this function
    let prefsWidget = new Gtk.Grid({
        //margin-start: 18,
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });

    // Add a simple title and add it to the prefsWidget
    let title = new Gtk.Label({
        label: `<b>${Me.metadata.name} Preferences</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    // Create a label & switch for `show-indicator`
    let toggleLabel = new Gtk.Label({
        label: 'Show out of overiew:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(toggleLabel, 0, 1, 1, 1);

    let toggle = new Gtk.Switch({
        active: this.settings.get_boolean ('show-out-overview'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggle, 1, 1, 1, 1);

    let dashSizeLabel = new Gtk.Label({
        label: 'Dash Size',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(dashSizeLabel, 0, 2, 1, 1);

    let dashSize = new Gtk.ComboBoxText({
        //active: this.settings.get_boolean ('show-out-overview'),
        halign: Gtk.Align.END,
        visible: true
    });
        dashSize.append_text('Small');
        dashSize.append_text('Medium');
        dashSize.append_text("Big");
        dashSize.set_active (1);

    prefsWidget.attach(dashSize, 1, 2, 1, 1);

    // Bind the switch to the `show-indicator` key
    this.settings.bind(
        'show-out-overview',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Return our widget which will be added to the window
    return prefsWidget;
}
