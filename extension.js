const { Clutter, St } = imports.gi;
const OverviewControls = imports.ui.overviewControls;
const Layout = imports.ui.layout;
const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const OmniDash = Me.imports.omnidash.OmniDash;
const AggregateMenu = Me.imports.aggregateMenu.FormatStatus;
const DateMenu = Me.imports.dateMenu.FormatClock;
const VisibilityManager = Me.imports.visibilityControll.VisibilityManager;

const primaryMonitor = Main.layoutManager.primaryMonitor;

var positionActor;
var omnidash;
var aggregateMenu;
var dateMenu;
var manager;
var dashConstraint;


function enable() {	

  omnidash = new OmniDash();
  aggregateMenu = new AggregateMenu(omnidash);
  dateMenu = new DateMenu(omnidash);
    
  manager = new VisibilityManager(omnidash,aggregateMenu,dateMenu);
  manager._setBarrieSize();

  Main.layoutManager.hotCorners.push(manager); // adicionar no controller
  Main.layoutManager._updateHotCorners();  
      
  positionActor = new St.Widget({ name: 'positionActor',
                                         visible: false,
                                         reactive: false });

  //garante que a barra fique no monitor principal
  positionActor.set_size(primaryMonitor.width, primaryMonitor.height);
  positionActor.set_position(primaryMonitor.x, primaryMonitor.y);
      
  dashConstraint = new Clutter.AlignConstraint ({
            source: positionActor,            
            factor: 0.5,
        });;
   
  Main.layoutManager.addChrome(positionActor, {
    affectsInputRegion : false    
    });   

   dashConstraint.set_align_axis(Clutter.AlignAxis.X_AXIS); 
   omnidash.add_constraint(dashConstraint);   

  Main.layoutManager.addChrome(omnidash, {
    affectsInputRegion : true,    
    trackFullscreen : true,
  });     
  
  omnidash.y = (primaryMonitor.height);  
  
  manager._hideElements();
  manager._animateIn(750, 250);  
  
	print('enabled');		
}

function disable () {
   
  dateMenu._undoChanges();
  aggregateMenu._undoChanges();
  manager._undoChanges();

  Main.layoutManager.removeChrome(omnidash);
  Main.layoutManager.removeChrome(positionActor);

  positionActor.destroy();
  omnidash.destroy();

	print('disabled');
}


function init () {

	print('initiated ');

}