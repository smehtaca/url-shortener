$(".btn-analyze").on("click", function() {
  $.ajax({
    url: "/api/analyze",
    type: "POST",
    dataType: "json",
    data: {
      url: $("#url-input").val()
    },
    success: function(data) {
      var trHTML = "";

      clickedHTML = "<p>" + data.clicked + "</p>";
      $.each(data.users, function(index, user) {
        trHTML +=
          "<tr><td>" +
          user.ip +
          "</td><td>" +
          user.device +
          "</td><td>" +
          user.os +
          "</td><td>" +
          user.browser +
          "</td><td>" +
          user.timestamp +
          "</td></tr>";
      });

      $("#users").append(trHTML);
      $("#clicked").html(clickedHTML);
    },
    error: function() {
      console.log("The request failed");
    }
  });
});
