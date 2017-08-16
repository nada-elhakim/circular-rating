(function (window) {
  circularRating.$inject = [];
  function circularRating() {
    var context;
    /**
     * Angular directive link function
     * @param scope
     * @param elem
     * @param attrs
     */
    function link(scope, elem, attrs) {
      new CircularRatingClass(elem, scope.options);
    }

    function CircularRatingClass(options, elem) {
      this.elem = elem;
      this.ratingTimer;
      this.ratingCircleEements;
      this.holdDuration;
      // To be added later from scope
      this.options = {
        min: 1,
        max: 10,
        step: 1,
      };
      // if(options){
      //   this.options = options;
      // }
      this.init();
    }

    CircularRatingClass.prototype.init = init;
    CircularRatingClass.prototype.getRatingElements = getRatingElements;
    CircularRatingClass.prototype.initialOnHoldEvents = initialOnHoldEvents;
    CircularRatingClass.prototype.startRating = startRating;
    CircularRatingClass.prototype.updateRating = updateRating;
    CircularRatingClass.prototype.hide = hide;
    CircularRatingClass.prototype.show = show;
    CircularRatingClass.prototype.removeAnimationClasses = removeAnimationClasses;
    CircularRatingClass.prototype.addAnimationClasses = addAnimationClasses;
    CircularRatingClass.prototype.showConfirmationPop = showConfirmationPop;



    function init() {
      context = this;
      console.log('init');
      this.ratingCircleEements =  this.getRatingElements();
      ionic.onGesture('hold', onHold, this.ratingCircleEements.control, {});
      ionic.onGesture('release', onRelease, this.ratingCircleEements.control, {});
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
        confirmationPop: document.getElementById('circular-rating-confirm'),
        resultUpdatePop: document.getElementById('circular-rating-result'),
        ratingValue: document.getElementById('rating-value'),
        confirmBtn: document.getElementById('start-button'),
        cancelBtn: document.getElementById('start-button'),
        hintText: document.getElementById('hint-text')

      }
    }



    /**
     * Initial on hold actions
     */
    function initialOnHoldEvents() {
      // show transparent seek
      console.log('initial events');

      console.log(this.ratingCircleEements.transparentTrack);
      this.ratingCircleEements.transparentTrack.classList.add('draw-stroke');

      this.ratingCircleEements.ratingValue.innerText = this.options.min;
      this.ratingCircleEements.resultUpdatePop.style.display = 'block';
      this.ratingCircleEements.resultUpdatePop.classList.add('fade-in');

      this.ratingCircleEements.hintText.style.opacity = 0;
      this.ratingCircleEements.transparentTrack.addEventListener("animationend", onTransparentTrackDrawStrokeEnd);
    }

    /**
     * On hold event callback
     * @param e
     */
    function onHold(e) {
      console.log('on hold event');
      // set timer interval on button hold
      // context.ratingTimer = setInterval(function(){
      //   console.log('timer');
      // }, 1);

      context.initialOnHoldEvents();
      context.holdDuration = e.timeStamp;
    }

    function onTransparentTrackDrawStrokeEnd() {
      console.log('on draw stroke end');
      context.ratingCircleEements.ratingTrack.classList.add('draw-stroke');

      // start  rating
    }

    function showConfirmationPop() {
      console.log('show confirmation pop');
      console.log(this.ratingCircleEements.confirmationPop);
      show(this.ratingCircleEements.confirmationPop);
      //this.ratingCircleEements.confirmationPop.classList.add('zoom-in');
    }


    function startRating() {
      console.log('start rating');
      this.options.min += this.options.step;
    }

    function updateRating() {
      console.log('update rating');
    }

    /**
     * On release event callback
     * @param e
     */
    function onRelease(e) {
      console.log('on release');
      context.removeAnimationClasses();
      hide(context.ratingCircleEements.transparentTrack);
      hide(context.ratingCircleEements.resultUpdatePop);
      // Cancel time interval on button release
      if (context.ratingTimer) {
        clearInterval(context.ratingTimer);
      }
      context.showConfirmationPop();
    }

    function addAnimationClasses() {

    }
    function removeAnimationClasses() {
      this.ratingCircleEements.ratingTrack.classList.remove('draw-stroke');
      //this.ratingCircleEements.confirmationPop.classList.remove('zoom-in');
      this.ratingCircleEements.transparentTrack.classList.remove('draw-stroke');

    }

    function hide(elem) {
      elem.style.display = 'none';
    }

    function show(elem) {
      elem.style.display = 'block';
    }



    /**
     * Return angular directive definitions
     */
    return {
      templateUrl: 'js/circular-rating/circular-rating.html',
      restrict: 'EA',
      scope: {
        options: '='
      },
      link: link
    }
  }
  angular.module('circular-rating', []).
    directive('circularRating', circularRating);

}(window));
