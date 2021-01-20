// Globar Vars
var toEdit = '';
var toDelete = '';
var toPatient = '';

// Main Function
document.addEventListener('DOMContentLoaded', function() {
	loadNavbar();
	loadEditAccount();
	loadListenersDelete();
	verifyHeightBody();
});

///// FUNCTIONS TO CONSUME MY API WEB SERVICE  /////


// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- MANAGE CLINICAL ANALYSIS *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- //

// Funtion to show folder of Patient
function openFolder(btn)
{
	try
	{
		var code = btn.dataset.patient;
		openDiv('folder');

		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/patient/'+code, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Load Patient Data
		  	if (result.message) 
		  	{
		  		alertError(result);
		  	}
		  	else
		  	{
		  		document.querySelector('#folder_Header').innerHTML = result.code;
		  		document.querySelector('#folder_Code').innerHTML = result.code;
		  		document.querySelector('#folder_FirstName').innerHTML = result.first_name;
		  		document.querySelector('#folder_LastName').innerHTML = result.last_name;
		  		document.querySelector('#folder_Celphone').innerHTML = result.celphone;
		  		document.querySelector('#folder_Email').innerHTML = result.email;
		  		document.querySelector('#folder_NumFiles').innerHTML = result.numFiles;

		  		loadFolder(result.code);

		  		toPatient = result.code;
		  	}

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to load list Clinical Analysis (Folder)
function loadFolder(code)
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/folder/'+code, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(files => {

		  	// Render Users
		      if (files.length > 0) 
		      {
		      	document.querySelector('#folder_tbody').innerHTML = '';
		      	for (var i = 0; i < files.length; i++) 
		        {
		         	renderFileFolder(document.querySelector('#folder_tbody'), files[i]); 	
		        }
		      }
		      else
		      {
		      	document.querySelector('#folder_tbody').innerHTML = '<tr class="myRowTable rounded border"><th></th> <td>NO DATA :(</td> <td></td> <td></td> <td></td> <td></td></tr>';

		      }
		      verifyHeightBody();

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Render a File Folder Row
function renderFileFolder(parent, data)
{
	myRowFileFolder = document.createElement('tr');
	myRowFileFolder.className = 'myRowTable rounded border';

		idCell = document.createElement('th');
		idCell.scope = 'row';
		idCell.innerHTML = data.id;

		description = document.createElement('td');
		description.innerHTML = data.description;

		fileCell = document.createElement('td');
		fileCell.innerHTML = '<a href="'+window.location.toString()+"FileFolder/"+data.code+"/"+data.id+'" target="blank">'+data.file+'</a>';

		lastUpdated = document.createElement('td');
		lastUpdated.innerHTML = data.updated_at;

	myRowFileFolder.append(idCell);
	myRowFileFolder.append(description);
	myRowFileFolder.append(fileCell);
	myRowFileFolder.append(lastUpdated);

	myRowFileFolder.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-warning btn-sm pt-0 pb-0" data-file="'+data.id+'" data-patient="'+data.code+'" onclick="editFileFolder(this);">Edit </button> </td>';
	myRowFileFolder.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-danger btn-sm pt-0 pb-0" data-file="'+data.id+'" data-patient="'+data.code+'" onclick="deleteFileFolder(this);">Delete </button> </td>';

	parent.append(myRowFileFolder);
}

// Funtion to Save a File Folder
function newFileFolder()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		// Get File
	    var fileAnalysis = document.querySelector('#newFileFolder_FileAnalysis');


	    var formData = new FormData();
	    formData.append("description", document.querySelector('#newFileFolder_Description').value);
	    formData.append("file", fileAnalysis.files[0]);

		$.ajax({
	            url: '/adminLab/newFileFolder/'+toPatient,
				headers: {
		        	'X-CSRFToken': csrftoken
		   		},
	            type: 'POST',
	            data: formData,
	            success: function (result) {
	                
	                // Print Result Alert

			    	if (result.code) 
			    	{
			    		$('#newFileFolder').modal('hide');
			    		var extras = '<span class="text-center mt-2">This Cinical Analysis is already storaged to Patient with Code <b>'+result.code+'</b> </span>';
			    		
			    		alertSuccess(result, extras);
						loadFolder(result.code);
						loadPatients();

						var count = parseInt(document.querySelector('#folder_NumFiles').innerHTML);
			 			document.querySelector('#folder_NumFiles').innerHTML = count+1;
			    	}
			    	else
			    	{
						$('#newFileFolder').modal('hide');
						alertError(result);
			    	}

			    	document.querySelector('#newFileFolder_Description').value = '';
				    document.querySelector('#newFileFolder_FileAnalysis').value = '';


	            },
	            cache: false,
	            contentType: false,
	            processData: false
	        });
	}
	catch (e)
	{
		console.log(e);
	}
	
}


// Funtion to Load Data Edit a File Folder
function editFileFolder(btn)
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
		var code = btn.dataset.patient;
		var id = btn.dataset.file; 

		fetch('/adminLab/FileFolder/'+code+'/'+id, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Load Patient Data
		  	if (result.message) 
		  	{
		  		alertError(result);
		  	}
		  	else
		  	{
		  		
		  		document.querySelector('#editFileFolder_Description').value = result.description;
		  		document.querySelector('#editFileFolder_ActualFileFolder').innerHTML = result.file;
		  		document.querySelector('#editFileFolder_ActualFileFolder').href = window.location.toString()+"FileFolder/"+result.code+"/"+result.id;
		  		document.querySelector('#editFileFolder_ActualFileFolder').target = "blank";

		  		toEdit = result.id;
		  		toPatient = result.code;

				$('#editFileFolder').modal('show');
		  	}

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Fetch Update data Publication
function fetchEditFileFolder()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		// Get File
	    var fileAnalysis = document.querySelector('#editFileFolder_FileAnalysis');


	    var formData = new FormData();
	    formData.append("description", document.querySelector('#editFileFolder_Description').value);
	    formData.append("file", fileAnalysis.files[0]);

		$.ajax({
	            url: '/adminLab/updateFileFolder/'+toPatient+'/'+toEdit,
				headers: {
		        	'X-CSRFToken': csrftoken
		   		},
	            type: 'POST',
	            data: formData,
	            success: function (result) {
	                
	                // Print Result Alert

			    	if (result.code) 
			    	{
			    		$('#editFileFolder').modal('hide');
			    		var extras = '<span class="text-center mt-2">This Cinical Analysis is already Updated to Patient with Code <b>'+result.code+'</b> </span>';
			    		
			    		alertSuccess(result, extras);
						loadFolder(result.code);
			    	}
			    	else
			    	{
						$('#editFileFolder').modal('hide');
						alertError(result);
			    	}

			    	document.querySelector('#newFileFolder_Description').value = '';
				    document.querySelector('#newFileFolder_FileAnalysis').value = '';

	            },
	            error: function (e){
	            	$('#editFileFolder').modal('hide');
	            	result = {"message": "Error Update Clinical Analysis", "error": "Server Error"}
					alertError(result);
	            },
	            cache: false,
	            contentType: false,
	            processData: false
	        });

	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Confirm and Fetch Delete a FileFolder
function fetchDeleteFileFolder()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/deleteFileFolder/'+toPatient+'/'+toDelete, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#deleteFileFolder').modal('hide');
	    		var extras = '<span>The File Clinical Analysis has been Deleted Succesfuly!</span>';
	    		
	    		alertSuccess(result, extras);
				loadFolder(result.code);
				loadPatients();


				var count = parseInt(document.querySelector('#folder_NumFiles').innerHTML);
	 			document.querySelector('#folder_NumFiles').innerHTML = count-1;
	    	}
	    	else
	    	{
				$('#deleteFileFolder').modal('hide');
				alertError(result);
	    	}

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Pre Delete a User
function deleteFileFolder(btn)
{
	toDelete = btn.dataset.file;
	toPatient = btn.dataset.patient
	$('#deleteFileFolder').modal('show');
}








// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- MANAGE USERS *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- //

// Funtion to Load Data Users
function loadUsers()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/users', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(users => {

		  	// Render Users
		      if (users.length > 0) 
		      {
		      	document.querySelector('#users_tbody').innerHTML = '';
		      	for (var i = 0; i < users.length; i++) 
		        {
		         	renderUser(document.querySelector('#users_tbody'), users[i]); 	
		        }
		      }
		      else
		      {
		      	document.querySelector('#users_tbody').innerHTML = '<tr class="myRowTable rounded border"><th></th> <td>NO DATA :(</td> <td></td> <td></td> <td></td> <td></td></tr>';

		      }
		      verifyHeightBody();
		  });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Render a User Row
function renderUser(parent, data)
{
	myRowUser = document.createElement('tr');
	myRowUser.className = 'myRowTable rounded border';

		userFirstName = document.createElement('th');
		userFirstName.scope = 'row';
		userFirstName.innerHTML = data.first_name;

		userLastName = document.createElement('td');
		userLastName.innerHTML = data.last_name;

		userCelphone = document.createElement('td');
		userCelphone.innerHTML = data.celphone;

		userEmail = document.createElement('td');
		userEmail.innerHTML = data.email;

		userPermission = document.createElement('td');
		userPermission.innerHTML = '<b>'+data.type_user+'</b>';

	myRowUser.append(userFirstName);
	myRowUser.append(userLastName);
	myRowUser.append(userCelphone);
	myRowUser.append(userEmail);
	myRowUser.append(userPermission);

	myRowUser.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-danger btn-sm pt-0 pb-0" data-user="'+data.email+'" onclick="deleteUser(this);">Delete </button> </td>';

	parent.append(myRowUser);
}

// Funtion to Save a New User
function newUser()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		var formData = new FormData();
	    formData.append("first_name", document.querySelector('#newUser_FirstName').value);
	    formData.append("last_name", document.querySelector('#newUser_LastName').value);
	    formData.append("email", document.querySelector('#newUser_Email').value);
	    formData.append("celphone", document.querySelector('#newUser_Celphone').value);
	    formData.append("password", document.querySelector('#newUser_Password').value);
	    formData.append("confirmation", document.querySelector('#newUser_Confirmation').value);
	    formData.append("type_user", document.querySelector('#newUser_TypeUser').value);


	    fetch('/adminLab/register', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST', 
	    	body: formData 
	    }).then(response => response.json())
	    .then(result => {

	    	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#newUser').modal('hide');
	    		var extras = '<span> This User has been Created whit temporaly password <b>'+result.code+'</b>  </span>';
	    		
	    		alertSuccess(result, extras);
				loadUsers();
	    	}
	    	else
	    	{
				$('#newUser').modal('hide');
				alertError(result);
	    	}

	    	document.querySelector('#newUser_FirstName').value = '';
		    document.querySelector('#newUser_LastName').value = '';
		    document.querySelector('#newUser_Email').value = '';
		    document.querySelector('#newUser_Celphone').value = '';
		    document.querySelector('#newUser_Password').value = '';
		    document.querySelector('#newUser_Confirmation').value = '';
		    document.querySelector('#newUser_TypeUser').selectedIndex = 0;
	    });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Confirm and Fetch Delete a User
function fetchDeleteUser()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/deleteUser/'+toDelete, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#deleteUser').modal('hide');
	    		var extras = ' ';
	    		
	    		alertSuccess(result, extras);
				loadUsers();
	    	}
	    	else
	    	{
				$('#deleteUser').modal('hide');
				alertError(result);
	    	}

	  		toDelete = '';

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Pre Delete a User
function deleteUser(btn)
{
	toDelete = btn.dataset.user;
	$('#deleteUser').modal('show');
}

// Function to First Login
function firstLogin()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		var formData = new FormData();
	    formData.append("oldPassword", document.querySelector('#oldPassword').value);
	    formData.append("password", document.querySelector('#newPassword').value);
	    formData.append("confirmation", document.querySelector('#confirmPassword').value);


		fetch('/adminLab/firstLogin', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST',
	    	body: formData
	    });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Function to Change Password
function changePassword()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		var formData = new FormData();
	    formData.append("oldPassword", document.querySelector('#oldPassword').value);
	    formData.append("password", document.querySelector('#newPassword').value);
	    formData.append("confirmation", document.querySelector('#confirmPassword').value);


		fetch('/adminLab/changePassword', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST',
	    	body: formData
	    })
		  .then(response => response.json())
		  .then(result => {

			  	// Print Result Alert

		    	if (result.code) 
		    	{
		    		var extras = '<span>The Password for user <b>'+result.code+'</b> has been Changed</span>';
		    		
		    		alertSuccess(result, extras);
		    	}
		    	else
		    	{
		    		if(result)
		    		{
						alertError(result);
		    		}
		    	}

		    	document.querySelector('#oldPassword').value = ''
		    	document.querySelector('#newPassword').value = ''
		    	document.querySelector('#confirmPassword').value = ''
		  });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Function to Change Email
function changeEmail()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		var formData = new FormData();
	    formData.append("oldEmail", document.querySelector('#oldEmail').value);
	    formData.append("newEmail", document.querySelector('#newEmail').value);
	    formData.append("confirmation", document.querySelector('#confirmEmail').value);
	    formData.append("password", document.querySelector('#myPassword').value);


		fetch('/adminLab/changeEmail', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST',
	    	body: formData
	    })
		  .then(response => response.json())
		  .then(result => {

			  	// Print Result Alert

		    	if (result.code) 
		    	{
		    		var extras = '<span>The Email for This User has been Changed to <b>'+result.code+'</b> </span>';
		    		
		    		alertSuccess(result, extras);
		    	}
		    	else
		    	{
					alertError(result);
		    	}

		    	document.querySelector('#oldEmail').value = ''
		    	document.querySelector('#newEmail').value = ''
		    	document.querySelector('#confirmEmail').value = ''
		    	document.querySelector('#myPassword').value = ''
		  });
	}
	catch (e)
	{
		console.log(e);
	}
}



// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- MANAGE PUBLICATIONS *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- //

// Funtion to Load Data Publications
function loadPublications()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/publications', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(publications => {

		  	// Render Patients
		      if (publications.length > 0) 
		      {
		      	document.querySelector('#publications_tbody').innerHTML = '';
		      	for (var i = 0; i < publications.length; i++) 
		        {
		         	renderPublication(document.querySelector('#publications_tbody'), publications[i]); 	
		        }
		      }
		      else
		      {
		      	document.querySelector('#publications_tbody').innerHTML = '<tr class="myRowTable rounded border"><th></th> <td>NO DATA :(</td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td></tr>';

		      }
		      verifyHeightBody();
		  });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Render a Publication Row
function renderPublication(parent, data)
{
	myRowPublication = document.createElement('tr');
	myRowPublication.className = 'myRowTable rounded border';

		active = document.createElement('th');
		active.scope = 'row';
		active.innerHTML = data.active;

		tittle = document.createElement('td');
		tittle.innerHTML = data.tittle;

		text = document.createElement('td');
		if (data.text.length > 20) 
		{
			text.innerHTML = data.text.substr(0,20)+"...";
		}
		else
		{
			text.innerHTML = data.text;
		}

		updated_at = document.createElement('td');
		updated_at.innerHTML = data.updated_at;

		image_gallery = document.createElement('td');
		image_gallery.innerHTML = '<a href="'+window.location.toString()+"ImageGallery/"+data.id+'" target="blank">'+data.image_gallery+'</a>';

		image_post = document.createElement('td');
		image_post.innerHTML = '<a href="'+window.location.toString()+"ImagePost/"+data.id+'" target="blank">'+data.image_post+'</a>';

	myRowPublication.append(active);
	myRowPublication.append(tittle);
	myRowPublication.append(text);
	myRowPublication.append(image_gallery);
	myRowPublication.append(image_post);
	myRowPublication.append(updated_at);

	myRowPublication.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-warning btn-sm pt-0 pb-0" data-publication="'+data.id+'" onclick="editPublication(this);">Edit</button> </td>';
	myRowPublication.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-danger btn-sm pt-0 pb-0" data-publication="'+data.id+'" onclick="deletePublication(this);">Delete </button> </td>';

	parent.append(myRowPublication);
}

// Funtion to Save a New Publication
function newPublication()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		// Get Images Files
	    var image_gallery = document.querySelector('#newPublication_ImgGallery');
	    var image_post = document.querySelector('#newPublication_ImgPost');


	    var formData = new FormData();
	    formData.append("tittle", document.querySelector('#newPublication_Tittle').value);
	    formData.append("text", document.querySelector('#newPublication_Content').value);
	    formData.append("image_gallery", image_gallery.files[0]);
	    formData.append("image_post", image_post.files[0]);

		$.ajax({
	            url: '/adminLab/newPublication',
				headers: {
		        	'X-CSRFToken': csrftoken
		   		},
	            type: 'POST',
	            data: formData,
	            success: function (result) {
	                
	                // Print Result Alert

			    	if (result.code) 
			    	{
			    		$('#newPublication').modal('hide');
			    		var extras = '<b class="text-center mt-2">This Publication is already Active</b>';
			    		
			    		alertSuccess(result, extras);
						loadPublications();
			    	}
			    	else
			    	{
						$('#newPublication').modal('hide');
						alertError(result);
			    	}

			    	document.querySelector('#newPublication_Tittle').value = '';
				    document.querySelector('#newPublication_Content').value = '';
				    document.querySelector('#newPublication_ImgGallery').value = '';
				    document.querySelector('#newPublication_ImgPost').value = '';


	            },
	            cache: false,
	            contentType: false,
	            processData: false
	        });
	}
	catch (e)
	{
		console.log(e);
	}
	
}

// Funtion to Load Data Edit a Publication
function editPublication(btn)
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
		var code = btn.dataset.publication;

		fetch('/adminLab/publication/'+code, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Load Patient Data
		  	if (result.message) 
		  	{
		  		alertError(result);
		  		toEdit = '';
		  	}
		  	else
		  	{
		  		if (result.active) 
		  		{
		  			document.querySelector('#editPublication_Active').selectedIndex = 1;
		  		}
		  		else
		  		{
		  			document.querySelector('#editPublication_Active').selectedIndex = 0;
		  		}

		  		document.querySelector('#editPublication_Tittle').value = result.tittle;
		  		document.querySelector('#editPublication_Content').value = result.text;
		  		document.querySelector('#editPublication_ImgGalleryFile').src = window.location.toString()+"ImageGallery/"+result.id
		  		document.querySelector('#editPublication_ImgPostFile').src = window.location.toString()+"ImagePost/"+result.id

		  		toEdit = result.id;

				$('#editPublication').modal('show');
		  	}

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Fetch Update data Publication
function fetchEditPublication()
{
	try
	{
		
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		// Get Images Files
	    var image_gallery = document.querySelector('#editPublication_ImgGallery');
	    var image_post = document.querySelector('#editPublication_ImgPost');


	    var formData = new FormData();
	    formData.append("tittle", document.querySelector('#editPublication_Tittle').value);
	    formData.append("text", document.querySelector('#editPublication_Content').value);
	    formData.append("active", document.querySelector('#editPublication_Active').value);
	    formData.append("image_gallery", image_gallery.files[0]);
	    formData.append("image_post", image_post.files[0]);

		$.ajax({
	            url: '/adminLab/updatePublication/'+toEdit,
				headers: {
		        	'X-CSRFToken': csrftoken
		   		},
	            type: 'POST',
	            data: formData,
	            success: function (result) {
	                
	                // Print Result Alert

			    	if (result.code) 
			    	{
			    		$('#editPublication').modal('hide');
			    		if (result.publication.active) 
			    		{
			    			var extras = '<b class="text-center mt-2">This Publication is already Active</b>';
			    		}
			    		else
			    		{
			    			var extras = '<b class="text-center mt-2">This Publication is already Disabled</b>';
			    		}
			    		
			    		alertSuccess(result, extras);
						loadPublications();
			    	}
			    	else
			    	{
						$('#editPublication').modal('hide');
						alertError(result);
			    	}

			    	document.querySelector('#editPublication_Tittle').value = '';
				    document.querySelector('#editPublication_Content').value = '';
				    document.querySelector('#editPublication_ImgGallery').value = '';
				    document.querySelector('#editPublication_ImgPost').value = '';

				    toEdit = '';

	            },
	            cache: false,
	            contentType: false,
	            processData: false
	        });
	}
	catch (e)
	{
		console.log(e);
	}
}


// Funtion to Confirm and Fetch Delete a Publication
function fetchDeletePublication()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/deletePublication/'+toDelete, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#deletePublication').modal('hide');
	    		var extras = '<b class="text-center mt-2">Once a publication is deleted, all its associated data is deleted</b><br><span class="text-muted" style="font-size: 12px;">(Images and MD file has been permanently deleted)</span><br>';
	    		
	    		alertSuccess(result, extras);
				loadPublications();
	    	}
	    	else
	    	{
				$('#deletePublication').modal('hide');
				alertError(result);
	    	}

	  		toDelete = '';

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Pre Delete a Publication
function deletePublication(btn)
{
	toDelete = btn.dataset.publication;
	$('#deletePublication').modal('show');
}



// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- MANAGE PATIENTS *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- //
// Funtion to Load Data Patients
function loadPatients()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/patients', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(patients => {

		  	// Render Patients
		      if (patients.length > 0) 
		      {
		      	document.querySelector('#patients_tbody').innerHTML = '';
		      	for (var i = 0; i < patients.length; i++) 
		        {
		         	renderPatient(document.querySelector('#patients_tbody'), patients[i]); 	
		        }
		      }
		      else
		      {
		      	document.querySelector('#patients_tbody').innerHTML = '<tr class="myRowTable rounded border"><th></th><td>NO DATA :(</td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>';

		      }
		      verifyHeightBody();
		  });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Render a Patient Row
function renderPatient(parent, data)
{
	myRow = document.createElement('tr');
	myRow.className = 'myRowTable rounded border';

		code = document.createElement('th');
		code.scope = 'row';
		code.innerHTML = data.code;

		first_name = document.createElement('td');
		first_name.innerHTML = data.first_name;

		last_name = document.createElement('td');
		last_name.innerHTML = data.last_name;

		celphone = document.createElement('td');
		celphone.innerHTML = data.celphone;

		email = document.createElement('td');
		email.innerHTML = data.email;

		numFiles = document.createElement('td');
		numFiles.innerHTML = '<button class="btn btn-primary btn-sm pt-0 pb-0" data-patient="'+data.code+'" onclick="openFolder(this);">'+data.numFiles+' Files, Open Folder</button>';

	myRow.append(code);
	myRow.append(first_name);
	myRow.append(last_name);
	myRow.append(celphone);
	myRow.append(email);
	myRow.append(numFiles);

	myRow.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-warning btn-sm pt-0 pb-0" data-patient="'+data.code+'" onclick="editPatient(this);">Edit</button> </td>';
	myRow.innerHTML += '<td style="word-break: unset !important;"> <button class="btn btn-danger btn-sm pt-0 pb-0" data-patient="'+data.code+'" onclick="deletePatient(this);">Delete </button> </td>';

	parent.append(myRow);
}

// Funtion to Confirm and Fetch Delete a Patient
function fetchDeletePatient()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		fetch('/adminLab/deletePatient/'+toDelete, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#deletePatient').modal('hide');
	    		var extras = '<b class="text-center mt-2">Once a code has been used it cannot be reassigned to another patient.</b><br><span class="text-muted" style="font-size: 12px;">(The following code was added to the bad list)</span><br><label class="font-weight-bold p-3 border btn-danger text-white"> '+result.code+' </label>';
	    		
	    		alertSuccess(result, extras);
				loadPatients();
	    	}
	    	else
	    	{
				$('#deletePatient').modal('hide');
				alertError(result);
	    	}

	  		toDelete = '';

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Pre Delete a Patient
function deletePatient(btn)
{
	toDelete = btn.dataset.patient;
	$('#deletePatient').modal('show');
}

// Funtion to Fetch Update data Patient
function fetchEditPatient()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		var formData = new FormData();
	    formData.append("first_name", document.querySelector('#editPatient_FirstName').value);
	    formData.append("last_name", document.querySelector('#editPatient_LastName').value);
	    formData.append("email", document.querySelector('#editPatient_Email').value);
	    formData.append("celphone", document.querySelector('#editPatient_Celphone').value);

		fetch('/adminLab/updatePatient/'+toEdit, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST',
	    	body: formData
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#editPatient').modal('hide');
	    		var extras = '<b class="text-center mt-2">Can´t update the code, It is still the same Code</b><br><br><label class="font-weight-bold p-3 border" style="background: #acef9f;"> '+result.code+' </label>';
	    		
	    		alertSuccess(result, extras);
				loadPatients();
	    	}
	    	else
	    	{
				$('#editPatient').modal('hide');
				alertError(result);
	    	}

		  	document.querySelector('#editPatient_FirstName').value = '';
	  		document.querySelector('#editPatient_LastName').value = '';
	  		document.querySelector('#editPatient_Email').value = '';
	  		document.querySelector('#editPatient_Celphone').value = '';
	  		document.querySelector('#editPatient_Code').innerHTML = '';

	  		toEdit = '';

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Load Data Edit a Patient
function editPatient(btn)
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
		var code = btn.dataset.patient;

		fetch('/adminLab/patient/'+code, {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST'
	    })
		  .then(response => response.json())
		  .then(result => {

		  	// Load Patient Data
		  	if (result.message) 
		  	{
		  		alertError(result);
		  		toEdit = '';
		  	}
		  	else
		  	{
		  		document.querySelector('#editPatient_FirstName').value = result.first_name;
		  		document.querySelector('#editPatient_LastName').value = result.last_name;
		  		document.querySelector('#editPatient_Email').value = result.email;
		  		document.querySelector('#editPatient_Celphone').value = result.celphone;
		  		document.querySelector('#editPatient_Code').innerHTML = result.code;

		  		toEdit = result.code;
				$('#editPatient').modal('show');
		  	}

		 });
	}
	catch (e)
	{
		console.log(e);
	}
}

// Funtion to Save a New Patient
function newPatient()
{
	try
	{
		const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

		var formData = new FormData();
	    formData.append("first_name", document.querySelector('#newPatient_FirstName').value);
	    formData.append("last_name", document.querySelector('#newPatient_LastName').value);
	    formData.append("email", document.querySelector('#newPatient_Email').value);
	    formData.append("celphone", document.querySelector('#newPatient_Celphone').value);


	    fetch('/adminLab/newPatient', {
	    	headers: {
	    		'X-CSRFToken': csrftoken 
	    	}, 
	    	method: 'POST', 
	    	body: formData 
	    }).then(response => response.json())
	    .then(result => {

	    	// Print Result Alert

	    	if (result.code) 
	    	{
	    		$('#newPatient').modal('hide');
	    		var extras = '<b class="text-center mt-2">Please give this code to the patient</b><br><br><label class="font-weight-bold p-3 border" style="background: #acef9f;"> '+result.code+' </label>';
	    		
	    		alertSuccess(result, extras);
				loadPatients();
	    	}
	    	else
	    	{
				$('#newPatient').modal('hide');
				alertError(result);
	    	}

	    	document.querySelector('#newPatient_FirstName').value = '';
		    document.querySelector('#newPatient_LastName').value = '';
		    document.querySelector('#newPatient_Email').value = '';
		    document.querySelector('#newPatient_Celphone').value = '';
	    });
	}
	catch (e)
	{
		console.log(e);
	}
}


///// FUNTIONS TO DINAMIC ALERTS /////

// Funtion to display a Error Alert 
function alertError(result)
{
	document.querySelector('#myAlert_Tittle').innerHTML = 'Error';
	document.querySelector('#myAlert_Body').className = 'text-center d-block';
	document.querySelector('#myAlert_Message').className = 'alert alert-danger';
	document.querySelector('#myAlert_Message').innerHTML = result.message;
	document.querySelector('#myAlert_Extras').innerHTML = result.error;
	document.querySelector('#myAlert_Btn').className = 'btn btn-danger';

	$('#myAlert').modal('show');
}

// funtion to Display a Success Alert
function alertSuccess(result, extras)
{
	document.querySelector('#myAlert_Tittle').innerHTML = 'Success';
	document.querySelector('#myAlert_Body').className = 'text-center d-block myFade';
	document.querySelector('#myAlert_Message').innerHTML = result.message;
	document.querySelector('#myAlert_Extras').innerHTML = extras;
	document.querySelector('#myAlert_Btn').className = 'btn btn-success';

	$('#myAlert').modal('show');
}


///// -*-*-*-*-*-*-*-*-*-*-*-*-* FUNTIONS DINAMIC WEB PAGE -*-*-*-*-*-*-*-*-*-*-*-*-* /////

// Load onClick Listener buttons Delete's Modal
function loadListenersDelete()
{
	if(document.querySelector('#btn-deletePatient'))
	{
		document.querySelector('#btn-deletePatient').addEventListener('click', fetchDeletePatient);
	}
	
	if(document.querySelector('#btn-deletePost'))
	{
		document.querySelector('#btn-deletePost').addEventListener('click', fetchDeletePublication);
	}
	
	if(document.querySelector('#btn-deleteUser'))
	{
		document.querySelector('#btn-deleteUser').addEventListener('click', fetchDeleteUser);
	}

	if(document.querySelector('#btn-deleteFileFolder'))
	{
		document.querySelector('#btn-deleteFileFolder').addEventListener('click', fetchDeleteFileFolder);
	}
}

// Load onClick buttons Change Password and Change Email
function loadEditAccount()
{
	if (document.querySelector('#btn-changePass')) 
	{
		document.querySelector('#btn-changePass').addEventListener('click', () => openSubMenu('pass'));
	}

	if (document.querySelector('#btn-changeEmail')) 
	{
		document.querySelector('#btn-changeEmail').addEventListener('click', () => openSubMenu('email'));
	}
	verifyHeightBody();
}

// Function to Show or Hidden form to change Pass or Email
function openSubMenu(option)
{
	switch(option)
	{
		case 'pass':
		if (document.querySelector('#change-pass')) {document.querySelector('#change-pass').className = 'container col-10 bg-light border pt-4 pb-3 mt-2 myFade';}
		if (document.querySelector('#change-email')) {document.querySelector('#change-email').className = 'container col-10 bg-light border pt-4 pb-3 mt-2 d-none';}
		break;

		case 'email':
		if (document.querySelector('#change-pass')) {document.querySelector('#change-pass').className = 'container col-10 bg-light border pt-4 pb-3 mt-2 d-none';}
		if (document.querySelector('#change-email')) {document.querySelector('#change-email').className = 'container col-10 bg-light border pt-4 pb-3 mt-2 myFade';}
		break;
	}
	verifyHeightBody();
}

// Load onClick buttons Navbar
function loadNavbar()
{
	if(document.querySelector('#btn-patients'))
	{
		document.querySelector('#btn-patients').addEventListener('click', () => openDiv('patients'));
	}

	if(document.querySelector('#btn-publications'))
	{
		document.querySelector('#btn-publications').addEventListener('click', () => openDiv('publications'));
	}

	if(document.querySelector('#btn-users'))
	{
		document.querySelector('#btn-users').addEventListener('click', () => openDiv('users'));
	}

	if(document.querySelector('#btn-account'))
	{
		document.querySelector('#btn-account').addEventListener('click', () => openDiv('account'));
	}

	if(document.querySelector('#back'))
	{
		document.querySelector('#back').addEventListener('click', () => openDiv('patients'));
	}

	if (window.location.toString().split('/')[3] === "adminLab" && window.location.toString().split('/')[4] === "login") 
	{
		document.querySelector('#btn-home').className = 'nav-item nav-link active rounded myBtn';
		document.querySelector('#btn-login').className = 'nav-item nav-link rounded ml-1 text-white btn btn-outline-warning active';
	}
	verifyHeightBody();
}

// Show or hidden Div Patients, Publications or Users
function openDiv(myDiv)
{
	activeButtonsNavbar(myDiv);
	showDiv(myDiv);
	verifyHeightBody();
}

// Funtion to change className 'd-none' on div index adminLab
function showDiv(myDiv)
{
	switch(myDiv)
	{
		case 'patients':
		document.querySelector('#home').className = 'd-none';
		if(document.querySelector('#patients')){document.querySelector('#patients').className = 'myFade d-block';}
		if(document.querySelector('#publications')){document.querySelector('#publications').className = 'd-none';}
		if(document.querySelector('#users')){document.querySelector('#users').className = 'd-none';}
		if (document.querySelector('#account')) {document.querySelector('#account').className = 'd-none';}
		if (document.querySelector('#folder')) {document.querySelector('#folder').className = 'd-none';}
		break;

		case 'publications':
		document.querySelector('#home').className = 'd-none';
		if(document.querySelector('#patients')){document.querySelector('#patients').className = 'd-none';}
		if(document.querySelector('#publications')){document.querySelector('#publications').className = 'myFade d-block';}
		if(document.querySelector('#users')){document.querySelector('#users').className = 'd-none';}
		if (document.querySelector('#account')) {document.querySelector('#account').className = 'd-none';}
		if (document.querySelector('#folder')) {document.querySelector('#folder').className = 'd-none';}
		break;

		case 'users':
		document.querySelector('#home').className = 'd-none';
		if(document.querySelector('#patients')){document.querySelector('#patients').className = 'd-none';}
		if(document.querySelector('#publications')){document.querySelector('#publications').className = 'd-none';}
		if(document.querySelector('#users')){document.querySelector('#users').className = 'myFade d-block';}
		if (document.querySelector('#account')) {document.querySelector('#account').className = 'd-none';}
		if (document.querySelector('#folder')) {document.querySelector('#folder').className = 'd-none';}
		break;

		case 'account':
		document.querySelector('#home').className = 'd-none';
		if(document.querySelector('#patients')){document.querySelector('#patients').className = 'd-none';}
		if(document.querySelector('#publications')){document.querySelector('#publications').className = 'd-none';}
		if(document.querySelector('#users')){document.querySelector('#users').className = 'd-none';}
		if (document.querySelector('#account')) {document.querySelector('#account').className = 'myFade d-block';}
		if (document.querySelector('#folder')) {document.querySelector('#folder').className = 'd-none';}
		break;

		case 'folder':
		document.querySelector('#home').className = 'd-none';
		if(document.querySelector('#patients')){document.querySelector('#patients').className = 'd-none';}
		if(document.querySelector('#publications')){document.querySelector('#publications').className = 'd-none';}
		if(document.querySelector('#users')){document.querySelector('#users').className = 'd-none';}
		if (document.querySelector('#account')) {document.querySelector('#account').className = 'd-none';}
		if (document.querySelector('#folder')) {document.querySelector('#folder').className = 'myFade d-block';}
		break;
	}
	verifyHeightBody();
}

// Funtion to change className 'active' on buttons Navbar
function activeButtonsNavbar(myDiv)
{
	switch(myDiv)
	{
		case 'patients':
		document.querySelector('#btn-home').className = 'nav-item nav-link active rounded myBtn';
		if(document.querySelector('#btn-patients')){document.querySelector('#btn-patients').className = 'nav-item nav-link active rounded myBtn bg-primary';}
		if(document.querySelector('#btn-publications')){document.querySelector('#btn-publications').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-users')){document.querySelector('#btn-users').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-account')){document.querySelector('#btn-account').className = 'nav-link btn btn-outline-light myUser mt-2 mb-1 pb-0';}
		break;

		case 'publications':
		document.querySelector('#btn-home').className = 'nav-item nav-link active rounded myBtn';
		if(document.querySelector('#btn-patients')){document.querySelector('#btn-patients').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-publications')){document.querySelector('#btn-publications').className = 'nav-item nav-link active rounded myBtn bg-primary';}
		if(document.querySelector('#btn-users')){document.querySelector('#btn-users').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-account')){document.querySelector('#btn-account').className = 'nav-link btn btn-outline-light myUser mt-2 mb-1 pb-0';}
		break;

		case 'users':
		document.querySelector('#btn-home').className = 'nav-item nav-link active rounded myBtn';
		if(document.querySelector('#btn-patients')){document.querySelector('#btn-patients').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-publications')){document.querySelector('#btn-publications').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-users')){document.querySelector('#btn-users').className = 'nav-item nav-link active rounded myBtn bg-primary';}
		if(document.querySelector('#btn-account')){document.querySelector('#btn-account').className = 'nav-link btn btn-outline-light myUser mt-2 mb-1 pb-0';}
		break;

		case 'account':
		document.querySelector('#btn-home').className = 'nav-item nav-link active rounded myBtn';
		if(document.querySelector('#btn-patients')){document.querySelector('#btn-patients').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-publications')){document.querySelector('#btn-publications').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-users')){document.querySelector('#btn-users').className = 'nav-item nav-link active rounded myBtn';}
		if(document.querySelector('#btn-account')){document.querySelector('#btn-account').className = 'nav-link btn btn-outline-light myUserActive mt-2 mb-1 pb-0 active';}
		break;

		default:
		break;
	}
	verifyHeightBody();
}

// Funtion to verify height body then position footer
function verifyHeightBody()
{
	var h = document.querySelector('#myBody').clientHeight;
	if(h < screen.height-70)
	{
		document.querySelector('#myFooter').className = 'pt-4 miFooter pb-4 mt-5 fixed-bottom';
	}
	else
	{
		document.querySelector('#myFooter').className = 'pt-4 miFooter pb-4 mt-5';
	}
}