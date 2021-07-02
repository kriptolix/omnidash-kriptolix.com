const { GLib, GnomeDesktop } = imports.gi;
const Main = imports.ui.main;

var FormatClock = class {    

    constructor(dash) {
    
    this.dash = dash;     

    this.dateMenu = Main.panel.statusArea['dateMenu'];
    this.clockBox = this.dateMenu.get_first_child();
    
    this.clockBox.set_vertical(true);
    //this.clockBox.set_y(this.dash.iconSize +14);
    this.dateMenu.set_y_expand(false);
    this.dateMenu.add_style_class_name('clockbox');
    this.fontSize = (this.dash.iconSize / 2) - (this.dash.iconSize /8);
    this.dateMenu._clockDisplay.set_style('font-size: '+ this.fontSize + 'px;');   
    
    this.clockDisplayHandlerId = this.dateMenu._clockDisplay.connect('notify::text', () => {
        this._updateClock();
    });  

    this._updateClock();

    Main.panel._centerBox.remove_actor(this.dateMenu.container);
    this.dash._dashContainer.insert_child_at_index(this.dateMenu.container, 1);

    print('FormatClock inited');

    }
   
    _updateClock() {        
                
        this.format = GLib.DateTime.new_now_local();
        this.stamp = this.format.format(' %R \n%b  %d');
                        
        this.dateMenu._clockDisplay.set_text(this.stamp);
    }

    _undoChanges() {

        this.dateMenu._clockDisplay.disconnect(this.clockDisplayHandlerId);
        this.stamp = this.dateMenu._clock.string_for_datetime(GLib.DateTime.new_now_local(), 0, false, true, false);

        this.dateMenu._clockDisplay.set_text(this.stamp);

        this.dash._dashContainer.remove_actor(this.dateMenu.container);
        
        this.clockBox.set_vertical(false);
        //this.clockBox.set_y(-1);
        this.dateMenu.set_y_expand(true);
        this.dateMenu.remove_style_class_name('clockbox');
        this.dateMenu._clockDisplay.set_style('');

        Main.panel._centerBox.add_child(this.dateMenu.container);

        print('Undo FormatClock Changes');
    }

};

