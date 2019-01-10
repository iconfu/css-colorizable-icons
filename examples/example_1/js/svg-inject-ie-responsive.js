SVGInject.setOptions({
  beforeInject: function (img, svg) {
    if (/Trident|MSIE/.test(window.navigator.userAgent)) {
      // responsive SVGs (width: 100%; height: auto;) are not correctly positioned in Internet Explorer.
      // Solve this issue by wrapping the SVG in a div. The SVG is prepended by a canvas element to the SVG.
      var viewBoxVals = (svg.getAttribute('viewBox') || '').split(/[\s,]+/);
      var width = parseInt(viewBoxVals[2]);
      var height = parseInt(viewBoxVals[3]);
      if (width > 0 && height > 0) {
        // Create canvas using aspect ratio from viewBox
        var canvas = document.createElement('canvas');
        // Use Euclidean algorithm to find the greatest common divisor of width and height in
        // order to create the smallest canvas possible with the SVG's width/height ratio.
        var whGcd = function gcd(a, b) { return b ? gcd(b, a % b) : a; }(width, height);
        canvas.height = height / whGcd;
        canvas.width = width / whGcd;
        canvas.setAttribute('style', 'display:block; width:100%; height:auto; visibility:hidden;');
        // Adjust style of SVG and its parent to make SVG fill the space reserved by canvas
        // Also set overflow: hidden to work around another layout bug in IE 11.
        var svgStyle = svg.style;
        svgStyle.position = 'absolute';
        svgStyle.top = 0;
        svgStyle.overflow = 'hidden';
        var parentNode = img.parentNode;
        parentNode.style.position = 'relative';
        // Add canvas before img element
        parentNode.insertBefore(canvas, img);
      }
    }
  }
});