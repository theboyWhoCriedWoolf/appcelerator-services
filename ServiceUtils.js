var ServiceUtils = ( function()
{
	var self = {}; // class
	var androidStoragePath  				= 'file:///data/data/' + Ti.App.getID() + '/';
	var iOSStoragePath 						= Ti.Filesystem.applicationSupportDirectory + '/';
	
	/*
	 * retrurn database file from database directory 
	 * Android and iOS
	 */
	self.getDatabaseFile = function( name )
	{
		if( Ti.Platform.osname == 'android' ) return Ti.Filesystem.getFile( androidStoragePath + name ); 
		else return Ti.Filesystem.getFile( iOSStoragePath + name );
	}
	
	/*
	 * retun file
	 */
	self.getLocalFile = function( name ) 
	{
		if( Ti.Platform.osname == 'android' ) return Ti.Filesystem.getFile( Ti.Filesystem.applicationDataDirectory, name ); 
		else return Ti.Filesystem.getFile( Ti.Filesystem.applicationSupportDirectory, name );
	}
	
	
	return self;
})();
// module.exports = AppUtils;
