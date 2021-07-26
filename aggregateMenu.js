const { Clutter, St } = imports.gi;
const Main = imports.ui.main;

var FormatStatus = class {
    constructor(dash) {

        this.dash = dash; 

        this.aggregateMenu = Main.panel.statusArea['aggregateMenu'];

        Main.panel._rightBox.remove_actor(this.aggregateMenu.container);

        this.aggregateMenu._indicators.remove_all_children();       
        this.aggregateMenu._indicators.set_vertical(true);        
        this.aggregateMenu._indicators.set_x_align(Clutter.ActorAlign.CENTER);
        this.aggregateMenu._indicators.set_y_align(Clutter.ActorAlign.CENTER);

        this.aggregateMenu.set_y_expand(false);
        this.aggregateMenu.set_size((this.dash.iconSize / 2) +14, this.dash.iconSize +14);                
        this.aggregateMenu.add_style_class_name('status');        

        this._iconPower = new St.Icon({ icon_name: 'system-shutdown-symbolic',
                                        icon_size: (this.dash.iconSize / 2),
                                        style_class: 'status-icon'
                                    });

        this._iconVolume = new St.Icon({ icon_name: 'audio-volume-medium-symbolic',
                                        icon_size: (this.dash.iconSize / 2),
                                        style_class: 'status-icon'
                                    });

        this.aggregateMenu._indicators.add_child(this._iconVolume);
        this.aggregateMenu._indicators.add_child(this._iconPower);        

        this.dash._dashContainer.insert_child_at_index(this.aggregateMenu.container, 1);

        print('FormatStatus inited'); 
    }

    _undoChanges() {

        this.aggregateMenu._indicators.remove_all_children();
        this._iconPower.destroy();
        this._iconVolume.destroy();
        this.aggregateMenu.set_y_expand(true);        
        this.aggregateMenu.set_size(-1,-1);                       
        this.aggregateMenu.remove_style_class_name('status');        

        this.aggregateMenu._indicators.add_child(this.aggregateMenu._remoteAccess);
        this.aggregateMenu._indicators.add_child(this.aggregateMenu._thunderbolt);
        this.aggregateMenu._indicators.add_child(this.aggregateMenu._location);
        this.aggregateMenu._indicators.add_child(this.aggregateMenu._nightLight);
        if (this.aggregateMenu._network)
            this.aggregateMenu._indicators.add_child(this.aggregateMenu._network);
        if (this.aggregateMenu._bluetooth)
            this.aggregateMenu._indicators.add_child(this.aggregateMenu._bluetooth);
        this.aggregateMenu._indicators.add_child(this.aggregateMenu._rfkill);
        this.aggregateMenu._indicators.add_child(this.aggregateMenu._volume);
        this.aggregateMenu._indicators.add_child(this.aggregateMenu._power);

        this.aggregateMenu._indicators.set_vertical(false);
        this.aggregateMenu._indicators.set_x_align(Clutter.ActorAlign.FILL);
        this.aggregateMenu._indicators.set_y_align(Clutter.ActorAlign.FILL);

        this.dash._dashContainer.remove_actor(this.aggregateMenu.container);

        Main.panel._rightBox.add_child(this.aggregateMenu.container);

        print('Undo FormatStatus Changes'); 
    }
} 


