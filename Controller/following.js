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
                downlaodFollowing(response.email, email);
            } else {
                window.location.href = 'home.html';
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
});

// Funzione per scaricare i following
function downlaodFollowing($sessionEmail, $getEmail) {
    $.ajax({
        url: '../Model/following.php?email=' + $getEmail,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            response.forEach(element => {
                let followingHtml = `
                    <div class="m-2 text-center">
                        <a href="profile.html?email=${element.follower}" class="btn p-0"><p class="h5">${element.name} ${element.surname}</p></a>
                        <br>
                `;
                if ($sessionEmail === $getEmail) {
                    followingHtml += `
                        <button class="btn p-0" onclick="unfollow('${element.follower}')">Smetti di seguire</button>
                    `;
                }
                followingHtml += `
                        <hr>
                    </div>
                `;
                $('#following').append(followingHtml);
            });
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

// Funzione per smettere di seguire un following
function unfollow($email) {
    $.ajax({
        url: '../Model/profile_unfollow.php?email=' + $email,
        method: 'GET',
        success: function () {
            window.location.reload();
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}
