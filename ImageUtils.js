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

