// Globar Vars
var toEdit = '';
var toDelete = '';
var toPatient = '';

// Main Function
document.addEventListener('DOMContentLoaded', function() {
	loadNavbar();
	loadEditAccount();
	loadListenersDelete();
	listener();
	verifyHeightBody();
});

///// FUNTIONS TO DINAMIC MAP /////
function listener() {
    document.querySelectorAll('.listen').forEach(btn => {
        btn.onclick = function () {
            window.location = "edificios/"+btn.id+"";
        }
    });
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