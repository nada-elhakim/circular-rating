(function (window, angular, undefined) {
  function link() {

  }



  function circularRating() {
    return {
      template: '',
      restrict: 'EA',
      scope: {

      },
      link: link
    }
  }
  angular.module('circular-rating', []).
    directive('circularRating', circularRating);

}(window, angular, undefined));
