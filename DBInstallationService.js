var DBInstallationService = ( function()
{
	Ti.include( 'ServiceUtils.js' ); // include utils
	
	var self 								= {}; // clazz
	var DBName;
	var dbIntsalationCompltedHandler;
	var errorHandler;
	
	// storage
	var tmpFile;
	var sqlFile;
	
// [ CONTROLLERS 

	/*
	 * init properties
	 */
	self.init = function( databaseName, dbInstalledHandler, onError )
	{
		DBName							= databaseName;
		dbIntsalationCompltedHandler	= dbInstalledHandler;
		errorHandler					= onError;
		
		databaseName					= null;
		tblName							= null;
		dbInstalledHandler				= null;
		onError							= null;
	}

	/*
	 * install database
	 */
	self.installDatabase = function( data )
	{
		if( tmpFile !== undefined && tmpFile.exists() ) { tmpFile.deleteFile(); }
		else
		{
			tmpFile = Ti.Filesystem.getFile( Ti.Filesystem.tempDirectory, 'temp.sql' );
 			tmpFile.write( data );
		}
		
		if( tmpFile.exists() )
		{
			sqlFile		 	= ServiceUtils.getDatabaseFile( 'databases/' + DBName + '.sql' ) 
			if( sqlFile.exists() ) { sqlFile.deleteFile(); }; 
			// moving file
			var fileMoved 	= tmpFile.move( sqlFile.nativePath );
			if( fileMoved ){ completeInstallation(); }
			else { if( errorHandler !== undefined ) errorHandler( ); }
		}
		data = null;
	}
	
	/*
	 * dispose
	 */
	self.dispose = function()
	{
		DBName							= null;
		dbIntsalationCompltedHandler	= null;
		tmpFile							= null;
		sqlFile							= null;
		errorHandler					= null;
		self							= null;
	}	
	
 // ]
	
 // [ PRIVATE Methods 
 
 	function completeInstallation()
 	{
 		var dbFile = ServiceUtils.getDatabaseFile( 'databases/' + DBName );
 		if( dbFile.exists() == true )  { dbFile.deleteFile(); }
 		var db = Titanium.Database.install( sqlFile.nativePath, DBName );
 		
 		 db.close();			// close database
 		 disposeFile( sqlFile ); // dispose files to clean up
 		 disposeFile( tmpFile );
 		 dbFile = null;
 		 db		= null;
 		
 		if( dbIntsalationCompltedHandler !== undefined ) dbIntsalationCompltedHandler();
 	}
 	
	// remove files
	function disposeFile( file ) 
	{
		 if( file.exists() ) file.deleteFile();
		 file = null;
	}
	
 // ]
	
	return self;
})();

module.exports = DBInstallationService;
