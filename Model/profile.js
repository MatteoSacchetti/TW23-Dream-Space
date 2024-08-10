$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    $.ajax({
        url: '../Model/profile.php?email=' + email,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
        },  
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
});