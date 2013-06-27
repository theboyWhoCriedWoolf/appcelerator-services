// The MIT License (MIT)
// 
// Copyright (c) 2013 Tal Woolf
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
