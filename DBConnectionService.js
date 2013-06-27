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


var DBConnectionService = ( function()
{
	Ti.include( 'ServiceUtils.js' ); // include utils
	
	var self = {}; // class
	
	// private properties
	var dataLoadCompletedHandler;
	var errorHandler;
	var xhrConnection;
	var httpConnectionPath;
	var versionHTTPPath;
	var updateFileRef 	= 'version.txt';
	var LogFile;
	var dbVersion;
	var streamHandler;
	var connectionTimeout;
	
	// init
	self.init = function( onCompleted, onError, onStream, databaseUpToDate, serverAddress, versionAddress, timeout )
	{
		dataLoadCompletedHandler	= onCompleted;
		errorHandler				= onError;
		streamHandler				= onStream;
		databaseAllreadyUpToDate	= databaseUpToDate;
		connectionTimeout			= timeout || 5000;
		
		versionHTTPPath				= versionAddress;
		httpConnectionPath			= serverAddress;
		
		onCompleted					= null;
		onError						= null;
		databaseUpToDate			= null;
		serverAddress				= null;
		versionAddress				= null;
		onStream					= null;
	}
	
	/*
	 * load data
	 */
	self.load = function() { ( versionHTTPPath && versionHTTPPath !== '' ) ? getLatestDBVersion() : getDB(); }
	
	// set the filename of the version text file to be saved
	self.versionFile = function( fileName ) { updateFileRef = fileName; }
	
	// remove all files
	self.dispose = function()
	{
		xhrConnection 				= null;
		dataLoadCompletedHandler	= null;
		errorHandler				= null;
		httpConnectionPath			= null;
		versionHTTPPath				= null;
		updateFileRef				= null;
		LogFile						= null;
		dbVersion					= null;
		self						= null;
		connectionTimeout			= null;
	}
	
 // [ PRIVATE Methods 
 	
 	/*
 	 * get latest from server
 	 */
	function getLatestDBVersion()
	{
		xhrClient().onload 	= latestVersionAvailable_handler;
		xhrClient().open( 'GET', versionHTTPPath );
		xhrClient().send();
	}
	
	/*
	 * latest version downloaded
	 * check it corresponds to local version
	 */
	function latestVersionAvailable_handler( event ) 
	{
		dbVersion 		= this.responseText;
		LogFile 		= ServiceUtils.getLocalFile( updateFileRef );
		
		if( LogFile.exists() )
		{
			var localVersion = LogFile.read().text;
			if( localVersion === dbVersion ) 
			{ 
				if( handlerExists( databaseAllreadyUpToDate ) ) databaseAllreadyUpToDate(); 
				return;
			} // data is up to date
		}
		LogFile.write( dbVersion );
		getDB(); // no local version exists, get database
	}
	
 	/*
 	 * database needs updating
 	 * Download new version
 	 */
	function getDB()
	{
		xhrClient().onload 	= dataLoadCompleted_handler;
		xhrClient().open( 'GET', httpConnectionPath );
		xhrClient().send( );
	}
 	
 	// on ERROR function
 	function dataConnectionError_handler( event ) { if( handlerExists( errorHandler ) ) errorHandler( event ); }
 	
 	// data load completed
 	function dataLoadCompleted_handler( event ) { if( handlerExists( dataLoadCompletedHandler ) ) dataLoadCompletedHandler( this.responseData ); }
 	
 	// data stream, called when data is being received
 	function dataStream_handler( event ) { if( handlerExists( streamHandler ) ) streamHandler( event ); }
	
	// return HTTP Client
	function xhrClient( ) 
	{
		if( xhrConnection === undefined )
		{
			xhrConnection 					= Ti.Network.createHTTPClient();
			xhrConnection.onload 			= dataLoadCompleted_handler;
			xhrConnection.onerror			= dataConnectionError_handler;
			xhrConnection.ondatastream		= dataStream_handler;
			xhrConnection.setTimeout( connectionTimeout );
		}
		return xhrConnection;
	}
	
	/*
	 * make sure handler exists
	 * check for null or undefined
	 */
	function handlerExists( handler )
	{
		if( handler === undefined || handler === null ) return false;
		return true;
	}
 
 // ]
 
 	return self;
})()
// export module
module.exports = DBConnectionService;
