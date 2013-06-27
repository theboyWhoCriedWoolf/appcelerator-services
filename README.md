Appcelerator Services 

A collection of Appcelerator modules that can be used together to download, update and install SQL Light databases and images
as well as using cached images.

Download Database:

To check for updates before downloading the database enable this feature by passing in a remote versionAddress url
that returns a version number, this number will be written to a local text file named 'version.txt'.

<pre>
<code>

 	// include the module
 	var dbConnectionService = require( '<folder-path>/DBConnectionService' );
 
	/*
	 * 	completedHandler - called once the database has loaded passing the database blob file
	 * 	errorHandler	- called upon download error
	 * 	streamHandler	- called on the progress of the download
	 * 	databaseAlreadyUpToDataHandler - if using versioning, called if the database version number is the same as the already installed DB
	 * 	serverAddress	- remote address of the database file
	 * 	versionAddress	- only used if using versioning ( remote address to get the latest version number )
	 * 	timeout			- HTTPClient timeout duration
	 */
 
 	dbConnectionService.init( completedHandler, errorHandler, streamHandler, databaseAlreadyUpToDataHandler, serverAddress, versionAddress, timeout );
 	dbConnectionService.versionFile( new-filename ); // use to specify a new filename for a version text file
 	dbConnectionService.load();
 	
 	// dispose
 	dbConnectionService.dispose();
 	
 </pre>
</code>

Installing Database:

<pre>
<code>

	// include the module
 	var dbInstallationService = require( '<folder-path>/DBInstallationService' );
 	
 	/*
	 * 	databaseName		- name of the database file
	 * 	dbInstalledHandler	- called when the database is installed
	 * 	errorHandler		- called if there was an error with the installation
	 */
	dbInstallationService.init( databaseName, dbInstalledHandler, errorHandler );
	// install the database
	dbInstallationService.installDatabase( blob-file ); // can be file received from dbConnectionService
	
	// dispose
	dbInstallationService.dispose();
	
 </pre>
</code>

Downloading Images:

<pre>
<code>

	// include the module
 	var imageLoadingService = require( '<folder-path>/ImageLoadingService' );
	
	/* 
	 * 	completedHandler	- called when all files have completed downloading
	 * 	errorHandler		- called on error
	 *  imageDirectory		- directory to store images ( default 'images' )
	 * 	overwriteExisting	- overwrite file if exists with the same name
	 * 	serviceTimeout		- stop downloading even if downloads have not yet completed 
	 	- prevents app spending too long downloading images if the files are too big, or connection too slow
	 * 	connectionTimeout	- HTTPClient timeout duration for each image
	 */
	imageLoadingService.init( completedHandler, errorHandler, imageDirectory, overwriteExisting, serviceTimeout, connectionTimeout );
	// start the download
	imageLoadingService.start( [ URLS Array ] );
	
	// dispose
	imageLoadingService.dispose();

 </pre>
</code>

Getting cached Images

based on Appcelerator's [ Image Best Practices ]( http://docs.appcelerator.com/titanium/latest/#!/guide/Image_Best_Practices )

<pre>
<code>
	
	// include the module
 	var imageLoadingService = require( '<folder-path>/ImageUtils' );
	
	
	/*
	 *  Get Cached images, if image are not available download and store
	 *
	 * 	imageObject			- image object
	 * 	folderLocation		- images folder location ( default 'images' )
	 */
	ImageUtils.getRemoteImage( imageObject, folderLocation );
	
	// ****** USE ******//
	
	var image = ImageUtils.getRemoteImage({
		height			: 223,
		image 			: imageURL,
		touchEnabled	: false,
		canCancelEvents	: true,
	} )
	
	
	/*
	 *  Get image animation seequence to create animation in the ImageView
	 *
	 * 	folderPath			- location of images // images/folder
	 * 	sort				- reshuffle array by numeric order
	 */
	ImageUtils.getAnimationSequence( folderPath, sort );
	
 </pre>
</code>
	
Please contact me with regards to any comments and or improvements.

tal@theboywhocriedwoolf.com

Thanks
	
	









	
