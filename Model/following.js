$(document).ready(function () {
    $.ajax({
        url: '../Model/session.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.email) {
                $('#profilo').attr('href', 'profile.html?email=' + response.email);
            } else {
                window.location.href = 'home.html';
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
});
