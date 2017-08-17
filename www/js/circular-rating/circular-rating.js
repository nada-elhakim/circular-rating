(function () {
  circularRating.$inject = [];
  function circularRating() {
    var context;
    /**
     * Angular directive link function
     * @param scope
     * @param elem
     * @param attrs
     */
    function link(scope, elem) {
      new CircularRatingClass(elem, scope.options);
    }

    function CircularRatingClass(options, elem) {
      this.elem = elem;
      this.ratingTimer = 0;
      this.ratingCircleEements = {};
      this.holdDuration = 0;
      this.totalTrackPathLength = 0;
      this.trackOffset = 0;
      this.trackDashArray = 0;
      // To be added later from scope
      this.options = {
        min: 1,
        max: 10,
        interval: 100,
        step: 1,
      };
      this.startingValue = this.options.min;
      // if(options){
      //   this.options = options;
      // }
      this.init();
    }

    CircularRatingClass.prototype.init = init;
    CircularRatingClass.prototype.getRatingElements = getRatingElements;
    CircularRatingClass.prototype.initialOnHoldEvents = initialOnHoldEvents;
    CircularRatingClass.prototype.updateRating = updateRating;
    CircularRatingClass.prototype.hide = hide;
    CircularRatingClass.prototype.show = show;
    CircularRatingClass.prototype.removeAnimationClasses = removeAnimationClasses;
    CircularRatingClass.prototype.addAnimationClasses = addAnimationClasses;
    CircularRatingClass.prototype.showConfirmationPop = showConfirmationPop;
    CircularRatingClass.prototype.confirmRating = confirmRating;
    CircularRatingClass.prototype.resetRating = resetRating;
    CircularRatingClass.prototype.hideRatingWidget = hideRatingWidget;
    CircularRatingClass.prototype.getFinalRating = getFinalRating;
    CircularRatingClass.prototype.updateText = updateText;
    CircularRatingClass.prototype.showRatingResultContainer = showRatingResultContainer;
    CircularRatingClass.prototype.prepareTrackPath = prepareTrackPath;
    CircularRatingClass.prototype.updateRatingTrack = updateRatingTrack;



    function prepareTrackPath(track) {
      console.log('prepared');
      this.totalTrackPathLength = track.getTotalLength();
      console.log(this.totalTrackPathLength);
      this.trackDashArray = track.style.strokeDasharray = this.totalTrackPathLength;
      this.trackOffset = track.style.strokeDashoffset = this.totalTrackPathLength;
    }

    function init() {
      context = this;
      this.ratingCircleEements =  this.getRatingElements();
      this.prepareTrackPath(this.ratingCircleEements.ratingTrack);
      // ionic.onGesture('touch', function(){
      //   context.ratingCircleEements.transparentTrack.classList.add('draw-stroke');
      // }, this.ratingCircleEements.control, {});
      ionic.onGesture('hold', onHold, this.ratingCircleEements.control, {});
      ionic.onGesture('release', onRelease, context.ratingCircleEements.control, {});
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
        ratingUpdatePop: document.getElementById('circular-rating-rate'),
        ratingValue: document.getElementById('rating-value'),
        ratingValueContainers: document.getElementsByClassName('rating-value'),
        confirmationPop: document.getElementById('circular-rating-confirm'),
        confirmBtn: document.getElementById('save-rating'),
        cancelBtn: document.getElementById('reset-rating'),
        hintText: document.getElementById('hint-text'),
        ratingResultContainer: document.getElementById('circular-rating-result')
      }
    }

    /**
     * Confirm rating and reset rating to min value
     */
    function confirmRating() {
      context.startingValue = context.options.min;


      context.show(context.ratingCircleEements.ratingResultContainer);
      //context.show(context.ratingCircleEements.ratingUpdatePop);
      context.show(context.ratingCircleEements.hintText);
      //context.ratingCircleEements.ratingUpdatePop.classList.add('zoom-in-fade-out');
      context.hide(context.ratingCircleEements.confirmationPop);

      context.ratingCircleEements.ratingUpdatePop.addEventListener('animationend', function () {
        console.log('rating popup');

        // context.ratingCircleEements.ratingUpdatePop.classList.remove('zoom-in-fade-out');
        // context.hide(context.ratingCircleEements.ratingUpdatePop);
        //context.hide(context.ratingCircleEements.ratingUpdatePop);

        //context.hide(context.ratingCircleEements.ratingResultContainer);
        //context.hideRatingWidget();
      });
    }

    /**
     * Cancel the rating
     */
    function resetRating() {
      context.startingValue = context.options.min;
      context.removeAnimationClasses();
      context.hide(context.ratingCircleEements.ratingResultContainer);
      context.show(context.ratingCircleEements.hintText);
      context.hideRatingWidget();
    }


    /**
     * Initial on hold actions
     */
    function initialOnHoldEvents() {
      this.ratingCircleEements.transparentTrack.addEventListener("animationend", onTransparentTrackDrawStrokeEnd);
      context.showRatingResultContainer();
      context.updateRating();
    }

    function showRatingResultContainer() {
      this.show(this.ratingCircleEements.ratingResultContainer);
      this.show(this.ratingCircleEements.ratingUpdatePop);
      this.ratingCircleEements.ratingValue.innerText = this.startingValue;
      this.ratingCircleEements.ratingUpdatePop.classList.add('fade-in');
      this.ratingCircleEements.hintText.style.opacity = 0;
    }

    /**
     * On hold event callback
     * @param e
     */
    function onHold(e) {
      context.initialOnHoldEvents();
    }

    /**
     * On transparent track animation end
     */
    function onTransparentTrackDrawStrokeEnd() {
      context.ratingCircleEements.ratingTrack.classList.add('draw-stroke');
    }


    /**
     * Show confirmation popup
     */
    function showConfirmationPop() {
      //console.log(this.ratingCircleEements.confirmationPop);
      //this.hide(this.ratingCircleEements.transparentTrack);
      this.show(this.ratingCircleEements.confirmationPop);
      this.show(this.ratingCircleEements.ratingResultContainer);
      this.show(this.ratingCircleEements.ratingTrack);
      this.ratingCircleEements.confirmationPop.classList.add('zoom-in');
      this.ratingCircleEements.confirmationPop.addEventListener("animationend", onShowConfirmation);
    }

    /**
     * On rating confirmation
     */
    function onShowConfirmation() {
      context.ratingCircleEements.cancelBtn.classList.add('slide-up');
      context.ratingCircleEements.cancelBtn.addEventListener("animationend", function(){
        context.ratingCircleEements.confirmBtn.classList.add('slide-up');
      });
    }

    /**
     * Update rating value
     */
    function updateRating() {
      this.ratingTimer = setInterval(function () {
        var ratingContainers = [].slice.call(document.getElementsByClassName('rating-value')),
          percentage;
        if (context.startingValue < context.options.max) {
          context.startingValue += context.options.step;
          percentage = (1 - context.startingValue / context.options.max);
        }
        if(ratingContainers.length > 0) {
          ratingContainers.forEach(function(elem){
            context.updateText(elem, context.startingValue);
            context.updateRatingTrack(context.ratingCircleEements.ratingTrack, percentage);
          });
        }

      }, context.options.interval);
    }


    function updateRatingTrack(track, percentage) {
      track.animate({
        strokeDashoffset: [this.totalTrackPathLength, this.totalTrackPathLength * percentage]
      }, {
        duration: 100,
        fill: 'forwards'
      });
      //track.style.strokeDashoffset = this.totalTrackPathLength * percentage;
    }

    /**
     * On release event callback
     * @param e
     */
    function onRelease(e) {
      //context.hide(context.ratingCircleEements.transparentTrack);
      // Cancel time interval on button release
      if (context.ratingTimer) {
        clearInterval(context.ratingTimer);
        // pass value to scope here
      }
      context.showConfirmationPop();
    }

    function addAnimationClasses() {

    }

    /**
     * Remove css animation classes
     */
    function removeAnimationClasses() {
      this.ratingCircleEements.ratingTrack.classList.remove('draw-stroke');
      this.ratingCircleEements.confirmationPop.classList.remove('zoom-in');
    }

    /**
     * Hide element
     * @param elem
     */
    function hide(elem) {
      elem.style.display = 'none';
    }

    /**
     * Show element
     * @param elem
     */
    function show(elem) {
      elem.style.display = 'block';
      elem.style.opacity = 1;
    }


    /**
     * Hide the rating widget
     */
    function hideRatingWidget() {
      this.hide(this.ratingCircleEements.confirmationPop);
      //this.hide(this.ratingCircleEements.ratingResultContainer);
      this.hide(this.ratingCircleEements.ratingTrack);
    }


    /**
     * Update element inner text
     * @param elem
     * @param text
     */
    function updateText(elem, text) {
      elem.innerText= text;
    }

    /**
     * Get the final rating
     */
    function getFinalRating() {
      this.show(this.ratingCircleEements.ratingResultContainer);
      this.show(this.ratingCircleEements.ratingUpdatePop);
      this.ratingCircleEements.ratingUpdatePop.addEventListener("animationend", function(){
        context.hide(context.ratingCircleEements.ratingResultContainer);
      });
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

}());
