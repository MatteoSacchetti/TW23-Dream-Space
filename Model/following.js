$(document).ready(function () {
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

function downlaodFollowing($sessionEmail, $getEmail) {
    $.ajax({
        url: '../Model/following.php?email=' + $getEmail,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            response.forEach(element => {
                let followingHtml = `
                    <div class="m-4">
                        <a href="profile.html?email=${element.follower}" class="btn p-0"><h5>${element.name} ${element.surname}</h5></a>
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
