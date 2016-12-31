/*--------------------------------------------------UXUI Module--------------------------------------------------*/

var mdUXUI = angular.module('mdUXUI', []);

/*--------------------------------------------------Styling Services--------------------------------------------------*/

mdUXUI.factory('mdStyle', ['$timeout', function($timeout) {
  
  var format = function(style) {
    angular.forEach(style, function(value, key) {
      if (value instanceof Object) {
        format(value);
      } else if ((key === 'transform') || (key === 'transition') || (key === 'text-rendering') || (key === 'font-smoothing') || (key === 'font-feature-settings') || (key === 'tap-highlight-color') || (key === 'appearance')) {
        style['-webkit-' + key] = value;
        style['-moz-' + key] = value;
        style['-o-' + key] = value;
        style['-ms-' + key] = value;
      }
    });
    return style;
  };
  
  var extend = function(base, extension) {
    return angular.merge(base, extension);
  };
  
  var misc = function(name, style) {
    var template = {
      'textLight': {'font-weight': '300'},
      'textNormal': {'font-weight': '400'},
      'textMedium': {'font-weight': '500'},
      'textBullet': {'list-style-type': 'disc'},
      'textTrim': {
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        'overflow': 'hidden'
      },
      'textLeft': {'text-align': 'left'},
      'textCenter': {'text-align': 'center'},
      'textRight': {'text-align': 'right'},
      'textTop': {'vertical-align': 'top'},
      'textMiddle': {'vertical-align': 'middle'},
      'textBottom': {'vertical-align': 'bottom'},
      'seam': {'border-bottom': '1px solid rgba(0, 0, 0, 0.12)'},
    };
    if (style) {
      return extend(style, template[name]);
    } else {
      return extend({}, template[name]);
    }
  };
  
  var pad = function(value) {
    var padding = [];
    angular.forEach(value.split(","), function(item) {
      padding.push((item === 0) ? item.toString() : item.toString() + 'px');
    });
    return {'padding': padding.join(" ")};
  };
  
  var general = function(style) {
    var template = {
      'display': 'block',
      'position': 'relative',
      'box-sizing': 'border-box',
      'overflow': 'visible',
      'border': 'none',
      'outline': 'none',
      'border-radius': '0',
      'margin': '0',
      'padding': '0',
      'background': 'rgba(0, 0, 0, 0)',
      'tap-highlight-color': 'rgba(0, 0, 0, 0)',
    };
    return extend(template, style);
  };
  
  var icon = function(style) {
    var template = {
      'font-family': 'Material Icons',
      'display': 'inline-block',
      'line-height': '1',
      'text-align': 'center',
      'white-space': 'nowrap',
      'vertical-align': 'middle',
      'color': 'rgba(0, 0, 0, 0.54)',
      'font-size': '24px',
      'text-rendering': 'optimizeLegibility',
      'font-smoothing': 'antialiased',
      'transition': 'opacity 0.2s linear 0s, color 0.2s linear 0s',
    };
    return extend(template, style);
  };
  
  var socicon = function(style) {
    var template = {
      'font-family': 'Mono Social Icons Font',
      'display': 'inline-block',
      'line-height': '1',
      'text-align': 'center',
      'white-space': 'nowrap',
      'vertical-align': 'middle',
      'color': 'rgba(0, 0, 0, 0.54)',
      'font-size': '24px',
      'text-rendering': 'optimizeLegibility',
      'font-smoothing': 'antialiased',
      'transition': 'opacity 0.2s ease-in-out 0s, color 0.2s linear 0s',
    };
    return extend(template, style);
  };
  
  var font = function(name, style) {
    //'font-family': 'inherit',
    var template = {
      'font-family': '"Roboto", sans-serif',
      'font-weight': 'normal',
      'font-style': 'normal',
      'font-variant': 'normal',
      'text-decoration': 'none',
      'text-align': 'left',
      'text-transform': 'none',
      'text-overflow': 'clip',
      'text-shadow': 'none',
      'text-indent': '0px',
      'line-height': 'normal',
      'letter-spacing': 'normal',
      'word-wrap': 'normal',
      'word-break': 'break-word',
      'word-spacing': 'normal',
      'white-space': 'normal',
      'overflow': 'visible',
      'vertical-align': 'baseline',
      'text-rendering': 'optimizeLegibility',
      'font-smoothing': 'antialiased',
      'font-feature-settings': 'liga',
      'transition': 'opacity 0.2s ease-in-out 0s, color 0.2s linear 0s',
    };
    var fonts = {
      'default': {},
      'error': {
        'color': 'rgba(255, 0, 0, 0.87)',
      },
      'disabled': {
        'color': 'rgba(0, 0, 0, 0.38)',
        'cursor': 'not-allowed',
      },
      'caption': {
        'font-size': '12px',
        'font-weight': '400',
        'line-height': '20px',
        'letter-spacing': '0.2px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'helper': {
        'font-size': '12px',
        'font-weight': '400',
        'line-height': '14px',
        'letter-spacing': '0.2px',
        'color': 'rgba(0, 0, 0, 0.38)',
      },
      'body1': {
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '20px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'link': {
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '20px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
        'text-decoration': 'underline',
        'cursor': 'pointer',
      },
      'secondary': {
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '20px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'gridtext': {
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'brief': {
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'letter-spacing': '0.1px',
        'color': 'rgba(255, 255, 255, 1)',
      },
      'body2': {
        'font-size': '14px',
        'font-weight': '500',
        'line-height': '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'menu': {
        'font-size': '14px',
        'font-weight': '500',
        'line-height': '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'button': {
        'font-size': '14px',
        'font-weight': '500',
        'line-height': '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
        'text-align': 'center',
        'text-transform': 'uppercase',
        'white-space': 'nowrap',
      },
      'subheader': {
        'font-size': '14px',
        'font-weight': '500',
        'line-height': '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'subhead': {
        'font-size': '16px',
        'font-weight': '400',
        'line-height':  '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'primary': {
        'font-size': '16px',
        'font-weight': '400',
        'line-height':  '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'input': {
        'font-size': '16px',
        'font-weight': '400',
        'line-height':  '20px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'label': {
        'font-size': '16px',
        'font-weight': '400',
        'line-height':  '20px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.38)',
      },
      'label_focused': {
        'font-size': '12px',
        'font-weight': '400',
        'line-height':  '14px',
        'letter-spacing': '0.2px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'hint': {
        'font-size': '16px',
        'font-weight': '400',
        'line-height':  '20px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.38)',
      },
      'notification': {
        'font-size': '16px',
        'font-weight': '400',
        'line-height':  '24px',
        'letter-spacing': '0.1px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'title': {
        'font-size': '20px',
        'font-weight': '500',
        'line-height':  '28px',
        'letter-spacing': '0.05px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'headline': {
        'font-size': '24px',
        'font-weight': '400',
        'line-height':  '32px',
        'letter-spacing': '0px',
        'color': 'rgba(0, 0, 0, 0.87)',
      },
      'display1': {
        'font-size': '34px',
        'font-weight': '400',
        'line-height':  '40px',
        'letter-spacing': '0px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'display2': {
        'font-size': '45px',
        'font-weight': '400',
        'line-height':  '48px',
        'letter-spacing': '0px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'display3': {
        'font-size': '56px',
        'font-weight': '400',
        'line-height':  '62px',
        'letter-spacing': '-0.05px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
      'display4': {
        'font-size': '112px',
        'font-weight': '300',
        'line-height':  '124px',
        'letter-spacing': '-0.1px',
        'color': 'rgba(0, 0, 0, 0.54)',
      },
    };
    if (style) {
      return extend(template, extend(fonts[name], style));
    }
    return extend(template, fonts[name]);
  };
  
  var modal = function(name, style) {
    var template = {
      'case': {
        'display': 'flex',
        'position': 'fixed',
        'box-sizing': 'border-box',
        'overflow': 'hidden',
        'border': 'none',
        'outline': 'none',
        'border-radius': '0',
        'margin': '0',
        'padding': '0',
        'background': 'rgba(0, 0, 0, 0)',
        'tap-highlight-color': 'rgba(0, 0, 0, 0)',
        'top': '0',
        'left': '0',
        'right': '0',
        'bottom': '0',
        'flex-direction': 'row',
        'flex-wrap': 'nowrap',
        'justify-content': 'center',
        'align-items': 'center',
        'align-content': 'center',
        'min-width': '224px',
      },
      'screen': {
        'display': 'block',
        'position': 'fixed',
        'box-sizing': 'border-box',
        'overflow': 'hidden',
        'border': 'none',
        'outline': 'none',
        'border-radius': '0',
        'margin': '0',
        'padding': '0',
        'background': 'rgba(0, 0, 0, 0.12)',
        'tap-highlight-color': 'rgba(0, 0, 0, 0)',
        'top': '0',
        'left': '0',
        'right': '0',
        'bottom': '0',
        'z-index': '100',
      },
      'sheet': {
        'display': 'block',
        'position': 'relative',
        'box-sizing': 'border-box',
        'overflow': 'hidden',
        'border': 'none',
        'outline': 'none',
        'border-radius': '0',
        'margin': '0',
        'padding': '0',
        'background': 'rgba(255, 255, 255, 1)',
        'tap-highlight-color': 'rgba(0, 0, 0, 0)',
        'z-index': '200',
      },
    };
    return extend(template[name], style);
  };
  
  var page = function(style) {
    var template = {
      'display': 'block',
      'position': 'absolute',
      'box-sizing': 'border-box',
      'overflow': 'hidden',
      'border': 'none',
      'outline': 'none',
      'border-radius': '0',
      'margin': '0',
      'padding': '0',
      'background': 'rgba(255, 255, 255, 1)',
      'tap-highlight-color': 'rgba(0, 0, 0, 0)',
      'left': '0',
      'right': '0',
      'top': '0',
      'bottom': '0',
      'z-index': '100',
      'transition': 'top 0.3s cubic-bezier(0.8, 0, 0.4, 1) 0s, bottom 0.3s cubic-bezier(0.8, 0, 0.4, 1) 0s',
    };
    return extend(template, style);
  };
  
  var collections = function(style) {
    var template = {
      'display': 'flex',
      'position': 'relative',
      'box-sizing': 'border-box',
      'overflow': 'visible',
      'border': 'none',
      'outline': 'none',
      'border-radius': '0',
      'margin': '0',
      'padding': '0',
      'background': 'rgba(0, 0, 0, 0)',
      'tap-highlight-color': 'rgba(0, 0, 0, 0)',
      'justify-content': 'center',
      'align-items': 'stretch',
      'align-content': 'flex-start',
      'flex-direction': 'column',
      'flex-wrap': 'nowrap',
    };
    return extend(template, style);
  };
  
  var ripple = function(scope, element, attrs, theme) {
    var timer_delay;
    var s = {
      'position': 'absolute',
      'background': 'rgba(0, 0, 0, 0.08)',
      'border-radius': '50%',
      'top': '0px',
      'left': '0px',
      'height': '48px',
      'width': '48px',
      'transform': 'scale(0, 0)',
      'opacity': '0',
    };
    var surface = angular.element('<div></div>');
    surface.css(general(s));
    element.append(surface);
    theme = theme || 'icon-dark';
    if (theme === 'tracking-dark') {
      surface.css({'background': 'rgba(0, 0, 0, 0.16)'});
    } else if ((theme === 'tracking-light') || (theme === 'icon-light')) {
      surface.css({'background': 'rgba(255, 255, 255, 0.20)'});
    }
    var resetAnimation = function() {
      var s = {
        'transition': 'all 0s ease 0s',
        'transform': 'scale(0, 0)',
        'opacity': '0',
      };
      surface.css(s);
    };
    var position = function(event) {
      var parent_width = element[0].clientWidth;
      var parent_height = element[0].clientHeight;
      var element_position = element[0].getBoundingClientRect();
      var parent_diagonal = 2 * (Math.round(Math.sqrt((parent_width * parent_width) + (parent_height * parent_height))));
      if (parent_diagonal > 2000) {
        parent_diagonal = 2000;
      }
      var margin = -(parent_diagonal/2);
      var s = {
        'top': (event.clientY - element_position.top).toString(),
        'left': (event.clientX - element_position.left).toString(),
        'height': parent_diagonal.toString(),
        'width': parent_diagonal.toString(),
        'margin-top': margin.toString(),
        'margin-left': margin.toString(),
      };
      surface.css(s);
    };
    var animate = function(opacityInterval, scaleInterval) {
      var OI = (opacityInterval / 1000).toString();
      var SI = (scaleInterval / 1000).toString();
      var s = {
        'transition': 'opacity ' + OI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                              -webkit-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                              -moz-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                              -o-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                              -ms-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                              transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s',
        'transform': 'scale(1, 1)',
        'opacity': '1',
      };
      surface.css(s);
      $timeout(function() {surface.css({'opacity': '0'});}, opacityInterval);
      timer_delay = $timeout(function() {resetAnimation();}, scaleInterval);
    };
    element.on('mousedown', function(event) {
      $timeout.cancel(timer_delay);
      resetAnimation();
      if ((theme === 'tracking-dark') || (theme === 'tracking-light')) {
        position(event);
        animate(300, 600);
      } else {
        animate(200, 400);
      }
    });
  };
  
  var calculateContainer = function (containerWidth, minItemWidth) {
    var itemCount = 1;
    while (true) {
      itemWidth = containerWidth / itemCount;
      if (itemWidth < minItemWidth) {
        if (itemCount > 1) {
          itemCount = itemCount - 1;
        }
        itemWidth = containerWidth / itemCount;
        var item = {
          'itemCount': itemCount,
          'itemWidth': Math.floor(itemWidth),
          'sidePadding': Math.floor((containerWidth % (Math.floor(itemWidth) * itemCount)) / 2),
        };
        return item;
      } else {
        itemCount = itemCount + 1;
      }
    }
  };
  
  return {
    'format': format,
    'misc': misc,
    'pad': pad,
    'general': general,
    'icon': icon,
    'socicon': socicon,
    'font': font,
    'modal': modal,
    'page': page,
    'collections': collections,
    'ripple': ripple,
    'calculateContainer': calculateContainer,
  };
}]);

/*--------------------------------------------------Styling Directives--------------------------------------------------*/

mdUXUI.directive('mdContent', ['$timeout', 'mdStyle', function($timeout, mdStyle) {
  return {
    template: `{{content}}`,
    scope: {},
    link: function(scope, element, attrs) {
      attrs.$observe('mdContent', function(value) {
        if (scope.content !== value) {
          element.css({'opacity': '0'});
          $timeout(function() {scope.content = value; element.css({'opacity': '1'});}, 200);
        }
      });
    }
  };
}]);

mdUXUI.directive('mdError', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdError', function(value) {
        if (scope.$eval(value)) {
          if (!attrs.elementOriginalColor) {
            attrs.$set('elementOriginalColor', element.css('color'));
          }
          var elementOriginalBorderBottomColor = element.css('border-bottom-color');
          if (elementOriginalBorderBottomColor) {
            attrs.$set('elementOriginalBorderBottomColor', elementOriginalBorderBottomColor);
            element.css({'border-bottom-color': 'rgba(255, 0, 0, 0.87)'});
          }
          element.css({'color': 'rgba(255, 0, 0, 0.87)'});
        } else {
          if (attrs.elementOriginalBorderBottomColor) {
            element.css({'border-bottom-color': attrs.elementOriginalBorderBottomColor});
          }
          element.css({'color': attrs.elementOriginalColor});
        }
      });
    }
  };
}]);

mdUXUI.directive('mdInputLabel', ['$timeout', 'mdStyle', function($timeout, mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding-top': '2px',
        'min-height': '22px',
        'transform-origin': 'left top 0px',
        'transform': 'translate3d(0, 28px, 0) scale(1)',
        'transition': 'font-size 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       line-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       letter-spacing 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       padding 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       -webkit-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       -o-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       -moz-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       -ms-transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s, \
                       transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s',
      };
      element.css(mdStyle.font('label', mdStyle.general(s)));
      var update = function() {
        var s = {};
        if (focus) {
          if (error) {
            s['color'] = 'rgba(255, 0, 0, 0.87)';
          } else {
            s['color'] = 'rgba(0, 0, 0, 0.54)';
          }
          attrs.$set('elementOriginalColor', 'rgba(0, 0, 0, 0.54)');
          //s['line-height'] = '14px';
          //s['font-size'] = '12px';
          //s['letter-spacing'] = '0.2px';
          //s['color'] = 'rgba(0, 0, 0, 0.54)';
          //s['padding-top'] = '8px';
          //s['transform'] = 'translate3d(0, 6px, 0) scale(0.75)';
          //s['color'] = 'rgba(0, 0, 0, 0.54)';
          s['transform'] = 'translate3d(0, 6px, 0) scale(0.75)';
        } else {
          if (error) {
            s['color'] = 'rgba(255, 0, 0, 0.87)';
          } else {
            s['color'] = 'rgba(0, 0, 0, 0.38)';
          }
          attrs.$set('elementOriginalColor', 'rgba(0, 0, 0, 0.38)');
          //s['line-height'] = '20px';
          //s['font-size'] = '16px';
          //s['letter-spacing'] = '0.1px';
          //s['color'] = 'rgba(0, 0, 0, 0.38)';
          //s['padding-top'] = '2px';
          //s['transform'] = 'translate3d(0, 28px, 0) scale(1)';
          //s['color'] = 'rgba(0, 0, 0, 0.38)';
          s['transform'] = 'translate3d(0, 28px, 0) scale(1)';
        }
        element.css(s);
      };
      var error = false;
      var focus = false;
      update();
      attrs.$observe('mdError', function(value) {
        error = scope.$eval(value);
        update();
      });
      attrs.$observe('focus', function(value) {
        focus = scope.$eval(value);
        update();
      });
    }
  };
}]);

mdUXUI.directive('mdInputHelper', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '4px 0',
        'min-height': '22px',
      };
      element.css(mdStyle.font('helper', mdStyle.general(s)));
    }
  };
}]);

mdUXUI.directive('mdInputText', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'cursor': 'text',
        'padding': '8px 0 7px',
        'border-bottom': '1px solid rgba(0, 0, 0, 0.12)',
        'width': '100%',
        'min-height': '36px',
        'transition': 'border 0.2s linear 0s, color 0.2s linear 0s',
      };
      element.css(mdStyle.font('input', mdStyle.general(s)));
    }
  };
}]);

mdUXUI.directive('mdInputNumber', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'cursor': 'text',
        'padding': '4px ',
        'border': 'none',
        'min-height': '36px',
        'appearance': 'none',
        'transition': 'border 0.2s linear 0s, color 0.2s linear 0s',
      };
      //'width': '96px',
      element.css(mdStyle.font('display1', mdStyle.misc('textCenter', mdStyle.general(s))));
    }
  };
}]);

mdUXUI.directive('mdInputSelection', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'cursor': 'pointer',
        'padding': '8px 0 7px',
        'border-bottom': '1px solid rgba(0, 0, 0, 0.12)',
        'width': '100%',
        'min-height': '36px',
        'transition': 'border 0.2s linear 0s, color 0.2s linear 0s',
      };
      element.css(mdStyle.font('input', mdStyle.general(s)));
    }
  };
}]);

mdUXUI.directive('mdInputSelectionIcon', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'position': 'absolute',
        'overflow': 'hidden',
        'font-size': '24px',
        'right': '0',
        'top': '6px',
      };
      element.css(mdStyle.font('default', mdStyle.icon(mdStyle.general(s))));
    }
  };
}]);

mdUXUI.directive('mdButtonIconRaised', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'width': '48px',
        'height': '48px',
        'padding': '12px',
        'transition': 'text-shadow 0.2s linear 0s, color 0.2s linear 0s',
        'overflow': 'hidden',
        'color': 'rgba(255, 255, 255, 1)',
        'text-shadow': '1px 2px 2px rgba(0, 0, 0, 0.54)',
        'cursor': 'pointer',
      };
      element.css(mdStyle.font('default', mdStyle.icon(mdStyle.general(s))));
      mdStyle.ripple(scope, element, attrs, 'icon-dark');
      element.on('mousedown', function(event) {
        element.css({'text-shadow': '2px 4px 4px rgba(0, 0, 0, 0.54)'});
      });
      element.on('mouseup', function(event) {
        element.css({'text-shadow': '1px 2px 2px rgba(0, 0, 0, 0.54)'});
      });
    }
  };
}]);

mdUXUI.directive('mdButtonIconFlat', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'width': '48px',
        'height': '48px',
        'padding': '12px',
        'overflow': 'hidden',
        'color': 'rgba(0, 0, 0, 0.54)',
        'cursor': 'pointer',
      };
      element.css(mdStyle.font('default', mdStyle.icon(mdStyle.general(s))));
      mdStyle.ripple(scope, element, attrs, 'icon-dark');
    }
  };
}]);

mdUXUI.directive('mdButtonTextFlat', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'min-width': '64px',
        'height': '36px',
        'padding': '6px 8px',
        'margin': '6px 4px',
        'border-radius': '2px',
        'overflow': 'hidden',
        'background': 'rgba(255, 255, 255, 1)',
        'color': 'rgba(0, 0, 0, 0.87)',
        'cursor': 'pointer',
      };
      element.css(mdStyle.font('button', mdStyle.general(s)));
      mdStyle.ripple(scope, element, attrs, 'tracking-dark');
    }
  };
}]);

mdUXUI.directive('mdButtonComposite', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'overflow': 'hidden',
        'width': '100%',
        'cursor': 'pointer',
      };
      var theme;
      element.css(mdStyle.general(s));
      attrs.$observe('theme', function(value) {
        mdStyle.ripple(scope, element, attrs, value);
      });
    }
  };
}]);

mdUXUI.directive('mdRipple', ['$timeout', 'mdStyle', function($timeout, mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var timer_delay;
      var s = {
        'position': 'absolute',
        'background': 'rgba(0, 0, 0, 0.08)',
        'border-radius': '50%',
        'top': '0px',
        'left': '0px',
        'height': '48px',
        'width': '48px',
        'transform': 'scale(0, 0)',
        'opacity': '0',
      };
      var surface = angular.element('<div></div>');
      surface.css(mdStyle.general(s));
      element.append(surface);
      var type = 'icon-dark';
      attrs.$observe('mdRipple', function(value) {
        if (value) {
          type = value;
        }
        if (type === 'tracking-dark') {
          surface.css({'background': 'rgba(0, 0, 0, 0.16)'});
        } else if ((type === 'tracking-light') || (type === 'icon-light')) {
          surface.css({'background': 'rgba(255, 255, 255, 0.20)'});
        }
      });
      var resetAnimation = function() {
        var s = {
          'transition': 'all 0s ease 0s',
          'transform': 'scale(0, 0)',
          'opacity': '0',
        };
        surface.css(s);
      };
      var position = function(event) {
        var parent_width = element[0].clientWidth;
        var parent_height = element[0].clientHeight;
        var element_position = element[0].getBoundingClientRect();
        var parent_diagonal = 2 * (Math.round(Math.sqrt((parent_width * parent_width) + (parent_height * parent_height))));
        if (parent_diagonal > 2000) {
          parent_diagonal = 2000;
        }
        var margin = -(parent_diagonal/2);
        var s = {
          'top': (event.clientY - element_position.top).toString(),
          'left': (event.clientX - element_position.left).toString(),
          'height': parent_diagonal.toString(),
          'width': parent_diagonal.toString(),
          'margin-top': margin.toString(),
          'margin-left': margin.toString(),
        };
        surface.css(s);
      };
      var animate = function(opacityInterval, scaleInterval) {
        var OI = (opacityInterval / 1000).toString();
        var SI = (scaleInterval / 1000).toString();
        var s = {
          'transition': 'opacity ' + OI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                                -webkit-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                                -moz-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                                -o-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                                -ms-transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s, \
                                transform ' + SI + 's cubic-bezier(0, 0, 0.75, 1) 0s',
          'transform': 'scale(1, 1)',
          'opacity': '1',
        };
        surface.css(s);
        $timeout(function() {surface.css({'opacity': '0'});}, opacityInterval);
        timer_delay = $timeout(function() {resetAnimation();}, scaleInterval);
      };
      element.on('mousedown', function(event) {
        $timeout.cancel(timer_delay);
        resetAnimation();
        if ((type === 'tracking-dark') || (type === 'tracking-light')) {
          position(event);
          animate(300, 600);
        } else {
          animate(200, 400);
        }
      });
    }
  };
}]);

mdUXUI.directive('mdFullScreenCase', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.modal('case', {}));
    }
  };
}]);

mdUXUI.directive('mdDrawerWideCase', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '0 0 0 56px',
        'justify-content': 'flex-end',
      };
      element.css(mdStyle.modal('case', s));
    }
  };
}]);

mdUXUI.directive('mdDrawerNarrowCase', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '0 0 0 56px',
        'justify-content': 'flex-end',
      };
      element.css(mdStyle.modal('case', s));
    }
  };
}]);

mdUXUI.directive('mdSimpleCase', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '24px 40px',
      };
      element.css(mdStyle.modal('case', s));
    }
  };
}]);

mdUXUI.directive('mdConfirmationCase', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '24px 40px',
      };
      element.css(mdStyle.modal('case', s));
    }
  };
}]);

mdUXUI.directive('mdModalScreen', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.modal('screen', {}));
      var active = false;
      var toggle = function(active) {
        var s = {};
        if (active) {
          s['transition'] = 'opacity 0.2s linear 0s';
          s['opacity'] = '1';
        } else {
          s['transition'] = 'opacity 0.2s linear 0.1s';
          s['opacity'] = '0';
        }
        element.css(s);
      };
      toggle(active);
      attrs.$observe('active', function(value) {
        active = scope.$eval(value);
        toggle(active);
      });
    }
  };
}]);

mdUXUI.directive('mdModalSlide', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var side;
      var active = false;
      var toggle = function(active, side) {
        var s = {};
        if (active) {
          s['transition'] = side + ' 0.3s cubic-bezier(0, 0, 0.4, 1) 0s';
          s[side] = '0';
        } else {
          s['transition'] = side + ' 0.3s cubic-bezier(0.8, 0, 1, 1) 0s';
          s[side] = '-110%';
        }
        element.css(s);
      };
      toggle(active, side);
      attrs.$observe('mdModalSlide', function(value) {
        if (value) {
          side = value;
          toggle(active, side);
        }
      });
      attrs.$observe('active', function(value) {
        active = scope.$eval(value);
        toggle(active, side);
      });
    }
  };
}]);

mdUXUI.directive('mdModalFade', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var active = false;
      var toggle = function(active) {
        var s = {};
        if (active) {
          s['transition'] = 'opacity 0.3s linear 0s, width 0.3s linear 0s, height 0.3s linear 0s';
          s['opacity'] = '1';
        } else {
          s['transition'] = 'opacity 0.3s linear 0s, width 0.3s linear 0s, height 0.3s linear 0s';
          s['opacity'] = '0';
        }
        element.css(s);
      };
      toggle(active);
      attrs.$observe('active', function(value) {
        active = scope.$eval(value);
        toggle(active);
      });
    }
  };
}]);

mdUXUI.directive('mdFullScreenSheet', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var side = 'top';
      var s = {
        'width': '100%',
        'min-width': '224px',
        'height': '100%',
        'box-shadow': '0 0 16px 4px rgba(0, 0, 0, 0.26)'
      };
      element.css(mdStyle.modal('sheet', s));
    }
  };
}]);

mdUXUI.directive('mdDrawerWideSheet', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'width': '100%',
        'min-width': '168px',
        'max-width': '560px',
        'height': '100%',
        'box-shadow': '0 0 16px 4px rgba(0, 0, 0, 0.26)'
      };
      element.css(mdStyle.modal('sheet', s));
    }
  };
}]);

mdUXUI.directive('mdDrawerNarrowSheet', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'width': '100%',
        'min-width': '168px',
        'max-width': '280px',
        'height': '100%',
        'box-shadow': '0 0 16px 4px rgba(0, 0, 0, 0.26)'
      };
      element.css(mdStyle.modal('sheet', s));
    }
  };
}]);

mdUXUI.directive('mdSimpleSheet', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'position': 'relative',
        'border-radius': '2px',
        'width': '100%',
        'min-width': '168px',
        'max-width': '560px',
        'height': '100%',
        'box-shadow': '0 12px 24px 6px rgba(0, 0, 0, 0.26)',
      };
      element.css(mdStyle.modal('sheet', s));
    }
  };
}]);

mdUXUI.directive('mdConfirmationSheet', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'position': 'relative',
        'border-radius': '2px',
        'width': '100%',
        'min-width': '168px',
        'max-width': '560px',
        'box-shadow': '0 12px 24px 6px rgba(0, 0, 0, 0.26)',
      };
      element.css(mdStyle.modal('sheet', s));
    }
  };
}]);

mdUXUI.directive('mdPage', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.page({}));
      attrs.$observe('top', function(value) {
        element.css({'top': value});
      });
      attrs.$observe('bottom', function(value) {
        element.css({'bottom': value});
      });
      attrs.$observe('verticalScroll', function(value) {
        element.css({'overflow-y': value});
      });
      attrs.$observe('horizontalScroll', function(value) {
        element.css({'overflow-x': value});
      });
    }
  };
}]);

mdUXUI.directive('mdAppBar', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var appbar = {
        'position': 'absolute',
        'overflow': 'hidden',
        'background': 'rgba(255, 255, 255, 1)',
        'left': '0',
        'right': '0',
        'min-height': '56px',
        'z-index': '300',
        'box-shadow': '0 2px 4px 1px rgba(0, 0, 0, 0.26)',
        'transition': 'top 0.3s cubic-bezier(0.8, 0, 0.4, 1) 0s, bottom 0.3s cubic-bezier(0.8, 0, 0.4, 1) 0s',
      };
      element.css(mdStyle.general(appbar));
      attrs.$observe('top', function(value) {
        element.css({'top': value});
      });
    }
  };
}]);

mdUXUI.directive('mdActions', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var actions = {
        'position': 'absolute',
        'overflow': 'hidden',
        'z-index': '200',
        'justify-content': 'flex-start',
        'flex-direction': 'row',
      };
      var lines, side, dialog;
      element.css(mdStyle.collections(actions));
      var setPosition = function(lines, side, dialog) {
        var position = {};
        if (lines > '3') {
          position['top'] = '4px';
        } else if (lines === '2') {
          position['top'] = '12px';
        } else {
          position['top'] = '0';
        }
        if (side === 'left') {
          position['left'] = dialog ? '12px' : '4px';
        } else if (side === 'right') {
          position['right'] = dialog ? '12px' : '4px';
        }
        element.css(position);
      };
      setPosition(lines, side, dialog);
      attrs.$observe('lines', function(value) {
        if (value) {
          lines = value;
          setPosition(lines, side, dialog);
        }
      });
      attrs.$observe('side', function(value) {
        if (value) {
          side = value;
          setPosition(lines, side, dialog);
        }
      });
      attrs.$observe('dialog', function(value) {
        dialog = scope.$eval(value);
        setPosition(lines, side, dialog);
      });
    }
  };
}]);

mdUXUI.directive('mdAction', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var icon = {
        'flex-direction': 'row',
        'justify-content': 'space-between',
      };
      element.css(mdStyle.collections(icon));
      attrs.$observe('side', function(value) {
        if (value === 'center') {
          element.css({'justify-content': 'center'});
        } else if (value === 'left') {
          element.css({'justify-content': 'flex-start'});
        } else if (value === 'right') {
          element.css({'justify-content': 'flex-end'});
        }
      });
    }
  };
}]);

mdUXUI.directive('mdGrid', ['$window', 'mdStyle', function($window, mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '7px 1px',
        'flex-direction': 'row',
        'flex-wrap': 'wrap',
      };
      element.css(mdStyle.collections(s));
      var minItemWidth = attrs.minItemWidth;
      var width = (element.width() - 2);
      attrs.$observe('minItemWidth', function(value) {
        if (value) {
          minItemWidth = value;
          width = (element.width() - 2);
          scope.mdGrid = mdStyle.calculateContainer(width, minItemWidth);
        }
      });
      scope.mdGrid = mdStyle.calculateContainer(width, minItemWidth);
      angular.element($window).on('resize', function() {
        width = (element.width() - 2);
        scope.mdGrid = mdStyle.calculateContainer(width, minItemWidth);
        scope.$apply();
      });
    }
  };
}]);

mdUXUI.directive('mdGridCell', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {'padding': '1px'};
      element.css(mdStyle.general(s));
    }
  };
}]);

mdUXUI.directive('mdGridCellTile', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.general({}));
    }
  };
}]);

mdUXUI.directive('mdList', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '8px 0',
      };
      element.css(mdStyle.collections(s));
    }
  };
}]);

mdUXUI.directive('mdListCell', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.general({}));
    }
  };
}]);

mdUXUI.directive('mdListCellTile', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var lines = '';
      var side = '';
      var dialog = false;
      element.css(mdStyle.general({}));
      var setPadding = function() {
        var top = '0', bottom = '0', left = '0', right = '0';
        if (lines > '3') {
          top = '24px';
          bottom = '24px';
        } else if (lines === '2') {
          top = '14px';
          bottom = '14px';
        } else if ((lines === '1') || (lines === '3')) {
          top = '12px';
          bottom = '12px';
        }
        left = dialog ? '24px' : '16px';
        right = dialog ? '24px' : '16px';
        if (side === 'left') {
          left = dialog ? '80px' : '72px';
        } else if (side === 'right') {
          right = dialog ? '72px' : '56px';
        }
        element.css({'padding-top': top, 'padding-bottom': bottom, 'padding-left': left, 'padding-right': right});
      };
      setPadding();
      attrs.$observe('lines', function(value) {
        if (value) {
          lines = value;
          setPadding();
        }
      });
      attrs.$observe('side', function(value) {
        if (value) {
          side = value;
          setPadding();
        }
      });
      attrs.$observe('dialog', function(value) {
        dialog = scope.$eval(value);
        setPadding();
      });
    }
  };
}]);

mdUXUI.directive('mdListSubheader', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '4px 16px 12px 16px',
      };
      element.css(mdStyle.font('subheader', mdStyle.general(s)));
    }
  };
}]);

mdUXUI.directive('mdPrimary', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.font('primary', mdStyle.general({})));
    }
  };
}]);

mdUXUI.directive('mdSecondary', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.font('secondary', mdStyle.general({})));
    }
  };
}]);

mdUXUI.directive('mdFade', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdFade', function(value) {
        if (scope.$eval(value)) {
          element.css({'opacity': '0'});
        } else {
          element.css({'opacity': '1'});
        }
      });
    }
  };
}]);

mdUXUI.directive('mdCards', ['$window', 'mdStyle', function($window, mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '4px',
      };
      element.css(mdStyle.collections(s));
    }
  };
}]);

mdUXUI.directive('mdCardsCell', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '4px',
      };
      element.css(mdStyle.general(s));
    }
  };
}]);

mdUXUI.directive('mdCardsCellTile', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'border-radius': '2px',
        'box-shadow': '0 1px 2px 0.5px rgba(0, 0, 0, 0.26)',
        'transition': 'box-shadow 0.2s linear 0s',
      };
      element.css(mdStyle.general(s));
    }
  };
}]);

mdUXUI.directive('mdWall', ['$window', 'mdStyle', function($window, mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '4px',
        'column-rule': '0 none rgba(0, 0, 0, 0)',
        'column-gap': '0',
        'column-count': '1',
        'column-span': '1',
        'column-width': 'auto',
      };
      element.css(mdStyle.general(s));
      var minItemWidth = attrs.minItemWidth;
      var width = (element.width() - 8);
      var calculateContainer = function() {
        var wall = mdStyle.calculateContainer(width, minItemWidth);
        element.css({'column-count': wall.itemCount});
        return wall;
      };
      attrs.$observe('minItemWidth', function(value) {
        if (value) {
          minItemWidth = value;
          width = (element.width() - 8);
          scope.mdWall = calculateContainer();
        }
      });
      scope.mdWall = calculateContainer();
      angular.element($window).on('resize', function() {
        width = (element.width() - 8);
        scope.mdWall = calculateContainer();
        scope.$apply();
      });
    }
  };
}]);

mdUXUI.directive('mdWallCell', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '4px',
        'break-inside': 'avoid',
      };
      element.css(mdStyle.general(s));
      var width;
      var setSize = function() {
        var s = {
          'width': width.toString() + 'px',
        };
        element.css(s);
      };
      attrs.$observe('mdWidth', function(value) {
        if (value) {
          width = value;
          setSize();
        }
      });
    }
  };
}]);

mdUXUI.directive('mdWallCellTile', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var tile = {
        'border-radius': '2px',
        'box-shadow': '0 1px 2px 0.5px rgba(0, 0, 0, 0.26)',
        'transition': 'box-shadow 0.2s linear 0s',
      };
      element.css(mdStyle.general(tile));
    }
  };
}]);

mdUXUI.directive('mdCarousel', ['$window', 'mdStyle', function($window, mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'justify-content': 'flex-start',
        'flex-direction': 'row',
        'transition': 'right 0.3s cubic-bezier(0.8, 0, 0.4, 1) 0s, left 0.3s cubic-bezier(0.8, 0, 0.4, 1) 0s',
        'height': '100%',
        'width': '100%',
      };
      element.css(mdStyle.collections(s));
      scope.mdCarouselHeight = parseInt(element.height());
      scope.mdCarouselWidth = parseInt(element.width());
      var position = 0;
      var index = 0;
      var setPosition = function() {
        if (position < 0) {
          position = 0;
        } else if (position > index) {
          position = index;
        }
        var right = position * scope.mdCarouselWidth;
        element.css({'right': right.toString() + 'px'});
      };
      angular.element($window).on('resize', function() {
        scope.mdCarouselHeight = parseInt(element.height());
        scope.mdCarouselWidth = parseInt(element.width());
        scope.$apply();
        setPosition();
      });
      attrs.$observe('index', function(value) {
        if (value) {
          index = parseInt(value);
          setPosition();
        }
      });
      attrs.$observe('position', function(value) {
        if (value) {
          position = parseInt(value);
          setPosition();
        }
      });
    }
  };
}]);

mdUXUI.directive('mdCarouselCell', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'justify-content': 'center',
        'flex-direction': 'row',
        'align-items': 'center',
      };
      element.css(mdStyle.collections(s));
      var width, height;
      width = 0;
      height = 0;
      var setSize = function() {
        var s = {
          'min-width': width.toString() + 'px',
          'min-height': height.toString() + 'px',
          'max-width': width.toString() + 'px',
          'max-height': height.toString() + 'px',
        };
        element.css(s);
      };
      setSize();
      attrs.$observe('mdWidth', function(value) {
        if (value) {
          width = value;
          setSize();
        }
      });
      attrs.$observe('mdHeight', function(value) {
        if (value) {
          height = value;
          setSize();
        }
      });
    }
  };
}]);

mdUXUI.directive('mdImg', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      //var width = parseInt(element.width());
      //var height = parseInt(element.height());
      var width, height, originalWidth, originalHeight;
      width = 0;
      height = 0;
      element.css(mdStyle.general({}));
      var setSize = function() {
        var originalRatio = originalWidth / originalHeight;
        var ratio = width / height;
        if (originalRatio > ratio) {
          element.css({'width': width.toString() + 'px', 'height': ''});
        } else {
          element.css({'height': height.toString() + 'px', 'width': ''});
        }
      };
      element.on('load', function() {
        originalWidth  = this.width;
        originalHeight = this.height;
        setSize();
      });
      attrs.$observe('mdWidth', function(value) {
        if (value) {
          width = value;
          setSize();
        }
      });
      attrs.$observe('mdHeight', function(value) {
        if (value) {
          height = value;
          setSize();
        }
      });
    }
  };
}]);

mdUXUI.directive('mdLattice', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'padding': '16px 0',
        'justify-content': 'space-around',
        'align-items': 'center',
        'align-content': 'space-around',
        'flex-direction': 'row',
        'flex-wrap': 'wrap',
      };
      element.css(mdStyle.collections(s));
    }
  };
}]);

mdUXUI.directive('mdLatticeCell', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.general({}));
    }
  };
}]);

mdUXUI.directive('mdLatticeCellTile', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      var s = {
        'display': 'flex',
        'padding': '24px',
        'justify-content': 'center',
        'align-content': 'flex-start',
        'flex-direction': 'column',
        'flex-wrap': 'nowrap',
        'align-items': 'center',
      };
      element.css(mdStyle.general(s));
    }
  };
}]);

mdUXUI.directive('mdBase', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      element.css(mdStyle.general({}));
    }
  };
}]);

mdUXUI.directive('mdSeam', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdSeam', function(value) {
        element.css(mdStyle.misc('seam'));
      });
    }
  };
}]);

mdUXUI.directive('mdActive', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdActive', function(value) {
        if (scope.$eval(value)) {
          if (!attrs.elementOriginalBackground) {
            attrs.$set('elementOriginalBackground', element.css('background'));
          }
          element.css({'background': 'rgba(0, 0, 0, 0.08)'});
        } else {
          if (attrs.elementOriginalBackground) {
            element.css({'background': attrs.elementOriginalBackground});
          }
        }
      });
    }
  };
}]);

mdUXUI.directive('mdDisabled', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdDisabled', function(value) {
        if (scope.$eval(value)) {
          if (!attrs.elementOriginalColor) {
            attrs.$set('elementOriginalColor', element.css('color'));
          }
          if (!attrs.elementOriginalCursor) {
            attrs.$set('elementOriginalCursor', element.css('cursor'));
          }
          element.css({'color': 'rgba(0, 0, 0, 0.38)', 'cursor': 'not-allowed'});
        } else {
          if (attrs.elementOriginalColor) {
            element.css({'color': attrs.elementOriginalColor});
          }
          if (attrs.elementOriginalCursor) {
            element.css({'cursor': attrs.elementOriginalCursor});
          }
        }
      });
    }
  };
}]);

mdUXUI.directive('mdFont', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdFont', function(value) {
        if (value) {
          element.css(mdStyle.font(value));
        }
      });
      attrs.$observe('mdMisc', function(value) {
        if (value) {
          element.css(mdStyle.misc(value));
        }
      });
    }
  };
}]);

mdUXUI.directive('mdIcon', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdIcon', function(value) {
        var s = {};
        if (value === 'thumb') {
          s = {'font-size': '96px'};
        } else if (value === 'avatar') {
          s = {'font-size': '48px'};
        }
        element.css(mdStyle.font('default', mdStyle.icon(s)));
      });
    }
  };
}]);

mdUXUI.directive('mdMisc', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdMisc', function(value) {
        if (value) {
          element.css(mdStyle.misc(value));
        }
      });
    }
  };
}]);

mdUXUI.directive('mdPad', ['mdStyle', function(mdStyle) {
  return {
    link: function(scope, element, attrs) {
      attrs.$observe('mdPad', function(value) {
        if (value) {
          element.css(mdStyle.pad(value));
        }
      });
    }
  };
}]);