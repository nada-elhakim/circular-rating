(function () {
  circularRating.$inject = ['$ionicGesture'];
  function circularRating($ionicGesture) {
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
      this.beginRating = false;
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
        min: scope.min || 1,
        max: scope.max || 10,
        interval: scope.interval || 500,
        step: scope.step || 1,
        holdTimeout: scope.holdTimeout || 500
      };

      this.startingValue = this.options.min;
      // if(options){
      //   this.options = options;
      // }
      this.init();
    }

    CircularRatingClass.prototype.init = init;
    CircularRatingClass.prototype.defineGestures = defineGestures;
    CircularRatingClass.prototype.getRatingElements = getRatingElements;
    CircularRatingClass.prototype.initialOnHoldEvents = initialOnHoldEvents;
    CircularRatingClass.prototype.updateRating = updateRating;
    CircularRatingClass.prototype.hide = hide;
    CircularRatingClass.prototype.show = show;
    CircularRatingClass.prototype.removeAnimationClasses = removeAnimationClasses;
    CircularRatingClass.prototype.addAnimationClasses = addAnimationClasses;
    CircularRatingClass.prototype.showConfirmationPop = showConfirmationPop;
    CircularRatingClass.prototype.confirmRating = confirmRating;
    CircularRatingClass.prototype.cancelRating = cancelRating;
    CircularRatingClass.prototype.hideConfirmationPop = hideConfirmationPop;
    CircularRatingClass.prototype.getFinalRating = getFinalRating;
    CircularRatingClass.prototype.updateText = updateText;
    CircularRatingClass.prototype.showRatingResultContainer = showRatingResultContainer;
    CircularRatingClass.prototype.prepareTrackPath = prepareTrackPath;
    CircularRatingClass.prototype.updateRatingTrack = updateRatingTrack;
    CircularRatingClass.prototype.resetTrack = resetTrack;
    CircularRatingClass.prototype.updateHead = updateHead;
    CircularRatingClass.prototype.resetWidget = resetWidget;
    CircularRatingClass.prototype.updateRatingText = updateRatingText;
    CircularRatingClass.prototype.getFullRating = getFullRating;



    function prepareTrackPath(track) {
      this.totalTrackPathLength = this.currentrackPathLength= track.getTotalLength();
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
      this.scope.ratingModel = this.options.min;
      // Define Gestures
      this.defineGestures();
    }

    function defineGestures() {
      this.holdGesture = $ionicGesture.on('hold', onHold, angular.element(this.ratingCircleEements.control), {hold_timeout: this.options.holdTimeout});
      this.doubleTap = $ionicGesture.on('doubletap', onDoubleTap, angular.element(this.ratingCircleEements.control));
      this.tap = $ionicGesture.on('tap', onDoubleTap, angular.element(this.ratingCircleEements.control));
      $ionicGesture.on('click', confirmRating, angular.element(this.ratingCircleEements.confirmBtn));
      $ionicGesture.on('click', cancelRating, angular.element(this.ratingCircleEements.cancelBtn));
      //$ionicGesture.off(this.tap, 'tap', function(){});
      this.release = $ionicGesture.on('release', onRelease, angular.element(context.ratingCircleEements.control));
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
        ratingTitle:  document.getElementById('popup-rating-title'),
        ratingUpdatePop: document.getElementById('circular-rating-rate'),
        ratingTrackHead: document.getElementById('rating-track-head'),
        headCircles: document.querySelectorAll('#rating-track-head circle'),
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
      context.show(context.ratingCircleEements.ratingUpdatePop);
      context.scope.ratingModel = context.startingValue;
      context.scope.$apply();
      context.startingValue = context.options.min;
      context.removeAnimationClasses();
      context.hide(context.ratingCircleEements.ratingResultContainer);
      context.ratingCircleEements.ratingUpdatePop.classList.add('zoom-in-fade-out');
      context.show(context.ratingCircleEements.hintText);
      context.ratingCircleEements.ratingTitle.style.opacity = 0;
      context.resetWidget();
      context.ratingCircleEements.ratingUpdatePop.addEventListener("animationend", function () {
        context.hide(context.ratingCircleEements.ratingUpdatePop);
        context.ratingCircleEements.ratingUpdatePop.classList.remove('zoom-in-fade-out');
      });

    }

    function resetWidget() {
      context.hideConfirmationPop();
      context.removeAnimationClasses();
      context.resetTrack();
      context.show(context.ratingCircleEements.hintText);
      context.hide(context.ratingCircleEements.ratingResultContainer);
      context.ratingCircleEements.controlOuterCircle.classList.add('pulse');
      context.ratingCircleEements.confirmBtn.classList.remove('slide-up');
      context.ratingCircleEements.cancelBtn.classList.remove('slide-up');
    }

    /**
     * Cancel the rating
     */
    function cancelRating() {
      context.scope.ratingModel = context.options.min;
      context.scope.$apply();
      context.hide(context.ratingCircleEements.ratingUpdatePop);
      context.resetWidget();
    }

    function resetTrack() {
      this.startingValue = this.options.min;
      this.ratingCircleEements.ratingTrack.style.strokeDashoffset = this.totalTrackPathLength;
      //this.updateHead(this.headCoord);

    }

    /**
     * Initial on hold actions
     */
    function initialOnHoldEvents() {
      this.ratingCircleEements.transparentTrack.classList.add('draw-stroke');
      this.ratingCircleEements.transparentTrack.addEventListener("animationend", onTransparentTrackDrawStrokeEnd);
    }

    function showRatingResultContainer() {
      this.show(this.ratingCircleEements.ratingUpdatePop);
      this.show(this.ratingCircleEements.transparentTrack);
      this.ratingCircleEements.ratingValue.innerText = this.startingValue;
    }

    /**
     * On hold event callback
     * @param e
     */
    function onHold(e) {
      context.initialOnHoldEvents();
    }

    function onDoubleTap(e) {
      context.getFullRating();
      context.showConfirmationPop();
    }

    function getFullRating() {
      context.startingValue = context.options.max;
      context.updateRatingText();
    }

    /**
     * On transparent track animation end
     */
    function onTransparentTrackDrawStrokeEnd() {
      context.showRatingResultContainer();
      context.updateRating();
      context.beginRating = true;
      context.ratingCircleEements.controlOuterCircle.classList.remove('pulse');
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

    function shrinkTrackHeads() {

    }
    /**
     * On rating confirmation
     */
    function onShowConfirmation() {
      context.ratingCircleEements.cancelBtn.classList.add('slide-up');
      context.ratingCircleEements.cancelBtn.addEventListener("animationend", function(){
        context.ratingCircleEements.confirmBtn.classList.add('slide-up');
        context.ratingCircleEements.transparentTrack.classList.remove('draw-stroke');
      });
    }

    /**
     * Update rating value
     */
    function updateRating() {
      var percentage;
      update();
      function update() {
        if (context.startingValue < context.options.max) {
          context.startingValue += context.options.step;
          percentage = ((1 - context.startingValue / context.options.max));
          context.updateRatingTrack(context.ratingCircleEements.ratingTrack, percentage);
          context.updateRatingText();
          context.ratingTimer = setTimeout(function () {
            update();
          }, context.options.interval);
        }
      }
    }

    function updateRatingText(){
      var ratingContainers = [].slice.call(document.getElementsByClassName('rating-value'));
      if(ratingContainers.length > 0) {
        ratingContainers.forEach(function(elem){
          context.updateText(elem, context.startingValue);
        });
      }
    }

    function updateRatingTrack(track, percentage) {
      // get last offset
      var targetPathLength = this.totalTrackPathLength * percentage,
          endpoint = track.getPointAtLength(this.totalTrackPathLength * (1 - percentage));
      animate();
      // cancel this animation
      function animate() {
        context.trackOffset = targetPathLength;
        //context.updateHead(endpoint);
        context.animation= setTimeout(function(){
          animate();
        },context.options.interval);
        clearTimeout(context.animation);
      }
      track.style.strokeDashoffset = this.trackOffset;
    }

    function updateHead(endpoint) {
      [].slice.call(this.ratingCircleEements.headCircles).forEach(function (circle) {
        circle.setAttribute("cx", endpoint.x);
        //circle.style.transform = "translate(" + endpoint.x + "px," + endpoint.y + "px)";
        circle.setAttribute("cy", endpoint.y);
      });

    }

    function getTrackHeadCircles() {

    }



    /**
     * On release event callback
     * @param e
     */
    function onRelease(e) {
      // Get delta time to check whether the gesture
      // was a click or a hold
      if (e.gesture.deltaTime < context.options.holdTimeout) {
        context.startingValue = context.options.max;
        context.updateRatingText()

      } else {
        // Cancel time interval on button release
        if (context.animation) {
          clearTimeout(context.animation);
        }

        if (context.ratingTimer) {
          clearTimeout(context.ratingTimer);
          // pass value to scope here
        }
        if (context.beginRating) {
          context.showConfirmationPop();
        }
      }
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
      //elem.style.opacity = 1;
    }


    /**
     * Hide the rating widget
     */
    function hideConfirmationPop() {
      this.hide(this.ratingCircleEements.confirmationPop);
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
        min: '@min',
        max: '@max',
        interval:'@interval',
        step: '@step',
        holdTimeout: '@holdTimeout',
        ratingModel:'=ratingModel'
      },
      link: link
    }
  }
  angular.module('circular-rating', []).
    directive('circularRating', circularRating);

}());
