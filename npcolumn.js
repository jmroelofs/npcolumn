/*

  Script:   npColumn (Newspaper Columns)
  Version:  2.5, jQuery plugin version
  Authors:  Jan Martin Roelofs (www.roelofs-coaching.nl)
  Desc:     Divides sub-elements evenly over two newspaper columns
  Uses:     npcolumn.css
            1by1.gif
  Licence:  This work is licensed under the Creative Commons Attribution 4.0 International License.
            To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
            or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

*/

(function($){

  $.fn.npColumn = function(options){

    var settings = $.extend({
      // overridable default minWidth
      minWidth: 600,
      // resize delay
      delay: 25,
      // resize backlash, against repeatedly firing in IE6, caused by inaccurate sizing in IE6
      backlash: 0.015,
      // factor weighing left-hand leftover space over right-hand leftover space
      weighFactor: 1.2,
      // is your content resizeable
      resizable: true,
      // adjust the margins, you might have to set this to false if you use the document.ready event
      adjustMargins: true
    }, options);

    arrange(this);

    var toBeDivided = this;
    if (settings.resizable){
      var resizeTimeout;
      $(window).resize(function(){
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function(){arrange(toBeDivided)}, settings.delay);
      })
    }

    return this;

    function arrange(argument){
      // we'll generate newspaper columns with evenly divided paragraphs
      // if you want a vertical divider the element needs to have class 'withdivider'

      argument.each(function(){with (this){

        // we only use columns if we have enough space
        if ((offsetWidth > settings.minWidth * (1 + settings.backlash)) &&
            children[0] && !(children[0].className == 'npcolumnsinner')){

          // make new structure
          var innerDiv       = document.createElement('div'),
              leftDiv        = document.createElement('div'),
              leftInnerDiv   = document.createElement('div'),
              rightDiv       = document.createElement('div'),
              rightInnerDiv  = document.createElement('div');

          innerDiv.className = 'npcolumnsinner';
           leftDiv.className = 'npleftcolumn';
          rightDiv.className = 'nprightcolumn';

          // fill left column and put all in place
          for (var i= children.length; i > 0; i--)
            leftInnerDiv.appendChild(children[0]);
          innerDiv.appendChild( leftDiv).appendChild( leftInnerDiv);
          innerDiv.appendChild(rightDiv).appendChild(rightInnerDiv);
          appendChild(innerDiv);

          if (settings.adjustMargins){
            // some adjustments to get the margins right in strict mode
            leftInnerDiv.style.marginTop    = (-leftInnerDiv.offsetTop) + 'px';
            leftInnerDiv.style.marginBottom = ( leftInnerDiv.offsetHeight - leftDiv.offsetHeight) + 'px';
          }

          // lets divide the stuff
          // first child always goes in left column, last child goes in right column
          // we try to divide close to the middle whilst preferring the left column, using a factor of 1.2
          var sliceIndex = 1;
          while ((sliceIndex + 1 < leftInnerDiv.children.length) &&
              (Math.abs((offsetHeight/2) - leftInnerDiv.children[sliceIndex  ].offsetTop) * settings.weighFactor >
               Math.abs((offsetHeight/2) - leftInnerDiv.children[sliceIndex+1].offsetTop)))
            sliceIndex++;

          // all children after the slice index are put in the right column
          for (var i= leftInnerDiv.children.length; i > sliceIndex; i--)
            rightInnerDiv.appendChild(leftInnerDiv.children[sliceIndex]);

          if (settings.adjustMargins){
            // some adjustments to get the margins right in strict mode
            rightInnerDiv.style.marginTop    = (-rightInnerDiv.offsetTop) + 'px';
            rightInnerDiv.style.marginBottom = ( rightInnerDiv.offsetHeight - rightDiv.offsetHeight) + 'px';
            // sometimes we need one adjustment more
            innerDiv.style.marginBottom = (innerDiv.offsetHeight - offsetHeight) + 'px';
          }
        }

        // we undo the columns if we have little space
        else if ((offsetWidth < settings.minWidth * (1 - settings.backlash)) &&
            children[0] && children[0].className == 'npcolumnsinner'){
          var  leftContainer= children[0].children[0].children[0],
              rightContainer= children[0].children[1].children[0]
          for (var i=  leftContainer.children.length; i > 0; i--)
            appendChild( leftContainer.children[0]);
          for (var i= rightContainer.children.length; i > 0; i--)
            appendChild(rightContainer.children[0]);
          removeChild(children[0]);
        }
      }})
    }
  }

})(jQuery);
