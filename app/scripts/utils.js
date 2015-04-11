var SF;
(function(SF) {
  Q.longStackSupport = true;
  var retrieve = function(url) {
    return jQuery.ajax({
      url: url,
      type: "GET"
    });
  };
  SF.Util = {
    retrieve: retrieve
  };
})(SF || (SF = {}));
