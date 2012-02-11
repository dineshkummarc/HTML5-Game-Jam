/*global $N:true */
// code from http://depts.washington.edu/aimgroup/proj/dollar/ndollar.html
// + modifications (remove event binding, canvas drawing, no globals)
var Gesture = (function(){
    // global variables
    var _result_callback, _isDown, _points, _strokes, _r, _g, _rc = {
        // viewport
        x : 0, 
        y : 0, 
        width  : window.innerWidth, 
        height : window.innerHeight
    };
    
    function init(callback){
        _result_callback = callback;
        _points = []; // point array for current stroke
        _strokes = []; // array of point arrays
        _r = new $N.NDollarRecognizer(false);

        _isDown = false;
    }
    
    //
    // Mouse Events
    //
    function mouseDownEvent(x, y, button)
    {
        if (button <= 1)
        {
            x -= _rc.x;
            y -= _rc.y;
            if (_points.length == 0)
            {
                _strokes.length = 0;
            }
            _points.length = 1; // clear
            _points[0] = new $N.Point(x, y);
            _isDown = true;
        }
        else if (button == 2)
        {
        }
    }
    function mouseMoveEvent(x, y, button)
    {
        if (_isDown)
        {
            x -= _rc.x;
            y -= _rc.y;
            _points.push(new $N.Point(x, y));
        }
    }
    function mouseUpEvent(x, y, button)
    {
        if (button <= 1)
        {
            if (_isDown)
            {
                _isDown = false;
                _strokes.push( _points.slice()); // add new copy to set
            }
        }
        else if (button == 2) // segmentation with right-click
        {
            if (_strokes.length > 1 || (_strokes.length == 1 && _strokes[0].length >= 10))
            {
                var result = _r.Recognize(_strokes, false, false, false);
                _result_callback(result);
            }
            else {
                // no strokes
            }
            _points.length = 0; // clear and signal to clear strokes on next mousedown
        }
    }
    function rand(low, high)
    {
        return Math.floor((high - low + 1) * Math.random()) + low;
    }
    function round(n, d) // round 'n' to 'd' decimals
    {
        d = Math.pow(10, d);
        return Math.round(n * d) / d;
    }

    return {
        init : init,
        mouseDownEvent : mouseDownEvent,
        mouseMoveEvent : mouseMoveEvent,
        mouseUpEvent   : mouseUpEvent
    };
}());
