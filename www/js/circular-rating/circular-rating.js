(function (window) {
  // Global timer
  window.ratingTimer;
  var ratingCircleEements;

  // To be added later from scope
  var config = {
    min: 5,
    max: 10,
    step: 1,
  };

  circularRating.$inject = [];
  function circularRating() {

    /**
     * Angular directive link function
     * @param scope
     * @param elem
     * @param attrs
     */
    function link(scope, elem, attrs) {
      ratingCircleEements = getRatingElements();
      ionic.onGesture('hold', onHold, ratingCircleEements.control, {});
      ionic.onGesture('release', onRelease, ratingCircleEements.control, {});
    }


    /**
     * Get circular rating elements
     * @returns {{control: Element, transparentTrack: Element, ratingTrack: Element, confirmationPop: Element, ratingValue: Element, confirmBtn: Element, cancelBtn: Element}}
     */
    function  getRatingElements() {
      return {
        control: document.getElementById('start-button'),
        controlOuterCircle: document.getElementById('button-outer-circle'),
        transparentTrack: document.getElementById('transparent-track'),
        ratingTrack: document.getElementById('rating-track-seek'),
        confirmationPop: document.getElementById('start-button'),
        ratingValue: document.getElementById('start-button'),
        confirmBtn: document.getElementById('start-button'),
        cancelBtn: document.getElementById('start-button'),
        hintText: document.getElementById('hint-text')

      }
    }

    /**
     * On hold event callback
     * @param e
     */
    function onHold(e) {
      console.log(e);
      // set timer interval on button hold
      window.ratingTimer = setInterval(function(){
        console.log('timer');
      }, 1);

      initialOnHoldEvents();

      var holdDuration = e.timeStamp;
      console.log(holdDuration);
    }

    /**
     * Initial on hold actions
     */
    function initialOnHoldEvents() {
      // show transparent seek
      console.log(ratingCircleEements.transparentTrack);
      ratingCircleEements.transparentTrack.classList.add('draw-stroke');
      ratingCircleEements.hintText.style.opacity = 0;
      ratingCircleEements.transparentTrack.addEventListener("animationend", onDrawStrokeEnd);
    }

    function onDrawStrokeEnd() {
      ratingCircleEements.ratingTrack.classList.add('draw-stroke');

      // start  rating
    }

    function showConfirmationPop() {
      ratingCircleEements.confirmationPop.classList.add('');
    }


    function startRating() {
      config.min += config.step;
    }

    /**
     * On release event callback
     * @param e
     */
    function onRelease(e) {
      // Cancel time interval on button release
      if (window.ratingTimer) {
        clearInterval(window.ratingTimer);
      }
      showConfirmationPop();
    }

    /**
     * Return angular directive definitions
     */
    return {
      templateUrl: 'js/circular-rating/circular-rating.html',
      restrict: 'EA',
      scope: {

      },
      link: link
    }
  }
  angular.module('circular-rating', []).
    directive('circularRating', circularRating);

}(window));
