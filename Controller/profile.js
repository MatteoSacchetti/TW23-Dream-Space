$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');

    // Controllo se l'utente è loggato
    $sessionMail = "";
    $.ajax({
        url: '../Model/session.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.email) {
                $sessionMail = response.email;
                $('#profilo').attr('href', 'profile.html?email=' + response.email);

                // Se la mail della sessione è diversa dalla mail del profilo, rimuovo il div per aggiungere post
                if ($sessionMail != email) {
                    console.log("sessionMail: " + $sessionMail + " email: " + email);
                    $('#insert_post').remove();
                }

                // Scarico tutti i dati del profilo con i post e i commenti
                downlaodProfilePosts(email);
            } else {
                window.location.href = 'index.html';
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });

    // Chiamo la funzione per settare la notifica come letta quando si chiude il modal
    $("#closeModalButton").on("click", function () {
        changeStatus($(this).data("notification-id"));
    });

    // Richiamo la funzione per gestire il click dell'immagine quando ridimensiono la finestra
    $(window).resize(function () {
        resizeImg();
    });
    // La prima volta che apro la pagina eseguo la funzione resizeImg
    resizeImg();
});

// Funzione per scaricare i post e i commenti
function downlaodProfilePosts(email) {
    $.ajax({
        url: '../Model/profile.php?email=' + email,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            // Stampo il nome e cognome dell'utente
            let dataHtml = `
                <h2 id="dati" class="text-center">${response.name} ${response.surname}</h2>
                <div class="d-flex justify-content-center mt-3">
                    <a class="btn p-0" href="../view/followers.html?email=${email}"><p class="h5">Followers: <span id="followers">${response.followers}</span></p></a>
                    <a class="btn p-0" href="../view/following.html?email=${email}"><p class="h5 ms-5">Following: <span id="following">${response.following}</span></p></a>
                </div>
            `;
            $('#profilo-dati').append(dataHtml);

            // Stampo il tasto per seguire l'utente
            if (response.follow != -1) {
                let followHtml = `
                    <div class="d-flex justify-content-center mt-2" id="follow-div">
                `;
                if (response.follow == 0) {
                    followHtml += `<button id="follow" class="btn" onclick="follow('${$sessionMail}', '${email}')">Inizia a seguire</button>`;
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
                                <a href="profile.html?email=${comment.author}" class="btn p-0"><h3>${comment.author_name} ${comment.author_surname}</h3></a>
                                <p>${comment.comment}</p>
                                <hr>
                            </div>
                        `;
                    });

                    postHtml += `
                            <div class="m-4">
                                <label for="comment${post.post_id}" class="form-label">Aggiungi un commento:</label>
                                <input type="text" class="form-control" id="comment${post.post_id}" placeholder="Aggiungi un commento">
                                <button class="btn w-100" onclick="comment(${post.post_id}, '${$sessionMail}', '${email}')">Invia</button>
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
}

// Funzoine per inviare un commento e inviare notifica all'utente
function comment($post_id, $sender, $receiver) {
    let comment = $('#comment' + $post_id).val();
    $.ajax({
        type: 'POST',
        url: '../Model/comment_send.php',
        dataType: 'json',
        data: {
            post_id: $post_id,
            comment: comment
        },
        success: function (result) {
            if (result === "OK" && $sender != $receiver) {
                $.ajax({
                    type: 'POST',
                    url: '../Model/sessionNameSurname.php',
                    dataType: 'json',
                    success: function (result) {
                        let message = result.nome + " " + result.cognome + " ha commentato il tuo post: " + comment;
                        $.ajax({
                            type: 'POST',
                            url: '../Model/notifications_send.php',
                            dataType: 'json',
                            data: {
                                sender: $sender,
                                receiver: $receiver,
                                message: message
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
                    },
                    error: function (status, error) {
                        console.log('Error', status, error);
                    }
                });
            } else {
                window.location.reload();
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

// Funzione per seguire un utente
function follow($sender, $receiver) {
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
            $.ajax({
                type: 'POST',
                url: '../Model/sessionNameSurname.php',
                dataType: 'json',
                success: function (result) {
                    let message = result.nome + " " + result.cognome + " ha iniziato a seguirti.";
                    $.ajax({
                        type: 'POST',
                        url: '../Model/notifications_send.php',
                        dataType: 'json',
                        data: {
                            sender: $sender,
                            receiver: $receiver,
                            message: message
                        },
                        success: function (result) {
                            if (result != "OK") {
                                console.log('Error', result);
                            }
                        },
                        error: function (status, error) {
                            console.log('Error', status, error);
                        }
                    });
                },
                error: function (status, error) {
                    console.log('Error', status, error);
                }
            });
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

// Funzione per smettere di seguire un utente
function unfollow() {
    $sessionMail = "";
    $.ajax({
        url: '../Model/session.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.email) {
                $sessionMail = response.email;
            } else {
                window.location.href = 'index.html';
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
        url: '../Model/profile_unfollow.php?email=' + email,
        method: 'GET',
        success: function () {
            $('#follow-div').empty();
            $('#follow-div').append(`<button id="follow" class="btn" onclick="follow('${$sessionMail}', '${email}')">Inizia a seguire</button>`);
            let followers = parseInt($('#followers').text());
            $('#followers').text(followers - 1);
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

// Funzione per settare la notifica come letta
function changeStatus(notificationId) {
    $.ajax({
        type: 'POST',
        url: '../Model/notifications_read.php',
        dataType: 'json',
        data: {
            notification_id: notificationId
        },
        success: function (result) {
            if (result != "OK") {
                console.log('Error', result);
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

// Funzione per scaricare le eventuali notifiche ogni 5 secondi
setInterval(function () {
    $.ajax({
        type: "GET",
        url: "../Model/notifications_download.php",
        datatype: "json",
        success: function (response) {
            if (response.length > 0) {
                response = JSON.parse(response);
                response.forEach(function (notification, _) {
                    $("#closeModalButton").data("notification-id", notification.notification_id);
                    $("#notifiche_testo").text(notification.message);
                    $("#notifiche_modal_div").modal("show");
                });
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}, 5000);

// Funzione per aprire il modal dell'immagine se la larghezza della finestra è inferiore a 750px
function resizeImg() {
    if ($(window).width() < 750) {
        $(document).on('click', '.carousel-item img', function () {
            const img = $(this).attr('src');
            $('#modalImage').attr('src', img);
            $('#imageModal').modal('show');
        });
    } else {
        $(document).off('click', '.carousel-item img');
    }
}
