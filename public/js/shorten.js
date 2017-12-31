$(".btn-shorten").on("click", function() {
  $.ajax({
    url: "/api/shorten",
    type: "POST",
    dataType: "JSON",
    data: {
      url: $("#url-input").val()
    },
    success: function(data) {
      var result =
        '<p> Your Shortened URL is <a class="shortened-url" href="' +
        data.shortenedURL +
        '">' +
        data.shortenedURL +
        "</a> </p>";
      $("#shortened-link").html(result);
      $("#shortened-link").fadeIn("slow");
    }
  });
});
