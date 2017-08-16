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
      this.ratingTimer = 0;
      this.ratingCircleEements = {};
      this.holdDuration = 0;
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
    CircularRatingClass.prototype.confirmRating = confirmRating;
    CircularRatingClass.prototype.resetRating = resetRating;
    CircularRatingClass.prototype.hideRatingWidget = hideRatingWidget;




    function init() {
      context = this;
      console.log('init');
      this.ratingCircleEements =  this.getRatingElements();
      ionic.onGesture('hold', onHold, this.ratingCircleEements.control, {});
      ionic.onGesture('release', onRelease, this.ratingCircleEements.control, {});
      ionic.onGesture('click', confirmRating, this.ratingCircleEements.confirmBtn, {});
      ionic.onGesture('click', resetRating, this.ratingCircleEements.cancelBtn, {});
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
        ratingUpdatePop: document.getElementById('circular-rating-rate'),
        ratingValue: document.getElementById('rating-value'),

        confirmBtn: document.getElementById('save-rating'),
        cancelBtn: document.getElementById('reset-rating'),

        hintText: document.getElementById('hint-text'),
        ratingResultContainer: document.getElementById('circular-rating-result')

      }
    }

    function confirmRating() {
      console.log('confirm');
      context.removeAnimationClasses();
      context.hideRatingWidget();
    }

    function resetRating() {
      console.log('cancel');
      context.removeAnimationClasses();
      context.hideRatingWidget();
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
      this.ratingCircleEements.ratingUpdatePop.style.display = 'block';
      this.ratingCircleEements.ratingUpdatePop.classList.add('fade-in');

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
      //console.log(this.ratingCircleEements.confirmationPop);
      this.show(this.ratingCircleEements.confirmationPop);
      this.show(this.ratingCircleEements.ratingResultContainer);
      this.show(this.ratingCircleEements.ratingTrack);
      this.ratingCircleEements.confirmationPop.classList.add('zoom-in');
      this.ratingCircleEements.confirmationPop.addEventListener("animationend", onShowConfirmation);
    }

    function onShowConfirmation() {
      context.ratingCircleEements.cancelBtn.classList.add('slide-up');
      context.ratingCircleEements.cancelBtn.addEventListener("animationend", function(){
        context.ratingCircleEements.confirmBtn.classList.add('slide-up');
      });
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
      context.hide(context.ratingCircleEements.transparentTrack);
      context.hide(context.ratingCircleEements.ratingUpdatePop);
      // Cancel time interval on button release
      if (context.ratingTimer) {
        clearInterval(context.ratingTimer);
      }
      context.showConfirmationPop();
    }

    function addAnimationClasses() {

    }
    function removeAnimationClasses() {
      //this.ratingCircleEements.ratingTrack.classList.remove('draw-stroke');
      //this.ratingCircleEements.confirmationPop.classList.remove('zoom-in');
      this.ratingCircleEements.transparentTrack.classList.remove('draw-stroke');

    }

    function hide(elem) {
      elem.style.display = 'none';
    }

    function show(elem) {
      elem.style.display = 'block';
      elem.style.opacity = 1;
    }

    function hideRatingWidget() {
      this.show(this.ratingCircleEements.hintText);
      this.hide(this.ratingCircleEements.confirmationPop);
      this.hide(this.ratingCircleEements.ratingResultContainer);
      this.hide(this.ratingCircleEements.ratingTrack);
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
