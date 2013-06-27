var ImageUtils = ( function()
{
	var self = {} // clazz
	
	/*
	 * Load in remote file and cache
	 */
	self.getRemoteImage = function( a, folderLocation )
	{
		a 					= a || {};
		folderLocation		= folderLocation || 'images';
		
	    var md5;
	    var savedFile;
	    var needsToSave 		= false;
	    var imageDirectory		= Ti.Filesystem.getFile( Ti.Filesystem.applicationDataDirectory, folderLocation );
	    
	    // create new directory if one does not exist
	    if( ! imageDirectory.exists() ) imageDirectory.createDirectory();
	    if( a.image )
	    {
	    	md5 		= Ti.Utils.md5HexDigest( a.image ) + self._getExtension( a.image );
			savedFile 	= Ti.Filesystem.getFile( imageDirectory.resolve(), md5 );
			if( savedFile.exists() )
			{
				a.image = savedFile.read(); // file exists locally, return
			}
			else { needsToSave = true }
	    }
	    
	    // creates a new image object using all object paramaters passed though
	    var returnedImage = Ti.UI.createImageView( a );
	    if( needsToSave )
	    {
	    	returnedImage.addEventListener( 'load', loadHandler );
	    	returnedImage.addEventListener( 'error', errorHandler );
	    }
	    
	  // [ HANDLERS
	    
	    function loadHandler( event )
	    {
	    	savedFile.write( event.source.toBlob() ); // write the blob image file ( does the same thing as toImage )
	    	removeListeners();
	    }
	    //ERROR remove listeners
	    function errorHandler( event ) { removeListeners();  }
	    
	  // ]
	    
	    // remove listeners
	    function removeListeners()
	    {
	    	returnedImage.removeEventListener( 'load', loadHandler );
	    	returnedImage.removeEventListener( 'error', errorHandler );
	    }
	    
	    return returnedImage;
	}
	
	/*
	 * return an array of images
	 */
	self.getAnimationSequence = function( folderPath, sort )
	{
		var imgDirectory 	= Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, folderPath );
		var imagesArray 	= imgDirectory.getDirectoryListing();
		var i				= imagesArray.length;
		var images			= [];
		var directoryPath	= imgDirectory.resolve();
		
		var path;
		while( --i > 0 )
		{
			path			= directoryPath + '/' + imagesArray[ i ] ;
			images[ images.length ] 	= path;
			path = null;
		}
		if( sort ) images.sort();
		return images;
	}
	
	/*
	 * return file extension
	 */
	self._getExtension = function( fn ) 
	{
		// from http://stackoverflow.com/a/680982/292947
		var re 			= /(?:\.([^.]+))?$/;
		var tmpext 		= re.exec(fn)[1];
		return (tmpext) ? tmpext : '';
	}
	
	return self;
	
})()
// return Utils
// module.exports = ImageUtils;

