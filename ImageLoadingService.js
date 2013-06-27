var ImageLoadingService = ( function()
{
	Ti.include( 'ImageUtils' ); // include utils
	
	var self = {} // clazz
	
	var dataLoadCompletedHandler;
	var errorHandler;
	var xhrConnection;
	
	var downloadedCounter		= 0;
	var totalImages				= 0;
	var imagePaths;
	
	var imageLoadedCompleteHandler;
	var errorLoadingHandler;
	var tempFile;
	var imageDirectory;
	var progress				= 0;
	var stoppedDownloading		= false;
	var overwriteImage			= false;
	var imgTimeout				= 35000;
	var xhrTimeout				= 90000;
	
	/*
	 * initiate loader and properties
	 */
	self.init = function( completedHandler, errorHandler, imageDirectory, overwrite, imageTimeOut, xhrConnectionTimeout )
	{
		imageLoadedCompleteHandler	 	= completedHandler;
		errorLoadingHandler				= errorLoadingHandler;
		imageDirectory					= ServiceUtils.getLocalFile( imageDirectory || 'images' );
		downloadedCounter 				= 0;
		overwriteImage					= overwrite || overwriteImage;
		imgTimeout						= imageTimeOut || imgTimeout;
		xhrTimeout						= xhrConnectionTimeout || xhrTimeout;
		
		completedHandler				= null;
		errorHandler					= null;
		overwrite						= null;
		imageTimeOut					= null;
		xhrConnectionTimeout			= null;
	}
	
	// start downloading images
	self.start = function( urls ) 
	{ 
		if( imageDirectory.exists()  ) imageDirectory.deleteDirectory( true );
		imageDirectory.createDirectory(); // create Image directory
		
		imagePaths 		= urls;
		totalImages		= imagePaths.length;
		
		setTimeout( imageDownloadTimeout_handler, imgTimeout );
		downloadImages( imagePaths[ downloadedCounter ] );  
	}
	
	/*
	 * Download images
	 */
	function downloadImages( imageURL )
	{
		if( imageURL === '' || imageURL === undefined )
		{   // in no url can be found go to the next in the array
			downloadImages( imagePaths[ ++downloadedCounter ] );
			return;
		}
		
		var md5 				= Ti.Utils.md5HexDigest( imageURL ) + ImageUtils._getExtension( imageURL );
		var tmp 				= Ti.Filesystem.getFile( imageDirectory.resolve(), md5 );
		if( tmp.exists() )
		{ 
			if( !overwriteImage ) // if overwrite is false, go to next image in array
			{
				downloadImages( imagePaths[ ++downloadedCounter ] ); 
				return;
			}
			else tmp.deleteFile(); // delet file and intstall again
			
		}
		xhrClient().open( 'GET', imageURL );
		xhrClient().send();
	}
	
	/*
	 * data completed loading, check for more images if not complete
	 */
	function imageLoadCompleted_handler( event )
	{
		if( xhrConnection === null ) return;
		saveAndStoreImage( this.responseData, imagePaths[ downloadedCounter ]  );
		++downloadedCounter;
		if( downloadedCounter === totalImages )
		{
			if( imageLoadedCompleteHandler !== undefined ) imageLoadedCompleteHandler();
			return;
		}
		downloadImages( imagePaths[ downloadedCounter ] );
	}
	
	/*
	 * save and store all images locally
	 */
	function saveAndStoreImage( imageData, name )
	{
		if( stoppedDownloading ) return;
		var md5 				= Ti.Utils.md5HexDigest( name ) + ImageUtils._getExtension( name );
		tempFile 				= Ti.Filesystem.getFile( imageDirectory.resolve(), md5 );
		
		if( tempFile.exists() )  { tempFile.deleteFile(); }
		tempFile.write( imageData ) 
	}
	
	
	// on ERROR , download the next image in line
 	function dataConnectionError_handler( event ) { downloadImages( imagePaths[ ++downloadedCounter ] ); }
	// stream ready
 	function readyState_handler( event ) { }
	// data stream, called when data is being received
 	function dataStream_handler( event ) { }
 	
	// return HTTP Client
	function xhrClient( ) 
	{
		if( xhrConnection === undefined )
		{
			xhrConnection 						= Ti.Network.createHTTPClient();
			xhrConnection.onload 				= imageLoadCompleted_handler;
			xhrConnection.onerror				= dataConnectionError_handler;
			xhrConnection.ondatastream			= dataStream_handler;
			xhrConnection.onreadystatechange 	= readyState_handler;
			xhrConnection.setTimeout( xhrTimeout );
		}
		return xhrConnection;
	}	
	
	/*
	 * Dispose
	 */
	self.dispose = function()
	{
		// handlers
		xhrConnection.onload				= null;	
		xhrConnection.onerror				= null;
		xhrConnection.ondatastream			= null;
		xhrConnection.onreadystatechange	= null;
		
		
		downloadedCounter			= null;
		imagePaths					= null;
		imageLoadedCompleteHandler	= null;
		errorLoadingHandler			= null;
		tempFile 					= null;
		imageDirectory				= null;
		progress					= null;
		intervalIndex				= null;
		xhrConnection				= null;
		intervalIndex				= null;
		stoppedDownloading			= null;
		self						= null;
		overwriteImage				= null;
		xhrTimeout					= null;
		imgTimeout					= null;
	}

	/*
	 * Timeout handler, images have taken too long to download
	 * stop download and call the completed handler
	 */
	function imageDownloadTimeout_handler() 
	{ 
		stoppedDownloading = true;
		imageLoadedCompleteHandler(); 
	} 
		
	return self;
})()

module.exports = ImageLoadingService;
