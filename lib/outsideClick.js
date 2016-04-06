var IGNORE_CLASS = 'ignore-react-onclickoutside';

var isSourceFound = function(source, localNode) {
  if (source === localNode) {
    return true;
  }
  // SVG <use/> elements do not technically reside in the rendered DOM, so
  // they do not have classList directly, but they offer a link to their
  // corresponding element, which can have classList. This extra check is for
  // that case.
  // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
  // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
  if (source.correspondingElement) {
    return source.correspondingElement.classList.contains(IGNORE_CLASS);
  }
  return source.classList.contains(IGNORE_CLASS);
};

const enableOnClickOutside = function(localNode, eventHandler){
	var fn = (function(localNode, eventHandler) {
    return function(evt) {
      evt.stopPropagation();
      var source = evt.target;
      var found = false;
      // If source=local then this event came from "somewhere"
      // inside and should be ignored. We could handle this with
      // a layered approach, too, but that requires going back to
      // thinking in terms of Dom node nesting, running counter
      // to React's "you shouldn't care about the DOM" philosophy.
      while(source.parentNode) {
        found = isSourceFound(source, localNode);
        if(found) return;
        source = source.parentNode;
      }
      // If element is in detached DOM, consider it not clicked
      // outside as it can't be known whether it was outside.
      if(source !== document) return;
      eventHandler(evt);
    }
  }(localNode, eventHandler));

	if (document != null) {
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
  }
  return fn
}

const disableOnClickOutside = function(fn){
  if (document != null) {
    document.removeEventListener("mousedown", fn);
    document.removeEventListener("touchstart", fn);
  }	
}

export {enableOnClickOutside, disableOnClickOutside}