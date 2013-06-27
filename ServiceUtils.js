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
