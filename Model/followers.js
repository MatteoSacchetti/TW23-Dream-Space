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

function downlaodFollowers($getEmail) {
    $.ajax({
        url: '../Model/followers.php?email=' + $getEmail,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            response.forEach(element => {
                let followersHtml = `
                    <div class="m-4">
                        <a href="profile.html?email=${element.author}" class="btn p-0"><h5>${element.name} ${element.surname}</h5></a>
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
