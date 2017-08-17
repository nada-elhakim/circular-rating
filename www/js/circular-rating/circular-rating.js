(function () {
  circularRating.$inject = [];
  function circularRating() {
    var context, holdCounter;
    /**
     * Angular directive link function
     * @param scope
     * @param elem
     * @param attrs
     */
    function link(scope, elem) {
      new CircularRatingClass(elem, scope);
    }

    function CircularRatingClass(elem, scope) {
      this.elem = elem;
      this.ratingTimer = 0;
      this.animation = 0;
      this.ratingCircleEements = {};
      this.holdDuration = 0;
      this.totalTrackPathLength = this.currentrackPathLength = 0;
      this.trackOffset = 0;
      this.trackDashArray = 0;
      this.scope = scope;
      this.headCoord = {};
      //console.log(scope);
      this.trackOffsetAnimation = null;
      // To be added later from scope
      this.options = {
        min: 1,
        max: 10,
        interval: 150,
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
    CircularRatingClass.prototype.hideConfirmationPop = hideConfirmationPop;
    CircularRatingClass.prototype.getFinalRating = getFinalRating;
    CircularRatingClass.prototype.updateText = updateText;
    CircularRatingClass.prototype.showRatingResultContainer = showRatingResultContainer;
    CircularRatingClass.prototype.prepareTrackPath = prepareTrackPath;
    CircularRatingClass.prototype.updateRatingTrack = updateRatingTrack;
    CircularRatingClass.prototype.resetTrack = resetTrack;
    CircularRatingClass.prototype.updateHead = updateHead;



    function prepareTrackPath(track) {
      this.totalTrackPathLength = this.currentrackPathLength= track.getTotalLength();
      //console.log(this.totalTrackPathLength);
      this.trackDashArray = track.style.strokeDasharray = this.totalTrackPathLength;
      this.trackOffset = track.style.strokeDashoffset = this.totalTrackPathLength;
    }

    function init() {
      context = this;
      this.ratingCircleEements =  this.getRatingElements();
      this.prepareTrackPath(this.ratingCircleEements.ratingTrack);
      this.headCoord =  {
        x: this.ratingCircleEements.control.getAttribute("cx"),
        y: this.ratingCircleEements.control.getAttribute("cy")
      };
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
        svgContainer: document.getElementById('circular-rating-track'),
        control: document.getElementById('start-button'),
        controlOuterCircle: document.getElementById('button-outer-circle'),
        transparentTrack: document.getElementById('transparent-track'),
        ratingTrack: document.getElementById('rating-track-seek'),
        ratingUpdatePop: document.getElementById('circular-rating-rate'),
        ratingTrackHead: document.getElementById('rating-track-head'),
        headCircles: document.querySelectorAll('#rating-track-head circle:first-child'),
        ratingValue: document.getElementById('rating-value'),
        ratingValueContainers: document.getElementsByClassName('rating-value'),
        confirmationPop: document.getElementById('circular-rating-confirm'),
        confirmBtn: document.getElementById('save-rating'),
        cancelBtn: document.getElementById('reset-rating'),
        hintText: document.getElementById('hint-text'),
        ratingResultContainer: document.getElementById('circular-rating-result'),

      }
    }

    /**
     * Confirm rating and reset rating to min value
     */
    function confirmRating() {
      //context.scope.ratingModel = context.startingValue;
      context.scope.ratingModel = context.startingValue;
      context.scope.$apply();
      context.startingValue = context.options.min;
      context.removeAnimationClasses();
      context.hide(context.ratingCircleEements.ratingResultContainer);
      ///context.show(context.ratingCircleEements.ratingUpdatePop);
      context.ratingCircleEements.ratingUpdatePop.classList.add('zoom-in-fade-out');
      context.show(context.ratingCircleEements.hintText);
      context.hideConfirmationPop();
      //context.ratingCircleEements.svgContainer.style.zIndex = 200000;
      //context.resetRating();
    }

    /**
     * Cancel the rating
     */
    function resetRating() {
      context.removeAnimationClasses();
      context.resetTrack();
      context.hide(context.ratingCircleEements.ratingResultContainer);
      context.show(context.ratingCircleEements.hintText);
      context.hideConfirmationPop();
    }

    function resetTrack() {
      this.startingValue = this.options.min;
      this.ratingCircleEements.ratingTrack.style.strokeDashoffset = this.totalTrackPathLength;
      this.updateHead(this.headCoord);

    }

    /**
     * Initial on hold actions
     */
    function initialOnHoldEvents() {
      this.ratingCircleEements.transparentTrack.addEventListener("animationend", onTransparentTrackDrawStrokeEnd);
      context.ratingCircleEements.controlOuterCircle.classList.remove('pulse');
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
      console.log('hold');
      context.initialOnHoldEvents();
    }

    /**
     * On transparent track animation end
     */
    function onTransparentTrackDrawStrokeEnd() {
      //context.ratingCircleEements.ratingTrack.classList.add('draw-stroke');
    }


    /**
     * Show confirmation popup
     */
    function showConfirmationPop() {
      this.show(this.ratingCircleEements.ratingResultContainer);
      this.show(this.ratingCircleEements.confirmationPop);
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
      console.log('updating');
      this.ratingTimer = setInterval(function () {
        var ratingContainers = [].slice.call(document.getElementsByClassName('rating-value')),
          percentage;
        if (context.startingValue < context.options.max) {
          context.startingValue += context.options.step;
          percentage = ((1 - context.startingValue / context.options.max));
          context.updateRatingTrack(context.ratingCircleEements.ratingTrack, percentage);
        }
        if(ratingContainers.length > 0) {
          ratingContainers.forEach(function(elem){
            context.updateText(elem, context.startingValue);
          });
        }

      }, context.options.interval);
    }


    function updateRatingTrack(track, percentage) {
      // get last offset
      var targetPathLength = this.totalTrackPathLength * percentage,
          endpoint = track.getPointAtLength(this.totalTrackPathLength * (1 - percentage));

      console.log(endpoint);
      animate();

      // cancel this animation
      function animate() {
        console.log('animate');
        context.trackOffset = targetPathLength;
        context.updateHead(endpoint);
        context.animation= setTimeout(function(){
          animate();
        },context.options.interval);
        clearTimeout(context.animation);
      }

      // console.log(this.trackOffset);
      // if (this.trackOffset < 0 ) {
      //   return;
      // }
      track.style.strokeDashoffset = this.trackOffset;
    }

    function updateHead(endpoint) {
      [].slice.call(this.ratingCircleEements.headCircles).forEach(function (circle) {
        circle.setAttribute("cx", endpoint.x);
        //circle.style.transform = "translate(" + endpoint.x + "px," + endpoint.y + "px)";
        circle.setAttribute("cy", endpoint.y);
      });

    }

    /**
     * On release event callback
     * @param e
     */
    function onRelease(e) {
      //context.hide(context.ratingCircleEements.transparentTrack);
      // Cancel time interval on button release
      if (context.animation) {
        clearTimeout(context.animation);
      }

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
      //this.ratingCircleEements.ratingTrack.classList.remove('draw-stroke');
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
    function hideConfirmationPop() {
      this.hide(this.ratingCircleEements.confirmationPop);
      //this.hide(this.ratingCircleEements.ratingResultContainer);
      //this.hide(this.ratingCircleEements.ratingTrack);
    }

    function resizeCircle(circle, percentage) {
      circle.setAttribute("r", parseInt(circle.getAttribue("r")) * percentage);
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
        options: '=options',
        ratingModel:'=ratingModel'
      },
      link: link
    }
  }
  angular.module('circular-rating', []).
    directive('circularRating', circularRating);

}());
