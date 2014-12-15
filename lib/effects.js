module.exports = {
  cube: function(width, height, getBoxClone, duration, callback) {
    var box_clone, box_clones, col, col_t, delay_time, division_h, division_w, easing, height_box, i, init_left, init_top, onEnd, time_animate, total, width_box, _bleft, _btop, _i, _ref, _ref1, _vleft, _vleft_image, _vtop, _vtop_image;
    easing = 'easeOutQuad';
    time_animate = 700;
    division_w = Math.ceil(width / (width / 4));
    division_h = Math.ceil(height / (height / 4));
    total = division_w * division_h;
    width_box = Math.ceil(width / division_w);
    height_box = Math.ceil(height / division_h);
    init_top = height + 200;
    init_left = height + 200;
    col_t = 0;
    col = 0;
    box_clones = [];
    for (i = _i = 0; 0 <= total ? _i < total : _i > total; i = 0 <= total ? ++_i : --_i) {
      init_top = (_ref = i % 2 === 0) != null ? _ref : {
        init_top: -init_top
      };
      init_left = (_ref1 = i % 2 === 0) != null ? _ref1 : {
        init_left: -init_left
      };
      _vtop = init_top + (height_box * col_t) + (col_t * 150);
      _vleft = -width;
      _vtop_image = -(height_box * col_t);
      _vleft_image = -(width_box * col);
      _btop = height_box * col_t;
      _bleft = width_box * col;
      delay_time = 50 * i;
      time_animate = 500;
      onEnd = i === (total - 1) ? callback : null;
      box_clone = getBoxClone({
        outerStyle: {
          width: width_box,
          height: height_box,
          top: {
            tweeningValue: 'top'
          },
          left: {
            tweeningValue: 'left'
          },
          opacity: {
            tweeningValue: 'opacity'
          }
        },
        innerStyle: {
          top: _vtop_image,
          left: _vleft_image
        },
        tweenings: {
          top: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: height + (height_box * i),
            endValue: _btop
          },
          left: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: width + (width_box * i),
            endValue: _bleft
          },
          opacity: {
            delay: delay_time + (time_animate / 2),
            duration: 400,
            beginValue: 0,
            endValue: 1,
            onEnd: onEnd
          }
        }
      });
      box_clones.push(box_clone);
      col_t++;
      if (col_t === division_h) {
        col_t = 0;
        col++;
      }
    }
    return box_clones;
  },
  cubeShow: function(width, height, getBoxClone, duration, callback) {
    var box_clone, box_clones, col, delay_time, division_h, division_w, easing, height_box, i, line, onEnd, step_delay, time_animate, total, total_delay, width_box, _bleft, _btop, _i;
    easing = 'easeOutQuad';
    division_w = Math.ceil(width / (width / 4));
    division_h = Math.ceil(height / (height / 4));
    total = division_w * division_h;
    step_delay = 30;
    total_delay = (total - 1) * step_delay;
    time_animate = duration - total_delay;
    width_box = Math.ceil(width / division_w);
    height_box = Math.ceil(height / division_h);
    _btop = 0;
    _bleft = 0;
    line = 0;
    col = 0;
    box_clones = [];
    for (i = _i = 0; 0 <= total ? _i < total : _i > total; i = 0 <= total ? ++_i : --_i) {
      _btop = height_box * line;
      _bleft = width_box * col;
      delay_time = step_delay * i;
      onEnd = i === (total - 1) ? callback : null;
      box_clone = getBoxClone({
        outerStyle: {
          left: _bleft,
          top: _btop,
          width: {
            tweeningValue: 'width'
          },
          height: {
            tweeningValue: 'height'
          }
        },
        innerStyle: {
          left: -_bleft,
          top: -_btop
        },
        tweenings: {
          width: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: 0,
            endValue: width_box
          },
          height: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: 0,
            endValue: height_box,
            onEnd: onEnd
          }
        }
      });
      box_clones.push(box_clone);
      line++;
      if (line === division_h) {
        line = 0;
        col++;
      }
    }
    return box_clones;
  }
};
