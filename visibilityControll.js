const { GObject, GLib, Meta, Shell, Clutter } = imports.gi;
const Layout = imports.ui.layout;
const Main = imports.ui.main;

const OverviewControls = imports.ui.overviewControls;
const ControlsManager = OverviewControls.ControlsManager;

const ShellActionMode = (Shell.ActionMode)?Shell.ActionMode:Shell.KeyBindingMode;

var State = {
    HIDDEN:  0,
    SHOWING: 1,
    SHOWN:   2,
    HIDDING: 3
};

var VisibilityManager = GObject.registerClass(
class VisibilityManager extends Clutter.Actor {

	_init(omnidash, aggregateMenu, dateMenu){

        super._init();        

        this.dash = omnidash;
        this.aggregateMenu = aggregateMenu.aggregateMenu.menu;
        this.dateMenu = dateMenu.dateMenu.menu;
		this._monitor = Main.layoutManager.primaryMonitor;
        
        this._preventHide = false;
        this.dockState = omnidash.dockState;
        this.hideDelay = 2000;                
        
		this._threshold = 100;
        this._timeout = 1000;
        
        this._pressureBarrier = new Layout.PressureBarrier(
            this._threshold,
            this._timeout,
            ShellActionMode.NORMAL
        );
        
        this._pressureBarrier.connect('trigger', (barrier) => {                
                if (this.dockState == State.HIDDEN){
                    this._animateIn(500, 250);
                }                             
            }
        );

        this.appsHandlerId = this.dash.showAppsButton.connect('button-press-event', () => {
            if (Main.overview.visible) {
                const checked = Main.overview.dash.showAppsButton.checked;
                Main.overview.dash.showAppsButton.checked = !checked;                     
            } 
            else {
                Main.overview.show(OverviewControls.ControlsState.APP_GRID);                                
            }                      
        });


        this.hidenHandlerId = Main.overview.connect('hidden', () => {
            this.dash.showAppsButton.checked = false;
            this._preventHide = false;  
        });

        this.showingHandlerId = Main.overview.connect('showing', () => {            
            if (this.dockState == State.HIDDEN || this.dockState == State.HIDDEN){
                this._animateIn(150, 0);
            }
            this._preventHide = true;                           
        });

        this.showHandlerId = Main.overview.connect('show', () => {            
            if (this.dockState == State.HIDDEN || this.dockState == State.HIDDEN){
                this._animateIn(150, 0);
            }
            /*this._preventHide = true;*/                           
        });

   
    }

    _setBarrieSize() {

        if (this._barrier) {
            this._pressureBarrier.removeBarrier(this._barrier);
            this._barrier.destroy();
            this._barrier = null;
        }

        this._barrier = new Meta.Barrier({
            display: global.display,
            x1: this._monitor.x,
            x2: this._monitor.width,
            y1: this._monitor.height,
            y2: this._monitor.height,
            directions: Meta.BarrierDirection.NEGATIVE_Y
        });

        this._pressureBarrier.addBarrier(this._barrier);       
        
	}    
    

    _disablePressureBarrier() {
        if(this._barrier && this._pressureBarrier) {
            this._pressureBarrier.removeBarrier(this._barrier);
            this._pressureBarrier.destroy();
        }
    }

    _animateOut(time, delay) {
        this.dockState = State.HIDDING;
        this.dash.ease({
            translation_y: this.dash.iconSize +70,
            duration: time,
            delay: delay,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onComplete: () => {
                this.dash.hide();
                this.dockState = State.HIDDEN;       
            }
        });        
    }


    _animateIn(time, delay) {
        this.dash.show();
        this.dockState = State.SHOWING;        
        this.dash.ease({
            translation_y: -(this.dash.iconSize + 70),
            duration: time,
            delay: delay,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onComplete: () => {
                this.dockState = State.SHOWN;                    
                this._hideTimer();
            }
        });
    }

    _hideTimer() {

        this._hideTimerId = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT, this.hideDelay, () => {            

                if (this._preventHide == true || this.dash._labelShowing == true || this.dateMenu.isOpen || this.aggregateMenu.isOpen) {
                    return GLib.SOURCE_CONTINUE;
                } else {
                    this._animateOut(750, 250);
                    return GLib.SOURCE_REMOVE;
                }
            });
    }

    _hideElements() {

        //await OverviewControls.layout_manager.ensureAllocation();
        Main.overview.dash.hide();
        Main.overview.dash.width = 0;
        Main.panel.hide();      
    }
   
    _undoChanges() {

        this._disablePressureBarrier();

        this.dash.showAppsButton.disconnect(this.appsHandlerId);
        Main.overview.disconnect(this.hidenHandlerId);
        Main.overview.disconnect(this.showingHandlerId);
        Main.overview.disconnect(this.showHandlerId);

        Main.overview.dash.show();
        Main.overview.dash.setMaxSize(-1, -1);
        Main.panel.show();

        print('Undo Manager Changes');        
    }

    _iconChange() {}
});


