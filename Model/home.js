$(document).ready(function () {
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

    $("#closeModalButton").on("click", function () {
        changeStatus($(this).data("notification-id"));
    });
});

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
                        <a href="profile.html?email=${post.email}" class="btn p-0"><h3>${post.name} ${post.surname}</h3></a>
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
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

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
                // TODO invia notifica
            }
        },
        error: function (status, error) {
            console.log('Error', status, error);
        }
    });
}

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
