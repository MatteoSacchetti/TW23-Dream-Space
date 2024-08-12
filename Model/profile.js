$(document).ready(function () {
    $.ajax({
        url: '../Model/session.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.email) {
                $('#profilo').attr('href', 'profile.html?email=' + response.email);
            } else {
                window.location.href = 'login.html';
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    $.ajax({
        url: '../Model/profile.php?email=' + email,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            // Stampo il nome e cognome dell'utente
            let dataHtml = `
                <h2 id="dati" class="text-center">${response.name} ${response.surname}</h2>
                <div class="d-flex justify-content-center mt-3">
                    <a class="btn p-0" href="../view/followers.html?email=${email}"><h5>Followers: <span id="followers">${response.followers}</span></h5></a>
                    <a class="btn p-0" href="../view/following.html?email=${email}"><h5 class="ms-5">Following: <span id="following">${response.following}</span></h5></a>
                </div>
            `;
            $('#dati').append(dataHtml);

            // Stampo il tasto per seguire l'utente
            if (response.follow != -1) {
                let followHtml = `
                    <div class="d-flex justify-content-center mt-2" id="follow-div">
                `;
                if (response.follow == 0) {
                    followHtml += `<button id="follow" class="btn" onclick="follow()">Inizia a seguire</button>`;
                } else {
                    followHtml += `<button id="follow" class="btn" onclick="unfollow()">Smetti di seguire</button>`;
                }
                followHtml += `
                    </div>
                `;
                $('#follow-logout').append(followHtml);
            } else {
                let logoutHtml = `
                    <div class="d-flex justify-content-center mt-2" id="follow-div">
                        <a class="btn" href="../Model/logout.php">Logout</a>
                    </div>
                `;
                $('#follow-logout').append(logoutHtml);
            }

            // Stampo i post con relativi commenti
            if (response.posts.length === 0) {
                $('#posts').append(`<p class="text-center">Nessun post</p>`);
            } else {
                response.posts.forEach(function (post, _) {
                    // Creo struttura carousel di bootstrap per le immagini
                    let postHtml = `
                        <div>
                            <div id="carousel-${post.post_id}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                    `;

                    // Aggiungo gli elementi del carousel
                    post.photo_urls.forEach(function (photo, index) {
                        postHtml += `
                                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                        <img src="${photo}" class="d-block w-100" alt="Slide ${index}">
                                    </div>
                        `;
                    });

                    postHtml += `
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${post.post_id}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${post.post_id}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                            <p class="mt-3">${post.description}</p>
                            <hr>
                    `;

                    // Aggiungo i commenti al post
                    post.comments.forEach(function (comment) {
                        postHtml += `
                            <div class="m-4">
                                <a href="profile.html?email=${comment.author}" class="btn p-0"><h5>${comment.author_name} ${comment.author_surname}</h5></a>
                                <p>${comment.comment}</p>
                                <hr>
                            </div>
                        `;
                    });

                    postHtml += `
                            <div class="m-4">
                                <input type="text" class="form-control" id="comment${post.post_id}" placeholder="Aggiungi un commento">
                                <button class="btn w-100" onclick="comment(${post.post_id})">Invia</button>
                            </div
                        </div>
                        <hr class="mb-5">
                    `;

                    $('#posts').append(postHtml);
                });
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
});

function comment($post_id) {
    let comment = $('#comment' + $post_id).val();
    $.ajax({
        type: 'POST',
        url: '../Model/home_comment.php',
        dataType: 'json',
        data: {
            post_id: $post_id,
            comment: comment
        },
        success: function (result) {
            if (result === "OK") {
                window.location.reload();
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

function follow() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    $.ajax({
        url: '../Model/profile_follow.php?email=' + email,
        method: 'GET',
        success: function () {
            $('#follow-div').empty();
            $('#follow-div').append(`<button id="follow" class="btn" onclick="unfollow()">Smetti di seguire</button>`);
            let followers = parseInt($('#followers').text());
            $('#followers').text(followers + 1);
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

function unfollow() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    $.ajax({
        url: '../Model/profile_unfollow.php?email=' + email,
        method: 'GET',
        success: function () {
            $('#follow-div').empty();
            $('#follow-div').append(`<button id="follow" class="btn" onclick="follow()">Inizia a seguire</button>`);
            let followers = parseInt($('#followers').text());
            $('#followers').text(followers - 1);
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}
