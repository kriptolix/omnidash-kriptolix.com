///////////////////


const OriginalClass = Reference to OriginalClass;
OriginalClass.Function you wnat to overide = function() {
   Whatever custom code you want to exectute
};


 Main.panel.statusArea.aggregateMenu.container.hide();
 Main.panel.statusArea.dateMenu.container.hide();
 Main.panel._centerBox.remove_child(Main.panel.statusArea.dateMenu.container);

indicator.connect('menu-set', this._onMenuSet.bind(this));
this._onMenuSet(indicator);

this.add_style_class_name(className);
this.remove_style_class_name(className);

setSensitive(sensitive) {
        this.reactive = sensitive;
        this.can_focus = sensitive;
        this.track_hover = sensitive;
    }


    this.menu.actor.add_style_class_name('aggregate-menu');




//////////////////

	vfunc_button_press_event(buttonEvent) {
        if (buttonEvent.button != 1)
            return Clutter.EVENT_PROPAGATE;

        return this._tryDragWindow(buttonEvent);
    }

    vfunc_touch_event(touchEvent) {
        if (touchEvent.type != Clutter.EventType.TOUCH_BEGIN)
            return Clutter.EVENT_PROPAGATE;

        return this._tryDragWindow(touchEvent);
    }

    vfunc_key_press_event(keyEvent) {
        let symbol = keyEvent.keyval;
        if (symbol == Clutter.KEY_Escape) {
            global.display.focus_default_window(keyEvent.time);
            return Clutter.EVENT_STOP;
        }

        return super.vfunc_key_press_event(keyEvent);
    }

    _toggleMenu(indicator) {
        if (!indicator || !indicator.mapped)
            return; // menu not supported by current session mode

        let menu = indicator.menu;
        if (!indicator.reactive)
            return;

        menu.toggle();
        if (menu.isOpen)
            menu.actor.navigate_focus(null, St.DirectionType.TAB_FORWARD, false);
    }

    toggleAppMenu() {
        this._toggleMenu(this.statusArea.appMenu);
    }

    toggleCalendar() {
        this._toggleMenu(this.statusArea.dateMenu);
    }

    closeCalendar() {
        let indicator = this.statusArea.dateMenu;
        if (!indicator) // calendar not supported by current session mode
            return;

        let menu = indicator.menu;
        if (!indicator.reactive)
            return;

        menu.close();
    }
