$(document).ready(function () {
    // Controllo se l'utente è loggato
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    $.ajax({
        url: '../Model/session.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.email) {
                $('#profilo').attr('href', 'profile.html?email=' + response.email);
                downlaodFollowers(email);
            } else {
                window.location.href = 'home.html';
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
});

// Funzione per scaricare i followers
function downlaodFollowers($getEmail) {
    $.ajax({
        url: '../Model/followers.php?email=' + $getEmail,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            response.forEach(element => {
                let followersHtml = `
                    <div class="m-2 text-center">
                        <a href="profile.html?email=${element.author}" class="btn p-0"><p class="h5">${element.name} ${element.surname}</p></a>
                        <hr>
                    </div>
                `;
                $('#followers').append(followersHtml);
            });
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}
