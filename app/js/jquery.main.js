// page init
jQuery(function(){
  initSameHeight(); // set same box height
  $.modal.defaults = {
    overlay: "#000",        // Overlay color
    opacity: 0.75,          // Overlay opacity
    zIndex: 1,              // Overlay z-index.
    escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
    clickClose: true,       // Allows the user to close the modal by clicking the overlay
    closeText: 'Close',     // Text content for the close <a> tag.
    showClose: false,        // Shows a (X) icon/link in the top-right corner
    modalClass: "lightbox",    // CSS class added to the element being displayed in the modal.
    spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
    showSpinner: true       // Enable/disable the default spinner during AJAX requests.
  };
});


// set same box height
function initSameHeight(){
  jQuery('.cluster-content').sameHeight({
    elements: 'a.box',
    flexible: true,
    multiLine: true
  });
}

/*
 * jQuery SameHeight plugin
 */
;(function($){
  $.fn.sameHeight = function(opt) {
    var options = $.extend({
      skipClass: 'same-height-ignore',
      leftEdgeClass: 'same-height-left',
      rightEdgeClass: 'same-height-right',
      elements: '>*',
      flexible: false,
      multiLine: false,
      useMinHeight: false
    },opt);
    return this.each(function(){
      var holder = $(this);
      var elements = holder.find(options.elements).not('.' + options.skipClass);
      if(!elements.length) return;

      // resize handler
      function doResize() {
        elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
        if(options.multiLine) {
          // resize elements row by row
          resizeElementsByRows(elements, options);
        } else {
          // resize elements by holder
          resizeElements(elements, holder, options);
        }
      }
      doResize();

      // handle flexible layout / font resize
      if(options.flexible) {
        $(window).bind('resize orientationchange fontresize', function(e){
          doResize();
          setTimeout(doResize, 100);
        });
      }
      // handle complete page load including images and fonts
      $(window).bind('load', function(){
        doResize();
        setTimeout(doResize, 100);
      });
    });
  }

  // detect css min-height support
  var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

  // get elements by rows
  function resizeElementsByRows(boxes, options) {
    var currentRow = $(), maxHeight, firstOffset = boxes.eq(0).offset().top;
    boxes.each(function(ind){
      var curItem = $(this);
      if(curItem.offset().top === firstOffset) {
        currentRow = currentRow.add(this);
      } else {
        maxHeight = getMaxHeight(currentRow);
        resizeElements(currentRow, maxHeight, options);
        currentRow = curItem;
        firstOffset = curItem.offset().top;
      }
    });
    if(currentRow.length) {
      maxHeight = getMaxHeight(currentRow);
      resizeElements(currentRow, maxHeight, options);
    }
  }

  // calculate max element height
  function getMaxHeight(boxes) {
    var maxHeight = 0;
    boxes.each(function(){
      maxHeight = Math.max(maxHeight, $(this).outerHeight());
    });
    return maxHeight;
  }

  // resize helper function
  function resizeElements(boxes, parent, options) {
    var parentHeight = typeof parent === 'number' ? parent : parent.height();
    boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function(i){
      var element = $(this);
      var depthDiffHeight = 0;

      if(typeof parent !== 'number') {
        element.parents().each(function(){
          var tmpParent = $(this);
          if(this === parent[0]) {
            return false;
          } else {
            depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
          }
        });
      }
      var calcHeight = parentHeight - depthDiffHeight - (element.outerHeight() - element.height());
      if(calcHeight > 0) {
        element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
      }
    });
    boxes.filter(':first').addClass(options.leftEdgeClass);
    boxes.filter(':last').addClass(options.rightEdgeClass);
  }
}(jQuery));
