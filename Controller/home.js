$(document).ready(function () {
    // Controllo se l'utente è loggato
    $.ajax({
        url: '../Model/session.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.email) {
                downlaodPosts(response.email);
                $('#profilo').attr('href', 'profile.html?email=' + response.email);
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
function downlaodPosts(email) {
    $.ajax({
        url: '../Model/home.php',
        method: 'GET',
        dataType: 'json',
        success: function (posts) {
            // Per ogni post che ottengo creo una struttura html
            posts.forEach(function (post, _) {
                // Se il post è il mio non lo mostro
                if (post.email === email) {
                    return;
                }

                // Creo struttura carousel di bootstrap per le immagini
                let postHtml = `
                    <div>
                        <a href="profile.html?email=${post.email}" class="btn p-0"><h2>${post.name} ${post.surname}</h2></a>
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
                            <a href="profile.html?email=${comment.author}" class="btn p-0"><p class="h5">${comment.author_name} ${comment.author_surname}</p></a>
                            <p>${comment.comment}</p>
                            <hr>
                        </div>
                    `;
                });

                postHtml += `
                        <div class="m-4">
                            <label for="comment${post.post_id}" class="form-label">Aggiungi un commento:</label>
                            <input type="text" class="form-control" id="comment${post.post_id}" placeholder="Aggiungi un commento">
                            <button class="btn w-100" onclick="comment(${post.post_id}, '${email}', '${post.email}')">Invia</button>
                        </div>
                        <hr class="mb-5">
                    `;

                $('#posts').append(postHtml);
            });
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

// Funzione per inviare un commento e notificare l'utente
function comment($post_id, $sender, $receiver) {
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
                $.ajax({
                    type: 'POST',
                    url: '../Model/sessionNameSurname.php',
                    dataType: 'json',
                    success: function (result) {
                        let message = result.nome + " " + result.cognome + " ha commentato il tuo post: " + comment;
                        $.ajax({
                            type: 'POST',
                            url: '../Model/home_notifications_send.php',
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
            }
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
        url: '../Model/home_notifications_read.php',
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
        url: "../Model/home_notifications.php",
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
