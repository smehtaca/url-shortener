$(".btn-shorten").on("click", function() {
  $.ajax({
    url: "/api/shorten",
    type: "POST",
    dataType: "json",
    data: {
      url: $("#url-input").val()
    },
    success: function(data) {
      var result =
        '<p> Your Shortened URL is <a class="shortened-url" href="' +
        data.shortenedUrl +
        '">' +
        data.shortenedUrl +
        "</a> </p>";
      $("#shortened-link").html(result);
      $("#shortened-link").fadeIn("slow");
    },
    error: function() {
      console.log("The request failed");
    }
  });
});
