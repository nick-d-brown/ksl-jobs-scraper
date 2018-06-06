// Linked to main.handlebars
$(document).on("click", ".note-button", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    $("#notes").toggleClass("hidden");
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    console.log(this);
    
    $.ajax({
            method: "GET",
            url: "/jobs/" + thisId
        })
        .then(function (data) {
            console.log(data);

            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<div class='note-input'>");
            $(".note-input").append("<input id='titleinput' name='title' placeholder='Note Title'>");
            $(".note-input").append("<textarea id='bodyinput' name='body' placeholder='Note Body'></textarea>");
            // $("#notes").append("<div>");
            $("#notes").append("<button data-id='" + data._id + "'class='save-button' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});


$(document).on("click", "#savenote", function () {
    $("#notes").toggleClass("hidden");
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/jobs/note/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});