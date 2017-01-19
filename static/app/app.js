(function() {
  'use strict';

/*--------------------------------------------------App--------------------------------------------------*/

var dataLayer = [];

var mdApp = angular.module('mdApp', ['mdUXUI', 'ngTouch', 'ngCookies']);

mdApp.config([function() {
  
}]);

mdApp.run([function(){
  
}]);

/*--------------------------------------------------Services--------------------------------------------------*/

mdApp.factory('mdIntercomFactory', [function() {
  
  var calls = {};
  
  var registerCallback = function(name, callback) {
    calls[name] = callback;
  };
  
  var getCallback = function(name) {
    return calls[name];
  };
  
  return {
    'register': registerCallback,
    'get': getCallback
  };
  
}]);

mdApp.factory('mdCartFactory', ['$http', '$cookies', function($http, $cookies) {
  
  var cart;
  
  var resetCart = function(callback) {
    $http.get('account', {'cache': true}).then(function(response) {
      var account = response.data;
      var testCart = {
        'currency': 'usd',
        'coupon': '',
        'email': 'margotrobbie@example.com',
        'items': [{
          'currency': 'usd',
          'description': 'Product Name',
          'amount': 100,
          'parent': 'sku_9qYkc73aiaE6VG',
          'product': 'prod_80HnnViSIO0LWc',
          'quantity': 1,
          'type': 'sku'
        }],
        'shipping': {
          'name': 'Margot Robbie',
          'phone': '+12223334444',
          'address': {
            'country': 'US',
            'state': 'California',
            'city': 'Beverly Hills',
            'postal_code': '91210',
            'line1': 'Rodeo Drive 42',
            'line2': 'Apartment 007'
          }
        },
        'card': {},
        'amount': '',
        'status': 'new'
      };
      var newCart = {
        'currency': account.default_currency,
        'coupon': '',
        'email': '',
        'items': [],
        'shipping': {
          'name': '',
          'phone': '',
          'address': {
            'country': '',
            'state': '',
            'city': '',
            'postal_code': '',
            'line1': '',
            'line2': ''
          }
        },
        'card': {},
        'amount': '',
        'status': 'new'
      };
      cart = angular.merge({}, newCart);
      callback(response);
    }, callback);
  };
  
  var getCart = function() {
    return cart;
  };
  
  var createCart = function(callback) {
    var orderId = $cookies.get('orderId');
    if (orderId) {
      $http.get('order/' + orderId, {'cache': true}).then(function(response) {
        resetCart(function(res) {angular.merge(cart, response.data); callback(res);});
      }, callback);
    } else {
      resetCart(callback);
    }
  };
  
  var deleteCart = function(callback) {
    var orderId = $cookies.get('orderId');
    if (orderId) {
      var order = {'id': orderId, 'status': 'canceled'};
      $http.post('order/update', order, {'cache': true}).then(function(response) {
        $cookies.remove('orderId', orderId);
        resetCart(callback);
      }, callback);
    } else {
      resetCart(callback);
    }
  };
  
  var updateCart = function(name, value) {
    if (cart.status === 'new') {
      if (name === 'items') {
        var updated = false;
        angular.forEach(cart.items, function(item, key) {
          if ((item.type === 'sku') && (item.parent === value.parent)) {
            updated = true;
            if (value.quantity > 0) {
              cart.items[key] = value;
            } else {
              cart.items.splice(key, 1);
            }
          }
        });
        if (!updated && (value.quantity > 0)) {
          cart.items.push(value);
        }
        var amount = 0;
        angular.forEach(cart.items, function(item, key) {
          if (item.type === 'sku') {
            amount = amount + item.amount;
          }
        });
        cart.amount = amount;
      }
      if (name === 'country') {
        cart.shipping.address.country = value;
      }
      if (name === 'state') {
        cart.shipping.address.state = value;
      }
      if (name === 'city') {
        cart.shipping.address.city = value;
      }
      if (name === 'postal_code') {
        cart.shipping.address.postal_code = value;
      }
      if (name === 'line1') {
        cart.shipping.address.line1 = value;
      }
      if (name === 'line2') {
        cart.shipping.address.line2 = value;
      }
      if (name === 'name') {
        cart.shipping.name = value;
      }
      if (name === 'phone') {
        cart.shipping.phone = value;
      }
      if (name === 'email') {
        cart.email = value;
      }
    }
    if (cart.status === 'created') {
      if (name === 'shipping_method') {
        angular.forEach(cart.shipping_methods, function(method) {
          if (method.id === value) {
            cart.selected_shipping_method = value;
          }
        });
      }
      if (name === 'number') {
        cart.card.number = value;
      }
      if (name === 'exp_month') {
        cart.card.exp_month = value;
      }
      if (name === 'exp_year') {
        cart.card.exp_year = value;
      }
      if (name === 'cvc') {
        cart.card.cvc = value;
      }
    }
  };
  
  var saveCart = function(callback) {
    if (!cart.id && (cart.status === 'new')) {
      $http.post('order/create', cart, {'cache': true}).then(function(response) {
        angular.merge(cart, response.data);
        $cookies.put('orderId', cart.id);
        callback(response);
      }, callback);
    } else if (cart.id && (cart.status === 'created')) {
      $http.post('order/update', cart, {'cache': true}).then(function(response) {
        angular.merge(cart, response.data);
        callback(response);
      }, callback);
    }
  };
  
  var payCart = function(callback) {
    var pay = function(status, response) {
      if ((status === 200) && (!response.used) && (response.id)) {
        var order = {
          'id': cart.id,
          'source': response.id
        };
        $http.post('order/pay', order, {'cache': true}).then(function(response) {
          angular.merge(cart, response.data);
          cart.card = {};
          $cookies.remove('orderId');
          callback(response);
        }, callback);
      } else {
        if (response.error && response.error.type && response.error.type === 'card_error') {
          callback({'data': {'error': response.error.code}, 'status': status});
        } else {
          callback({'data': response, 'status': status});
        }
        
      }
    };
    if (cart.id) {
      var card = {
        'number': cart.card.number,
        'exp_month': cart.card.exp_month,
        'exp_year': cart.card.exp_year,
        'cvc': cart.card.cvc,
        'name': cart.shipping.name,
        'address_country': cart.shipping.address.country,
        'address_state': cart.shipping.address.state,
        'address_city': cart.shipping.address.city,
        'address_zip': cart.shipping.address.postal_code,
        'address_line1': cart.shipping.address.line1,
        'address_line2': cart.shipping.address.line2
      };
      Stripe.card.createToken(card, pay);
    }
  };
  
  var getCartItemQuantity = function(skuId) {
    var quantity = 0;
    angular.forEach(cart.items, function(item, key) {
      if ((item.type === 'sku') && (item.parent === skuId)) {
        quantity = item.quantity;
      }
    });
    return quantity;
  };
  
  return {
    'getCart': getCart,
    'createCart': createCart,
    'deleteCart': deleteCart,
    'updateCart': updateCart,
    'saveCart': saveCart,
    'payCart': payCart,
    'getCartItemQuantity': getCartItemQuantity
  };
  
}]);

/*--------------------------------------------------Filters--------------------------------------------------*/

mdApp.filter('formatCountry', [function() {
  return function(input, countries) {
    if (countries) {
      var output = '';
      angular.forEach(countries, function(country){
        if (country.code === input) {
          output = country.name;
        }
      });
      return output;
    }
  };
}]);

mdApp.filter('formatCurrency', [function() {
  return function(input, currency) {
    if (currency) {
      var output = parseFloat(input) || 0;
      var formater = '1';
      for (var i = 0; i < currency.decimal_digits; i++) {
        formater = formater + '0';
      }
      formater = parseInt(formater);
      output = output / formater;
      output = output.toFixed(currency.decimal_digits);
      output = output.toString();
      return output;
    }
  };
}]);

mdApp.filter('formatCurrencyPrefix', [function() {
  return function(input, currency) {
    if (currency) {
      var output = currency.code;
      output = output + ' ' + input.toString();
      return output;
    }
  };
}]);

mdApp.filter('formatInventory', [function() {
  return function(inventory) {
    var output = '';
    if (inventory.type === 'infinite') {
      output = Infinity;
      
    } else if (inventory.type === 'bucket') {
      output = (inventory.value === 'out_of_stock') ? 0 : Infinity;
      
    } else if (inventory.type === 'finite') {
      output = inventory.quantity;
    }
    return output;
  };
}]);

mdApp.filter('formatAvailability', [function() {
  return function(inventory, dictionary) {
    var output = '';
    if (inventory.type === 'infinite') {
      output = 'in_stock';
    } else if (inventory.type === 'bucket') {
      output = inventory.value;
    } else if (inventory.type === 'finite') {
      output = (inventory.quantity > 0) ? 'in_stock' : 'out_of_stock';
    }
    if (dictionary) {
      return dictionary[output];
    } else {
      return output;
    }
  };
}]);

/*--------------------------------------------------Components--------------------------------------------------*/
/*--------------------------------------------------Modals--------------------------------------------------*/

var modalController = function($scope, $element, $attrs, $timeout) {
  var ctrl = this;
  ctrl.$postLink = function() {
    if (ctrl.active !== true && ctrl.active !== false) {
      ctrl.alive = true;
    }
  };
  ctrl.open = function() {
    $timeout(function() {ctrl.alive = true;}, 0);
    $timeout(function() {ctrl.onOpen();}, 300);
  };
  ctrl.close = function() {
    $timeout(function() {ctrl.alive = false;}, 0);
    $timeout(function() {ctrl.onClose();}, 300);
  };
  ctrl.$onChanges = function(changes) {
    if (changes.active.currentValue === true) {
      ctrl.open();
    } else if (changes.active.currentValue === false) {
      ctrl.close();
    }
  };
};

mdApp.component('mdFullScreen', {
  template: `<md-full-screen-case>
              <md-modal-screen active="{{$ctrl.alive}}"></md-modal-screen>
              <md-full-screen-sheet md-modal-slide="{{$ctrl.side}}" active="{{$ctrl.alive}}" ng-transclude></md-full-screen-sheet>
            </md-full-screen-case>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$timeout', modalController],
  bindings: {
    onOpen: '&',
    onClose: '&',
    active: '<',
    side: '<'
  }
});

mdApp.component('mdDrawerWide', {
  template: `<md-drawer-wide-case>
              <md-modal-screen active="{{$ctrl.alive}}" ng-click="$ctrl.close()"></md-modal-screen>
              <md-drawer-wide-sheet md-modal-slide="right" active="{{$ctrl.alive}}" ng-transclude></md-drawer-wide-sheet>
            </md-drawer-wide-case>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$timeout', modalController],
  bindings: {
    onOpen: '&',
    onClose: '&',
    active: '<'
  }
});

mdApp.component('mdDrawerNarrow', {
  template: `<md-drawer-narrow-case>
              <md-modal-screen active="{{$ctrl.alive}}" ng-click="$ctrl.close()"></md-modal-screen>
              <md-drawer-narrow-sheet md-modal-slide="right" active="{{$ctrl.alive}}" ng-transclude></md-drawer-narrow-sheet>
            </md-drawer-narrow-case>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$timeout', modalController],
  bindings: {
    onOpen: '&',
    onClose: '&',
    active: '<'
  }
});

mdApp.component('mdFullScreenFade', {
  template: `<md-full-screen-case>
              <md-modal-screen active="{{$ctrl.alive}}"></md-modal-screen>
              <md-full-screen-sheet md-modal-fade active="{{$ctrl.alive}}" ng-transclude></md-full-screen-sheet>
            </md-full-screen-case>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$timeout', modalController],
  bindings: {
    onOpen: '&',
    onClose: '&',
    active: '<'
  }
});

mdApp.component('mdSimple', {
  template: `<md-simple-case>
              <md-modal-screen active="{{$ctrl.alive}}" ng-click="$ctrl.close()"></md-modal-screen>
              <md-simple-sheet md-modal-fade active="{{$ctrl.alive}}" ng-transclude></md-simple-sheet>
            </md-simple-case>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$timeout', modalController],
  bindings: {
    onOpen: '&',
    onClose: '&',
    active: '<'
  }
});

mdApp.component('mdConfirmation', {
  template: `<md-confirmation-case>
              <md-modal-screen active="{{$ctrl.alive}}"></md-modal-screen>
              <md-confirmation-sheet md-modal-fade active="{{$ctrl.alive}}" ng-transclude></md-confirmation-sheet>
            </md-confirmation-case>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$timeout', modalController],
  bindings: {
    onOpen: '&',
    onClose: '&',
    active: '<'
  }
});

mdApp.component('mdAppLogo', {
  template: `<md-base>
              <md-action side="center">
                <img md-base md-pad="16"
                     ng-src="{{$ctrl.imgSrc}}"
                     alt="{{$ctrl.imgAlt}}"
                     width="{{$ctrl.imgWidth}}"
                     height="{{$ctrl.imgHeight}}">
              </md-action>
            </md-base>`,
  bindings: {
    imgWidth: '<',
    imgHeight: '<',
    imgSrc: '<',
    imgAlt: '<'
  }
});

mdApp.component('mdAppIcon', {
  template: `<md-base>
              <md-action side="center">
                <md-base md-icon md-pad="16" md-content="{{$ctrl.icon}}"></md-icon>
              </md-action>
            </md-base>`,
  bindings: {
    icon: '<'
  }
});

mdApp.component('mdBrief', {
  template: `<md-snack-bar md-modal-slide="bottom" active="{{$ctrl.alive}}">
              <md-base md-font="brief" md-content="{{$ctrl.brief}}"></md-base>
            </md-snack-bar>`,
  controller: ['$scope', '$element', '$attrs', '$timeout', function($scope, $element, $attrs, $timeout) {
    var ctrl = this;
    var show_snackbar;
    var hide_snackbar;
    ctrl.show = function() {
      ctrl.brief = ctrl.message;
      $timeout(function() {ctrl.alive = true; ctrl.onShow();}, 300);
    };
    ctrl.hide = function() {
      ctrl.alive = false;
      $timeout(function() {ctrl.brief = ''; ctrl.onHide();}, 300);
    };
    ctrl.$onChanges = function(changes) {
      if (changes.message.currentValue !== changes.message.previousValue) {
        var readingTime = (ctrl.message.length * 200) + 2000;
        $timeout.cancel(hide_snackbar);
        ctrl.alive = false;
        show_snackbar = $timeout(ctrl.show, 0);
        hide_snackbar = $timeout(ctrl.hide, readingTime);
      }
    };
    ctrl.$onInit = function() {
      ctrl.brief = '';
    };
  }],
  bindings: {
    message: '<',
    onShow: '&',
    onHide: '&'
  }
});

/*--------------------------------------------------Inputs--------------------------------------------------*/

mdApp.component('mdListItemMultiline', {
  template: `<md-list-cell>
              <md-list-cell-tile lines="4" ng-transclude>
              </md-list-cell-tile>
            </md-list-cell>`,
  transclude: true
});

mdApp.component('mdListItemMultilineClickable', {
  template: `<button md-button-composite
                     ng-click="$ctrl.onClick({value: $ctrl.value})"
                     ng-disabled="$ctrl.disabled"
                     md-disabled="{{$ctrl.disabled}}"
                     theme="tracking-dark">
              <md-list-item-multiline>
                <md-base ng-transclude></md-base>
              </md-list-item-multiline>
            </button>`,
  transclude: true,
  bindings: {
    disabled: '<',
    onClick: '&',
    value: '<'
  }
});

mdApp.component('mdCardsItemMultiline', {
  template: `<md-cards-cell>
              <md-cards-cell-tile md-raised="{{!$ctrl.disabled}}" ng-transclude>
              </md-cards-cell-tile>
            </md-cards-cell>`,
  transclude: true,
  bindings: {
    disabled: '<'
  }
});

mdApp.component('mdCardsItemMultilineClickable', {
  template: `<md-cards-item-multiline disabled="$ctrl.disabled">
              <button md-button-composite
                      ng-click="$ctrl.onClick({value: $ctrl.value})"
                      ng-disabled="$ctrl.disabled"
                      md-disabled="{{$ctrl.disabled}}"
                      theme="tracking-dark"
                      ng-transclude>
              </button>
            </md-cards-item-multiline>`,
  transclude: true,
  bindings: {
    disabled: '<',
    onClick: '&',
    value: '<'
  }
});

mdApp.component('mdWallItemMultiline', {
  template: `<md-wall-cell md-width="{{$ctrl.mdWidth}}">
              <md-wall-cell-tile md-raised="{{!$ctrl.disabled}}" ng-transclude>
              </md-wall-cell-tile>
            </md-wall-cell>`,
  transclude: true,
  bindings: {
    mdWidth: '<',
    disabled: '<'
  }
});

mdApp.component('mdWallItemMultilineClickable', {
  template: `<md-wall-item-multiline md-width="$ctrl.mdWidth" disabled="$ctrl.disabled">
              <button md-button-composite
                      ng-click="$ctrl.onClick({value: $ctrl.value})"
                      ng-disabled="$ctrl.disabled"
                      md-disabled="{{$ctrl.disabled}}"
                      theme="tracking-dark"
                      ng-transclude>
              </button>
            </md-wall-item-multiline>`,
  transclude: true,
  bindings: {
    mdWidth: '<',
    disabled: '<',
    onClick: '&',
    value: '<'
  }
});

mdApp.component('mdListItem', {
  template: `<md-list-cell>
              <md-list-cell-tile lines="{{$ctrl.lines}}" side="{{$ctrl.iconPosition}}" dialog="{{$ctrl.dialog}}">
                <md-primary md-content="{{$ctrl.first}}" md-disabled="{{$ctrl.disabled}}"></md-primary>
                <md-secondary md-content="{{$ctrl.second}}" md-disabled="{{$ctrl.disabled}}" ng-if="$ctrl.second"></md-secondary>
                <md-secondary md-content="{{$ctrl.third}}" md-disabled="{{$ctrl.disabled}}" ng-if="$ctrl.third"></md-secondary>
                <md-actions side="{{$ctrl.iconPosition}}" lines="{{$ctrl.lines}}" dialog="{{$ctrl.dialog}}" ng-if="$ctrl.icon">
                  <md-base md-icon md-content="{{$ctrl.icon}}" md-disabled="{{$ctrl.disabled}}" md-pad="12"></md-base>
                </md-actions>
              </md-list-cell-tile>
            </md-list-cell>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.$onChanges = function(changes) {
      if (ctrl.first && !ctrl.second && !ctrl.third) {
        ctrl.lines = 1;
      }
      if (ctrl.second && ctrl.second && ctrl.third) {
        ctrl.lines = 3;
      }
      if ((ctrl.first && ctrl.second && !ctrl.third) || (ctrl.first && !ctrl.second && ctrl.third)) {
        ctrl.lines = 2;
      }
    };
  }],
  bindings: {
    first: '<',
    second: '<',
    third: '<',
    icon: '<',
    iconPosition: '<',
    textPosition: '<',
    dialog: '<',
    disabled: '<'
  }
});

mdApp.component('mdListItemClickable', {
  template: `<button md-button-composite
                     ng-click="$ctrl.onClick({value: $ctrl.value})"
                     ng-disabled="$ctrl.disabled"
                     md-disabled="{{$ctrl.disabled}}"
                     md-active="{{($ctrl.value === $ctrl.sample)}}"
                     theme="tracking-dark">
              <md-list-item first="$ctrl.first"
                            second="$ctrl.second"
                            third="$ctrl.third"
                            icon="$ctrl.icon"
                            icon-position="$ctrl.iconPosition"
                            text-position="$ctrl.textPosition"
                            dialog="$ctrl.dialog"
                            disabled="$ctrl.disabled"></md-list-item>
            </button>`,
  bindings: {
    first: '<',
    second: '<',
    third: '<',
    icon: '<',
    iconPosition: '<',
    textPosition: '<',
    dialog: '<',
    disabled: '<',
    onClick: '&',
    value: '<',
    sample: '<'
  }
});

mdApp.component('mdTextInput', {
  template: `<md-list-cell>
              <md-list-cell-tile>
                <md-input-label focus="{{$ctrl.focused}}"
                                md-content="{{$ctrl.label}}"
                                md-disabled="{{$ctrl.disabled}}"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                </md-input-label>
                <input name="{{$ctrl.name}}"
                       type="text"
                       md-input-text
                       md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"
                       ng-blur="$ctrl.blur()"
                       ng-focus="$ctrl.focus()"
                       ng-model="$ctrl.value"
                       ng-model-options="{allowInvalid: false}"
                       ng-disabled="$ctrl.disabled"
                       md-disabled="{{$ctrl.disabled}}"
                       ng-required="$ctrl.required"
                       ng-trim="$ctrl.trim"
                       ng-minlength="$ctrl.minlength"
                       ng-maxlength="$ctrl.maxlength"
                       ng-pattern="$ctrl.pattern"
                       ng-change="$ctrl.onChange({name: $ctrl.name, value: $ctrl.value})">
                <md-input-helper md-content="{{$ctrl.instruction}}"
                                 md-disabled="{{$ctrl.disabled}}"
                                 md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                </md-input-helper>
              </md-list-cell-tile>
            </md-list-cell>`,
  require: {'form': '^^mdForm'},
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.focus = function() {
      ctrl.focused = true;
    };
    ctrl.blur = function() {
      if (ctrl.input && ctrl.input.$viewValue) {
        return;
      }
      ctrl.focused = false;
    };
    ctrl.$postLink = function() {
      ctrl.input = ctrl.form.getInput(ctrl);
      ctrl.focused = false;
      ctrl.instruction = ctrl.instructions['info'];
    };
    ctrl.$doCheck = function() {
      if (ctrl.input) {
        if (ctrl.input.$pristine && ctrl.input.$untouched && ctrl.input.$viewValue) {
          ctrl.focus();
        }
        ctrl.instruction = '';
        if (ctrl.input.$dirty && ctrl.input.$invalid) {
          angular.forEach(ctrl.input.$error, function(value, key) {
            if (value) {
              ctrl.instruction = ctrl.instruction + ' ' + ctrl.instructions[key];
            }
          });
        }
        if (!ctrl.instruction) {
          ctrl.instruction = ctrl.instructions['info'];
        }
      }
    };
  }],
  bindings: {
    label: '<',
    name: '<',
    value: '<',
    onChange: '&',
    required: '<',
    trim: '<',
    minlength: '<',
    maxlength: '<',
    pattern: '<',
    instructions: '<',
    disabled: '<'
  }
});

mdApp.component('mdSelectionInput', {
  template: `<md-list-cell>
              <md-list-cell-tile>
                <md-input-label focus="{{$ctrl.focused}}"
                                md-content="{{$ctrl.label}}"
                                md-disabled="{{$ctrl.disabled}}"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                </md-input-label>
                <button md-button-composite
                        ng-click="$ctrl.onClick({value: $ctrl.value})"
                        ng-disabled="$ctrl.disabled"
                        md-disabled="{{$ctrl.disabled}}"
                        theme="tracking-dark">
                  <md-input-selection name="{{$ctrl.name}}"
                              type="text"
                              md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"
                              ng-blur="$ctrl.blur()"
                              ng-focus="$ctrl.focus()"
                              ng-model="$ctrl.value"
                              ng-model-options="{allowInvalid: false}"
                              ng-disabled="$ctrl.disabled"
                              md-disabled="{{$ctrl.disabled}}"
                              ng-required="$ctrl.required"
                              ng-trim="$ctrl.trim"
                              ng-minlength="$ctrl.minlength"
                              ng-maxlength="$ctrl.maxlength"
                              ng-pattern="$ctrl.pattern"
                              ng-change="$ctrl.change()"
                              md-content="{{$ctrl.display}}"></md-input-selection>
                  <md-input-selection-icon
                              md-content="arrow_drop_down"
                              md-disabled="{{$ctrl.disabled}}"
                              md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-input-selection-icon>
                </button>
                <md-input-helper md-content="{{$ctrl.instruction}}"
                                 md-disabled="{{$ctrl.disabled}}"
                                 md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                </md-input-helper>
              </md-list-cell-tile>
            </md-list-cell>`,
  require: {'form': '^^mdForm'},
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.focus = function() {
      ctrl.focused = true;
    };
    ctrl.blur = function() {
      if (ctrl.input && ctrl.input.$viewValue) {
        return;
      }
      ctrl.focused = false;
    };
    ctrl.$postLink = function() {
      ctrl.input = ctrl.form.getInput(ctrl);
      ctrl.focused = false;
      ctrl.instruction = ctrl.instructions['info'];
    };
    ctrl.$doCheck = function() {
      if (ctrl.input) {
        if (ctrl.input.$viewValue) {
          ctrl.focus();
        }
        ctrl.instruction = '';
        if (ctrl.input.$dirty && ctrl.input.$invalid) {
          angular.forEach(ctrl.input.$error, function(value, key) {
            if (value) {
              ctrl.instruction = ctrl.instruction + ' ' + ctrl.instructions[key];
            }
          });
        }
        if (!ctrl.instruction) {
          ctrl.instruction = ctrl.instructions['info'];
        }
      }
    };
  }],
  bindings: {
    label: '<',
    name: '<',
    value: '<',
    display: '<',
    onChange: '&',
    onClick: '&',
    required: '<',
    trim: '<',
    minlength: '<',
    maxlength: '<',
    pattern: '<',
    instructions: '<',
    disabled: '<'
  }
});

mdApp.component('mdRadioInput', {
  template: `<button md-button-composite
                     ng-click="$ctrl.onSelect({name: $ctrl.name, value: $ctrl.sample})"
                     ng-disabled="$ctrl.disabled"
                     md-disabled="{{$ctrl.disabled}}"
                     name="{{$ctrl.name}}"
                     ng-model="$ctrl.value"
                     ng-required="$ctrl.required"
                     theme="tracking-dark">
              <md-list-cell>
                <md-list-cell-tile lines="{{$ctrl.lines}}" side="left">
                  <md-primary md-content="{{$ctrl.first}}"
                              md-disabled="{{$ctrl.disabled}}"
                              md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-primary>
                  <md-secondary md-content="{{$ctrl.second}}" ng-if="$ctrl.second"
                                md-disabled="{{$ctrl.disabled}}"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-secondary>
                  <md-secondary md-content="{{$ctrl.third}}" ng-if="$ctrl.third"
                                md-disabled="{{$ctrl.disabled}}"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-secondary>
                  <md-actions side="left" lines="{{$ctrl.lines}}" dialog="{{$ctrl.dialog}}">
                    <md-base md-icon md-pad="12"
                             md-fade="{{($ctrl.value !== $ctrl.sample)}}"
                             md-disabled="{{$ctrl.disabled}}"
                             md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">radio_button_checked</md-base>
                  </md-actions>
                  <md-actions side="left" lines="{{$ctrl.lines}}" dialog="{{$ctrl.dialog}}">
                    <md-base md-icon md-pad="12"
                             md-fade="{{($ctrl.value === $ctrl.sample)}}"
                             md-disabled="{{$ctrl.disabled}}"
                             md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">radio_button_unchecked</md-base>
                  </md-actions>
                </md-list-cell-tile>
              </md-list-cell>
            </button>`,
  require: {'form': '^^mdForm'},
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.$postLink = function() {
      ctrl.input = ctrl.form.getInput(ctrl);
    };
    ctrl.$onChanges = function(changes) {
      if (ctrl.first && !ctrl.second && !ctrl.third) {
        ctrl.lines = 1;
      }
      if (ctrl.second && ctrl.second && ctrl.third) {
        ctrl.lines = 3;
      }
      if ((ctrl.first && ctrl.second && !ctrl.third) || (ctrl.first && !ctrl.second && ctrl.third)) {
        ctrl.lines = 2;
      }
    };
  }],
  bindings: {
    name: '<',
    onSelect: '&',
    first: '<',
    second: '<',
    third: '<',
    value: '<',
    sample: '<',
    required: '<',
    disabled: '<'
  }
});

mdApp.component('mdForm', {
  template: `<form md-base
                   name="{{$ctrl.name}}"
                   novalidate
                   ng-transclude>
             </form>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.inputs = {};
    ctrl.submit = function() {
      if ($scope[ctrl.name].$invalid) {
        angular.forEach($scope[ctrl.name], function(value, key) {
          if (typeof value === 'object' && value.hasOwnProperty('$modelValue') && (value.$pristine || value.$untouched)) {
            value.$setDirty();
            value.$setTouched();
          }
        });
        return false;
      } else {
        return true;
        //ctrl.onSubmit({'value': $scope[ctrl.name]});
      }
    };
    ctrl.registerInput = function(input) {
      ctrl.inputs[input.name] = input;
      //ctrl.inputs.push(input);
    };
    ctrl.getInput = function(input) {
      return $scope[ctrl.name][input.name];
    };
    ctrl.$onInit = function() {
      ctrl.onInit({'validator': ctrl.submit});
    };
  }],
  bindings: {
    onInit: '&',
    onSubmit: '&',
    name: '<'
  }
});

/*--------------------------------------------------Composites--------------------------------------------------*/

mdApp.component('mdCartButton', {
  template: `<button md-button-composite md-pad="16"
                     ng-click="$ctrl.onClick({value: $ctrl.value})"
                     ng-disabled="$ctrl.disabled"
                     md-disabled="{{$ctrl.disabled}}"
                     theme="tracking-dark">
              <md-base md-font="body2" md-misc="textCenter" md-disabled="{{$ctrl.disabled}}" md-content="{{$ctrl.name.toUpperCase()}}">
              </md-base>
              <div style="width: 0px;
                          height: 0px;
                          border-left: 72px solid transparent;
                          border-right: 72px solid transparent;
                          border-top: 36px solid rgba(0, 0, 0, 0.54);
                          margin: auto;" md-disabled="{{$ctrl.disabled}}"></div>
            </button>`,
  bindings: {
    name: '<',
    value: '<',
    disabled: '<',
    onClick: '&'
  }
});

mdApp.component('mdCartPage', {
  template: `<md-page vertical-scroll="scroll" top="56px" position="{{$ctrl.position}}" ng-transclude>
            </md-page>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.positionPage = function() {
      ctrl.position = (ctrl.page - ctrl.currentPage) * 100;
    };
    
    ctrl.$onInit = function() {
      ctrl.positionPage();
    };
    
    ctrl.$onChanges = function(changes) {
      if (changes.currentPage && changes.currentPage.currentValue) {
        ctrl.positionPage();
      }
    };
  }],
  bindings: {
    page: '<',
    currentPage: '<'
  }
});

mdApp.component('mdCartDelete', {
  template: `<md-confirmation active="$ctrl.dialog" on-close="$ctrl.onClose({value: $ctrl.delete})">
              <md-base md-pad="24">
                <md-base md-font="title"
                         md-pad="0,0,20,0"
                         md-content="{{$ctrl.settings.modals.cart.delete.title}}"></md-base>
                <md-base md-font="notification"
                         md-content="{{$ctrl.settings.modals.cart.delete.message}}"></md-base>
              </md-base>
              <md-base md-pad="2,4">
                <md-action side="right">
                  <button md-button-text-flat
                          ng-click="$ctrl.cancel()"
                          md-content="{{$ctrl.settings.modals.cart.delete.actions.cancel}}"></button>
                  <button md-button-text-flat
                          ng-click="$ctrl.ok()"
                          md-content="{{$ctrl.settings.modals.cart.delete.actions.ok}}"></button>
                </md-action>
              </md-base>
            </md-confirmation>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.cancel = function() {
      ctrl.delete = false;
      ctrl.dialog = false;
    };
    
    ctrl.ok = function() {
      ctrl.delete = true;
      ctrl.dialog = false;
    };
    
    ctrl.$onInit = function() {
      ctrl.dialog = true;
      ctrl.delete = false;
    };
  }],
  bindings: {
    settings: '<',
    onClose: '&'
  }
});

mdApp.component('mdCartCountries', {
  template: `<md-simple on-close="$ctrl.onSelect({value: $ctrl.option})" active="!$ctrl.option">
              <md-page vertical-scroll="scroll">
                <md-list>
                  <md-list-item-clickable ng-repeat="option in $ctrl.countries.data"
                                          first="option.name"
                                          value="option.code"
                                          sample="$ctrl.sample"
                                          disabled="option.disabled"
                                          dialog="true"
                                          on-click="$ctrl.selectOption(value)">
                  </md-list-item-clickable>
                  <button md-button-composite
                          ng-if="$ctrl.countries.has_more"
                          ng-click="$ctrl.loadMoreCountries()"
                          ng-disabled="$ctrl.disabled"
                          md-disabled="{{$ctrl.disabled}}"
                          theme="tracking-dark">
                    <md-list-cell>
                      <md-list-cell-tile>
                          <md-action side="center">
                            <md-base md-pad="4"
                                     md-icon="avatar"
                                     md-content="refresh"></md-base>
                          </md-action>
                      </md-list-cell-tile>
                    </md-list-cell>
                  </button>
                </md-list>
              </md-page>
            </md-simple>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    var getCountries = function() {
      var remaining = ctrl.settings.countries.length - ctrl.countries.data.length;
      var end;
      if (remaining > 50) {
        end = ctrl.countries.data.length + 50;
        ctrl.countries.has_more = true;
      } else {
        end = ctrl.countries.data.length + remaining;
        ctrl.countries.has_more = false;
      }
      ctrl.countries.data.push.apply(ctrl.countries.data, ctrl.settings.countries.slice(ctrl.countries.data.length, end));
    };
    
    ctrl.loadMoreCountries = function() {
      if (ctrl.countries.has_more) {
        getCountries();
      }
    };
    
    ctrl.selectOption = function(value) {
      ctrl.option = value;
    };
    
    ctrl.$onInit = function() {
      ctrl.option = false;
      ctrl.countries = {'data': [], 'has_more': false};
      getCountries();
    };
  }],
  bindings: {
    settings: '<',
    sample: '<',
    onSelect: '&'
  }
});

mdApp.component('mdCartSummary', {
  template: `<md-cards-item-multiline disabled="true">
              <md-base md-pad="24,16">
                <md-base md-font="headline"
                         md-content="{{$ctrl.cart.amount | formatCurrency:$ctrl.settings.currencies[$ctrl.cart.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.cart.currency.toUpperCase()]}}"></md-base>
                <md-base md-font="secondary" ng-if="$ctrl.cart.id"
                         md-content="{{$ctrl.cart.id}}"></md-base>
              </md-base>
            </md-cards-item-multiline>`,
  bindings: {
    settings: '<',
    cart: '<'
  }
});

mdApp.component('mdCartShippingAddress', {
  template: `<md-cards-item-multiline disabled="true">
              <md-base md-pad="24,16">
                <md-base md-font="headline"
                         md-content="{{$ctrl.cart.shipping.name}}"></md-base>
                <md-base md-font="secondary"
                         md-content="{{$ctrl.cart.shipping.address.line1}}"></md-base>
                <md-base md-font="secondary" ng-if="$ctrl.cart.shipping.address.line2"
                         md-content="{{$ctrl.cart.shipping.address.line2}}"></md-base>
                <md-base md-font="secondary"
                         md-content="{{$ctrl.cart.shipping.address.city + ', ' + $ctrl.cart.shipping.address.state + ', ' + $ctrl.cart.shipping.address.postal_code + ', ' + $ctrl.cart.shipping.address.country}}"></md-base>
                <md-base md-font="secondary"
                         md-content="{{$ctrl.cart.email}}"></md-base>
                <md-base md-font="secondary"
                         md-content="{{$ctrl.cart.shipping.phone}}"></md-base>
              </md-base>
            </md-cards-item-multiline>`,
  bindings: {
    settings: '<',
    cart: '<'
  }
});

mdApp.component('mdCartItemProduct', {
  template: `<md-base md-pad="24,16">
              <md-base md-font="headline"
                       md-content="{{$ctrl.item.description}}"></md-base>
              <md-base md-font="secondary"
                       md-content="{{$ctrl.item.parent}}"></md-base>
              <md-base md-font="notification"
                       md-pad="16,0,0,0"
                       md-content="{{($ctrl.item.amount | formatCurrency:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()]) + '   (' + $ctrl.item.quantity + 'X ' + ($ctrl.item.price | formatCurrency:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()]) + ')'}}"></md-base>
            </md-base>`,
  bindings: {
    settings: '<',
    item: '<'
  }
});

mdApp.component('mdCartItemShipping', {
  template: `<md-base md-pad="24,16">
              <md-base md-font="headline"
                       md-content="{{$ctrl.item.description}}"></md-base>
              <md-base md-font="secondary" ng-if="$ctrl.item.parent"
                       md-content="{{$ctrl.item.parent}}"></md-base>
              <md-base md-font="secondary" ng-if="$ctrl.item.delivery_estimate"
                       md-content="{{$ctrl.item.delivery_estimate}}"></md-base>
              <md-base md-font="notification"
                       md-pad="16,0,0,0"
                       md-content="{{$ctrl.item.amount | formatCurrency:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()]}}"></md-base>
            </md-base>`,
  bindings: {
    settings: '<',
    item: '<'
  }
});

mdApp.component('mdCartItemTax', {
  template: `<md-base md-pad="24,16">
              <md-base md-font="headline"
                       md-content="{{$ctrl.item.description}}"></md-base>
              <md-base md-font="secondary" ng-if="$ctrl.item.parent"
                       md-content="{{$ctrl.item.parent}}"></md-base>
              <md-base md-font="notification"
                       md-pad="16,0,0,0"
                       md-content="{{$ctrl.item.amount | formatCurrency:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()]}}"></md-base>
            </md-base>`,
  bindings: {
    settings: '<',
    item: '<'
  }
});

mdApp.component('mdCartItemDiscount', {
  template: `<md-base md-pad="24,16">
              <md-base md-font="headline"
                       md-content="{{$ctrl.item.description}}"></md-base>
              <md-base md-font="secondary" ng-if="$ctrl.item.parent"
                       md-content="{{$ctrl.item.parent}}"></md-base>
              <md-base md-font="notification"
                       md-pad="16,0,0,0"
                       md-content="{{$ctrl.item.amount | formatCurrency:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.item.currency.toUpperCase()]}}"></md-base>
            </md-base>`,
  bindings: {
    settings: '<',
    item: '<'
  }
});

mdApp.component('mdCartItemView', {
  template: `<md-cards-item-multiline disabled="true">
              <md-cart-item-product ng-if="($ctrl.value.type === 'sku')"
                                    settings="$ctrl.settings"
                                    item="$ctrl.value"></md-cart-item-product>
              <md-cart-item-shipping ng-if="($ctrl.value.type === 'shipping')"
                                     settings="$ctrl.settings"
                                     item="$ctrl.value"></md-cart-item-shipping>
              <md-cart-item-tax ng-if="($ctrl.value.type === 'tax')"
                                settings="$ctrl.settings"
                                item="$ctrl.value"></md-cart-item-tax>
              <md-cart-item-discount ng-if="($ctrl.value.type === 'discount')"
                                     settings="$ctrl.settings"
                                     item="$ctrl.value"></md-cart-item-discount>
            </md-cards-item-multiline>`,
  bindings: {
    settings: '<',
    value: '<'
  }
});

mdApp.component('mdCartItemClickable', {
  template: `<md-cards-item-multiline-clickable value="$ctrl.value"
                                                on-click="$ctrl.onClick({productId: value.product, skuId: value.parent})">
              <md-cart-item-product ng-if="($ctrl.value.type === 'sku')"
                                    settings="$ctrl.settings"
                                    item="$ctrl.value"></md-cart-item-product>
              <md-cart-item-shipping ng-if="($ctrl.value.type === 'shipping')"
                                     settings="$ctrl.settings"
                                     item="$ctrl.value"></md-cart-item-shipping>
              <md-cart-item-tax ng-if="($ctrl.value.type === 'tax')"
                                settings="$ctrl.settings"
                                item="$ctrl.value"></md-cart-item-tax>
              <md-cart-item-discount ng-if="($ctrl.value.type === 'discount')"
                                     settings="$ctrl.settings"
                                     item="$ctrl.value"></md-cart-item-discount>
            </md-cards-item-multiline-clickable>`,
  bindings: {
    settings: '<',
    value: '<',
    onClick: '&'
  }
});

mdApp.component('mdCartEmpty', {
  template: `<md-cart-page page="-1" current-page="$ctrl.step">
              <md-list>
                <md-list-item-multiline>
                  <md-base md-font="display1" md-misc="textCenter" md-pad="0,24" md-content="{{$ctrl.settings.modals.cart.steps.zero}}">
                  </md-base>
                </md-list-item-multiline>
              </md-list>
            </md-cart-page>`,
  bindings: {
    settings: '<',
    step: '<'
  }
});

mdApp.component('mdCartProducts', {
  template: `<md-cart-page page="1" current-page="$ctrl.step">
              <md-cards>
                <md-cart-item-clickable ng-repeat="item in $ctrl.cart.items"
                                        value="item"
                                        settings="$ctrl.settings"
                                        on-click="$ctrl.onSelect({productId: productId, skuId: skuId})">
                </md-cart-item-clickable>
                <md-cart-summary settings="$ctrl.settings"
                                 cart="$ctrl.cart">
                </md-cart-summary>
              </md-cards>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.one"
                              on-click="$ctrl.onSubmit()"></md-cart-button>
            </md-cart-page>`,
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    onSelect: '&',
    onSubmit: '&'
  }
});

mdApp.component('mdCartShipping', {
  template: `<md-cart-page page="2" current-page="$ctrl.step">
              <md-list>
                <md-list-subheader md-content="{{$ctrl.settings.modals.cart.shipping.label}}"></md-list-subheader>
                <md-form name="'cartShippingForm'" on-init="$ctrl.register(validator)">
                  <md-selection-input name="'country'"
                                      required="true"
                                      trim="true"
                                      disabled="$ctrl.disabled"
                                      label="$ctrl.settings.modals.cart.shipping.address.country.label"
                                      instructions="$ctrl.settings.modals.cart.shipping.address.country.instructions"
                                      value="$ctrl.cart.shipping.address.country"
                                      display="$ctrl.cart.shipping.address.country | formatCountry:$ctrl.settings.countries"
                                      on-click="$ctrl.onOpenCountries({value: value})"></md-selection-input>
                  <md-text-input name="'state'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.address.state.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.state.instructions"
                                 value="$ctrl.cart.shipping.address.state"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'city'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.address.city.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.city.instructions"
                                 value="$ctrl.cart.shipping.address.city"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'postal_code'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.address.postal_code.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.postal_code.instructions"
                                 value="$ctrl.cart.shipping.address.postal_code"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'line1'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.address.line1.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.line1.instructions"
                                 value="$ctrl.cart.shipping.address.line1"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'line2'"
                                 required="false"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.address.line2.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.line2.instructions"
                                 value="$ctrl.cart.shipping.address.line2"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'name'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.name.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.name.instructions"
                                 value="$ctrl.cart.shipping.name"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'email'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.email.label"
                                 instructions="$ctrl.settings.modals.cart.email.instructions"
                                 value="$ctrl.cart.email"
                                 pattern="$ctrl.validEmail"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'phone'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.shipping.phone.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.phone.instructions"
                                 value="$ctrl.cart.shipping.phone"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                </md-form>
              </md-list>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.two"
                              disabled="$ctrl.disabled"
                              on-click="$ctrl.submit()"></md-cart-button>
            </md-cart-page>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.validEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    ctrl.validPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    
    ctrl.register = function(validator) {
      ctrl.validate = validator;
    };
    
    ctrl.submit = function() {
      if (ctrl.validate()) {
        ctrl.onSubmit();
      }
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    disabled: '<',
    onOpenCountries: '&',
    onUpdate: '&',
    onSubmit: '&'
  }
});

mdApp.component('mdCartShippingMethods', {
  template: `<md-cart-page page="3" current-page="$ctrl.step">
              <md-list>
                <md-list-subheader md-content="{{$ctrl.settings.modals.cart.shipping_methods.label}}"></md-list-subheader>
                <md-form name="'cartShippingMethodsForm'" on-init="$ctrl.register(validator)">
                  <md-radio-input ng-repeat="item in $ctrl.cart.shipping_methods"
                                  name="'shipping_method'"
                                  value="$ctrl.cart.selected_shipping_method"
                                  sample="item.id"
                                  first="item.amount | formatCurrency:$ctrl.settings.currencies[item.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[item.currency.toUpperCase()]"
                                  second="item.description"
                                  disabled="$ctrl.disabled"
                                  on-select="$ctrl.onUpdate({name: name, value: value})"></md-radio-input>
                </md-form>
              </md-list>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.three"
                              disabled="$ctrl.disabled"
                              on-click="$ctrl.submit()"></md-cart-button>
            </md-cart-page>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.register = function(validator) {
      ctrl.validate = validator;
    };
    
    ctrl.submit = function() {
      if (ctrl.validate()) {
        ctrl.onSubmit();
      }
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    disabled: '<',
    onUpdate: '&',
    onSubmit: '&'
  }
});

mdApp.component('mdCartReview', {
  template: `<md-cart-page page="4" current-page="$ctrl.step">
              <md-cards>
                <md-cart-shipping-address settings="$ctrl.settings"
                                          cart="$ctrl.cart">
                </md-cart-shipping-address>
                <md-cart-item-view ng-repeat="item in $ctrl.cart.items"
                                   value="item"
                                   settings="$ctrl.settings">
                </md-cart-item-view>
                <md-cart-summary settings="$ctrl.settings"
                                 cart="$ctrl.cart">
                </md-cart-summary>
              </md-cards>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.four"
                              on-click="$ctrl.onSubmit()"></md-cart-button>
            </md-cart-page>`,
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    onSubmit: '&'
  }
});

mdApp.component('mdCartPay', {
  template: `<md-cart-page page="5" current-page="$ctrl.step">
              <md-list>
                <md-form name="'cartPaymentForm'" on-init="$ctrl.register(validator)">
                  <md-text-input name="'number'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.card.number.label"
                                 instructions="$ctrl.settings.modals.cart.card.number.instructions"
                                 value="$ctrl.cart.card.number"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'exp_month'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.card.exp_month.label"
                                 instructions="$ctrl.settings.modals.cart.card.exp_month.instructions"
                                 value="$ctrl.cart.card.exp_month"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'exp_year'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.card.exp_year.label"
                                 instructions="$ctrl.settings.modals.cart.card.exp_year.instructions"
                                 value="$ctrl.cart.card.exp_year"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-text-input name="'cvc'"
                                 required="true"
                                 trim="true"
                                 disabled="$ctrl.disabled"
                                 label="$ctrl.settings.modals.cart.card.cvc.label"
                                 instructions="$ctrl.settings.modals.cart.card.cvc.instructions"
                                 value="$ctrl.cart.card.cvc"
                                 on-change="$ctrl.onUpdate({name: name, value: value})"></md-text-input>
                  <md-list-item-multiline>
                    <md-action side="center">
                      <button md-button-text-raised
                              md-raised="{{!$ctrl.disabled}}"
                              ng-disabled="$ctrl.disabled"
                              md-disabled="{{$ctrl.disabled}}"
                              md-content="{{$ctrl.settings.modals.cart.steps.five + ' ' + ($ctrl.cart.amount | formatCurrency:$ctrl.settings.currencies[$ctrl.cart.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.cart.currency.toUpperCase()])}}"
                              ng-click="$ctrl.submit()"></button>
                    </md-action>
                  </md-list-item-multiline>
                </md-form>
              </md-list>
            </md-cart-page>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.validEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    ctrl.validPhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    
    ctrl.register = function(validator) {
      ctrl.validate = validator;
    };
    
    ctrl.submit = function() {
      if (ctrl.validate()) {
        ctrl.onSubmit();
      }
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    disabled: '<',
    onUpdate: '&',
    onSubmit: '&'
  }
});

mdApp.component('mdCartEnd', {
  template: `<md-cart-page page="6" current-page="$ctrl.step">
              <md-cards>
                <md-cart-shipping-address settings="$ctrl.settings"
                                          cart="$ctrl.cart">
                </md-cart-shipping-address>
                <md-cart-item-view ng-repeat="item in $ctrl.cart.items"
                                   value="item"
                                   settings="$ctrl.settings">
                </md-cart-item-view>
                <md-cart-summary settings="$ctrl.settings"
                                 cart="$ctrl.cart">
                </md-cart-summary>
              </md-cards>
            </md-cart-page>`,
  bindings: {
    settings: '<',
    cart: '<',
    step: '<'
  }
});

mdApp.component('mdCart', {
  template: `<md-full-screen side="'right'" active="$ctrl.dialog" on-close="$ctrl.onExit()">
              <md-app-bar>
                <md-app-icon icon="'shopping_cart'"></md-app-icon>
                <md-actions side="left" lines="4">
                  <button md-button-icon-flat
                          md-content="arrow_back"
                          ng-disabled="$ctrl.disabled"
                          md-disabled="{{$ctrl.disabled}}"
                          ng-click="$ctrl.closeCart()"></button>
                </md-actions>
                <md-actions side="right" lines="4" ng-if="(($ctrl.step > 0) && ($ctrl.step < 6))">
                  <button md-button-icon-flat
                          md-content="delete"
                          ng-disabled="$ctrl.disabled"
                          md-disabled="{{$ctrl.disabled}}"
                          ng-click="$ctrl.deleteDialog = true"></button>
                </md-actions>
              </md-app-bar>
              <md-cart-empty settings="$ctrl.settings"
                             step="$ctrl.step"
                             ng-if="($ctrl.step < 2)"></md-cart-empty>
              <md-cart-products settings="$ctrl.settings"
                                ng-if="(($ctrl.step > -1) && ($ctrl.step < 3))"
                                step="$ctrl.step"
                                cart="$ctrl.cart"
                                on-select="$ctrl.onOpenProduct({productId: productId, skuId: skuId})"
                                on-submit="$ctrl.stepTwo()"></md-cart-products>
              <md-cart-shipping settings="$ctrl.settings"
                                ng-if="(($ctrl.step > 0) && ($ctrl.step < 4))"
                                step="$ctrl.step"
                                cart="$ctrl.cart"
                                disabled="$ctrl.disabled"
                                on-open-countries="$ctrl.openCountries({value: value})"
                                on-update="$ctrl.updateCart(name, value)"
                                on-submit="$ctrl.stepThree()"></md-cart-shipping>
              <md-cart-shipping-methods settings="$ctrl.settings"
                                        ng-if="(($ctrl.step > 1) && ($ctrl.step < 5))"
                                        step="$ctrl.step"
                                        cart="$ctrl.cart"
                                        disabled="$ctrl.disabled"
                                        on-update="$ctrl.updateCart(name, value)"
                                        on-submit="$ctrl.stepFour()"></md-cart-shipping-methods>
              <md-cart-review settings="$ctrl.settings"
                              ng-if="(($ctrl.step > 2) && ($ctrl.step < 6))"
                              step="$ctrl.step"
                              cart="$ctrl.cart"
                              on-submit="$ctrl.stepFive()"></md-cart-review>
              <md-cart-pay settings="$ctrl.settings"
                           ng-if="(($ctrl.step > 3) && ($ctrl.step < 7))"
                           step="$ctrl.step"
                           cart="$ctrl.cart"
                           disabled="$ctrl.disabled"
                           on-update="$ctrl.updateCart(name, value)"
                           on-submit="$ctrl.stepSix()"></md-cart-pay>
              <md-cart-end settings="$ctrl.settings"
                           ng-if="($ctrl.step > 4)"
                           step="$ctrl.step"
                           cart="$ctrl.order"></md-cart-end>
            </md-full-screen>
            <md-cart-delete settings="$ctrl.settings"
                            on-close="$ctrl.deleteCart(value)"
                            ng-if="$ctrl.deleteDialog"></md-cart-delete>
            <md-cart-countries settings="$ctrl.settings"
                               sample="$ctrl.selectedCountry"
                               ng-if="$ctrl.countriesDialog"
                               on-select="$ctrl.selectCountry(value)"></md-cart-countries>`,
  controller: ['$scope', '$element', '$attrs', '$timeout', 'mdCartFactory', 'mdIntercomFactory', function($scope, $element, $attrs, $timeout, mdCartFactory, mdIntercomFactory) {
    var ctrl = this;
    
    ctrl.closeCart = function() {
      ctrl.dialog = false;
    };
    
    ctrl.deleteCart = function(value) {
      ctrl.deleteDialog = false;
      if (value) {
        ctrl.disabled = true;
        mdCartFactory.deleteCart(function(response) {
          ctrl.disabled = false;
          ctrl.cart = mdCartFactory.getCart();
          mdIntercomFactory.get('error')(response);
        });
      }
    };
    
    ctrl.openCountries = function(value) {
      ctrl.selectedCountry = value;
      ctrl.countriesDialog = true;
    };
    
    ctrl.updateCart = function(name, value) {
      mdCartFactory.updateCart(name, value);
      ctrl.cart = mdCartFactory.getCart();
    };
    
    ctrl.selectCountry = function(value) {
      if (value) {
        ctrl.updateCart('country', value);
      }
      ctrl.countriesDialog = false;
    };
    
    ctrl.stepTwo = function() {
      $timeout(function() {ctrl.step = 2;}, 0);
    };
    
    ctrl.stepThree = function() {
      ctrl.disabled = true;
      mdCartFactory.saveCart(function(response) {
        if ((response.status > 199) && (response.status < 300)) {
          ctrl.cart = mdCartFactory.getCart();
          $timeout(function() {ctrl.step = 3;}, 0);
        }
        ctrl.disabled = false;
        mdIntercomFactory.get('error')(response);
      });
    };
    
    ctrl.stepFour = function() {
      ctrl.disabled = true;
      mdCartFactory.saveCart(function(response) {
        if ((response.status > 199) && (response.status < 300)) {
          ctrl.cart = mdCartFactory.getCart();
          $timeout(function() {ctrl.step = 4;}, 0);
        }
        ctrl.disabled = false;
        mdIntercomFactory.get('error')(response);
      });
    };
    
    ctrl.stepFive = function() {
      $timeout(function() {ctrl.step = 5;}, 0);
    };
    
    ctrl.stepSix = function() {
      ctrl.disabled = true;
      mdCartFactory.payCart(function(response) {
        if ((response.status > 199) && (response.status < 300)) {
          ctrl.order = mdCartFactory.getCart();
          mdCartFactory.createCart(function(response) {
            mdIntercomFactory.get('error')(response);
          });
          ctrl.cart = mdCartFactory.getCart();
          $timeout(function() {ctrl.step = 6;}, 0);
        }
        ctrl.disabled = false;
        mdIntercomFactory.get('error')(response);
      });
    };
    
    ctrl.$onInit = function() {
      ctrl.cart = mdCartFactory.getCart();
      if (ctrl.cart.status === 'new') {
        if (ctrl.cart.items.length > 0) {
          ctrl.step = 1;
        } else {
          ctrl.step = -1;
        }
      } else if (ctrl.cart.status === 'created') {
        if (ctrl.cart.shipping_methods.length > 0) {
          ctrl.step = 3;
        } else {
          ctrl.step = 4;
        }
      } else if (ctrl.cart.status === 'paid') {
        ctrl.step = 6;
      }
      ctrl.disabled = false;
      ctrl.dialog = true;
      ctrl.deleteDialog = false;
      ctrl.countriesDialog = false;
    };
    
    ctrl.$doCheck = function() {
      if (ctrl.cart.status === 'new') {
        if (ctrl.cart.items.length === 0) {
          ctrl.step = -1;
        }
      } else if (ctrl.cart.status === 'created') {
        if ((ctrl.cart.shipping_methods.length === 0) && (ctrl.step === 3)) {
          ctrl.step = 4;
        }
      }
    };
  }],
  bindings: {
    settings: '<',
    onOpenProduct: '&',
    onExit: '&'
  }
});

mdApp.component('mdSkuQuantity', {
  template: `<md-list-cell>
                  <input name="{{$ctrl.name}}"
                         type="text"
                         readonly
                         md-input-number
                         md-pad="4,56"
                         md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"
                         ng-model="$ctrl.value"
                         ng-model-options="{allowInvalid: false}"
                         ng-disabled="$ctrl.disabled"
                         md-disabled="{{$ctrl.disabled}}"
                         ng-required="$ctrl.required"
                         ng-trim="$ctrl.trim"
                         ng-min="$ctrl.min"
                         ng-max="$ctrl.max"
                         ng-step="$ctrl.step"
                         ng-change="$ctrl.qchange()">
                <md-actions side="left">
                  <button md-button-icon-flat md-content="remove_shopping_cart" ng-click="$ctrl.remove()"
                          md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></button>
                </md-actions>
                <md-actions side="right">
                  <button md-button-icon-flat md-content="add_shopping_cart" ng-click="$ctrl.add()"
                          md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></button>
                </md-actions>
            </md-list-cell>`,
  require: {'form': '^^mdForm'},
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.$postLink = function() {
      ctrl.input = ctrl.form.getInput(ctrl);
    };
    ctrl.$onInit = function() {
      if (isNaN(ctrl.min)) {
        ctrl.min = 0;
      }
      if (isNaN(ctrl.max)) {
        ctrl.max = Infinity;
      }
      if (isNaN(ctrl.step)) {
        ctrl.step = 1;
      }
      if (isNaN(ctrl.value)) {
        if (ctrl.required) {
          ctrl.value = ctrl.min;
        } else {
          ctrl.value = '';
        }
      }
      ctrl.onChange({'name': ctrl.name, 'value': ctrl.value});
    };
    ctrl.add = function() {
      ctrl.value = parseFloat(ctrl.value) + parseFloat(ctrl.step);
      ctrl.check();
      ctrl.onChange({'name': ctrl.name, 'value': ctrl.value});
    };
    ctrl.remove = function() {
      ctrl.value = parseFloat(ctrl.value) - parseFloat(ctrl.step);
      ctrl.check();
      ctrl.onChange({'name': ctrl.name, 'value': ctrl.value});
    };
    ctrl.check = function() {
      ctrl.value = parseFloat(ctrl.value);
      if (isNaN(ctrl.value)) {
        ctrl.value = ctrl.min;
      } else {
        if (ctrl.value < ctrl.min) {
          if (ctrl.required) {
            ctrl.value = ctrl.min;
          } else {
            ctrl.value = '';
          }
        } else if (ctrl.value > ctrl.max) {
          ctrl.value = ctrl.max;
        }
      }
    };
  }],
  bindings: {
    name: '<',
    value: '<',
    onChange: '&',
    required: '<',
    trim: '<',
    min: '<',
    max: '<',
    step: '<'
  }
});

mdApp.component('mdSkuAttributeOptions', {
  template: `<md-drawer-wide on-close="$ctrl.onSelect({attribute: $ctrl.attribute, option: $ctrl.option})" active="!$ctrl.option">
              <md-page vertical-scroll="scroll">
                <md-list>
                  <md-list-subheader md-content="{{$ctrl.attribute}}"></md-list-subheader>
                  <md-list-item-clickable ng-repeat="option in $ctrl.options"
                                          first="option.name"
                                          value="option.name"
                                          sample="$ctrl.attributes[$ctrl.attribute]"
                                          disabled="option.disabled"
                                          on-click="$ctrl.selectOption(value)">
                  </md-list-item-clickable>
                </md-list>
              </md-page>
            </md-drawer-wide>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    var getOptions = function(product, skuAttributes, attribute) {
      var skus = [];
      var options = [];
      var skuAttributesCopy = angular.merge({}, skuAttributes);
      delete skuAttributesCopy[attribute];
      angular.forEach(product.skus.data, function(sku) {
        var matched = true;
        angular.forEach(skuAttributesCopy, function(value, key) {
          if (sku.attributes[key] !== value) {
            matched = false;
          }
        });
        if (matched) {
          skus.push(sku);
        }
      });
      angular.forEach(skus, function(sku) {
        //var inventory = formatInventoryFilter(sku.inventory);
        var inventory = 1;
        var option = {
          'name': sku.attributes[attribute],
          'disabled': (!sku.active || (inventory === 0))
        };
        options.push(option);
      });
      return options;
    };
    
    ctrl.selectOption = function(value) {
      ctrl.option = value;
    };
    
    ctrl.$onInit = function() {
      ctrl.option = false;
      ctrl.options = getOptions(ctrl.product, ctrl.attributes, ctrl.attribute);
    };
  }],
  bindings: {
    product: '<',
    attributes: '<',
    attribute: '<',
    onSelect: '&'
  }
});

mdApp.component('mdSkuAttributes', {
  template: `<md-list md-seam>
              <md-list-item-clickable ng-repeat="(name, value) in $ctrl.attributes"
                                      first="name"
                                      second="value"
                                      value="name"
                                      icon="'chevron_right'"
                                      icon-position="'right'"
                                      on-click="$ctrl.onSelect({value: value})"></md-list-item-clickable>
            </md-list>`,
  bindings: {
    attributes: '<',
    onSelect: '&'
  }
});

mdApp.component('mdProductInfo', {
  template: `<md-list md-seam>
              <md-list-item-multiline>
                <md-base md-font="headline" md-content="{{$ctrl.name}}"></md-base>
                <md-base md-font="secondary" md-pad="0,0,16,0" md-content="{{$ctrl.id}}"></md-base>
                <md-base md-font="body1" md-content="{{$ctrl.description}}" ng-if="$ctrl.description"></md-base>
              </md-list-item-multiline>
              <md-list-item first="$ctrl.price"
                            second="$ctrl.inventory">
              </md-list-item>
            </md-list>`,
  bindings: {
    name: '<',
    id: '<',
    description: '<',
    price: '<',
    inventory: '<'
  }
});

mdApp.component('mdProductImageSlider', {
  template: `<md-carousel-frame md-get-height="-124" md-set-height="{{mdGetHeight}}" md-get-width>
              <md-carousel-action side="left">
                <button md-button-composite theme="tracking-dark" ng-click="$ctrl.rewind()">
                  <md-base md-icon="avatar" md-pad="12" md-content="chevron_left"></md-bsae>
                </button>
              </md-carousel-action>
              <md-carousel-action side="right">
                <button md-button-composite theme="tracking-dark" ng-click="$ctrl.forward()">
                  <md-base md-icon="avatar" md-pad="12" md-content="chevron_right"></md-bsae>
                </button>
              </md-carousel-action>
              <md-carousel index="{{$ctrl.images.length}}" position="{{$ctrl.position}}" ng-swipe-left="$ctrl.forward()" ng-swipe-right="$ctrl.rewind()">
                <md-carousel-cell ng-repeat="item in $ctrl.images"
                                  md-width="{{mdCarouselWidth}}"
                                  md-height="{{mdGetHeight}}">
                  <img md-img
                       ng-src="{{item}}"
                       md-width="{{mdCarouselWidth}}"
                       md-height="{{mdGetHeight}}">
                </md-carousel-cell>
              </md-carousel>
            </md-carousel-frame>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    var getImages = function(skuImage, productImages) {
      var images = [];
      if (skuImage) {
        images.push(skuImage);
      }
      if (productImages.length) {
        angular.forEach(productImages, function(image) {
          if (image !== skuImage) {
            images.push(image);
          }
        });
      }
      return images;
    };
    ctrl.$onInit = function() {
      ctrl.images = getImages(ctrl.skuImage, ctrl.productImages);
      ctrl.position = 0;
    };
    ctrl.$onChanges = function(changes) {
      if (changes.skuImage || changes.productImages) {
        ctrl.images = getImages(ctrl.skuImage, ctrl.productImages);
        ctrl.position = 0;
      }
    };
    ctrl.forward = function() {
      if ((ctrl.position + 1) < ctrl.images.length) {
        ctrl.position = ctrl.position + 1;
      }
    };
    ctrl.rewind = function() {
      if ((ctrl.position - 1) >= 0) {
        ctrl.position = ctrl.position - 1;
      }
    };
  }],
  bindings: {
    skuImage: '<',
    productImages: '<'
  }
});

mdApp.component('mdProduct', {
  template: `<md-full-screen-fade active="$ctrl.dialog" on-close="$ctrl.onExit()">
              <md-actions side="left" lines="4">
                <button md-button-icon-flat md-content="close" ng-click="$ctrl.closeProduct()"></button>
              </md-actions>
              <md-page vertical-scroll="scroll" ng-if="$ctrl.sku">
                <md-form name="'productForm'">
                  <md-product-image-slider sku-image="$ctrl.sku.image"
                                           product-images="$ctrl.product.images"
                                           ng-if="($ctrl.product.images.length || $ctrl.sku.image)"></md-product-image-slider>
                  <md-product-info name="$ctrl.product.name"
                                   description="$ctrl.product.description"
                                   id="$ctrl.sku.id"
                                   price="$ctrl.sku.price | formatCurrency:$ctrl.settings.currencies[$ctrl.sku.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[$ctrl.sku.currency.toUpperCase()]"
                                   inventory="$ctrl.sku.inventory | formatAvailability:$ctrl.settings.modals.product.inventory"></md-product-info>
                  <md-sku-attributes attributes="$ctrl.sku.attributes" ng-if="$ctrl.sku.attributes"
                                       on-select="$ctrl.openOptions(value)"></md-sku-attributes>
                  <md-list>
                    <md-sku-quantity name="'quantity'"
                                     min="0"
                                     max="$ctrl.sku.inventory | formatInventory"
                                     step="1"
                                     required="true"
                                     value="$ctrl.skuQuantity"
                                     on-change="$ctrl.updateQuantity(value)"></md-sku-quantity>
                  </md-list>
                </md-form>
              </md-page>
            </md-full-screen-fade>
            <md-sku-attribute-options ng-if="$ctrl.attribute"
                                      product="$ctrl.product"
                                      attributes="$ctrl.sku.attributes"
                                      attribute="$ctrl.attribute"
                                      on-select="$ctrl.switchSku(attribute, option)"></md-sku-attribute-options>`,
  controller: ['$scope', '$element', '$attrs', '$http', 'mdCartFactory', 'mdIntercomFactory',  function($scope, $element, $attrs, $http, mdCartFactory, mdIntercomFactory) {
    var ctrl = this;
    
    var getSku = function(product, skuId, skuAttributes) {
      var result = {};
      angular.forEach(product.skus.data, function(sku) {
        if (angular.equals({}, result)) {
          if (sku.active) {
            if (!skuId && !skuAttributes) {
              result = angular.merge({}, sku);
            } else if (skuId) {
              if (skuId === sku.id) {
                result = angular.merge({}, sku);
              }
            } else if (skuAttributes) {
              result = angular.merge({}, sku);
              angular.forEach(skuAttributes, function(value, key) {
                if (sku.attributes[key] !== value) {
                  result = {};
                }
              });
            }
          }
        }
      });
      return angular.equals({}, result) ? false : result;
    };
    
    ctrl.updateQuantity = function(quantity) {
      var value = {
        'type': 'sku',
        'parent': ctrl.sku.id,
        'quantity': quantity,
        'amount': (ctrl.sku.price * quantity),
        'price': ctrl.sku.price,
        'currency': ctrl.sku.currency,
        'description': ctrl.product.name,
        'product': ctrl.product.id
      };
      mdCartFactory.updateCart('items', value);
      ctrl.skuQuantity = mdCartFactory.getCartItemQuantity(ctrl.sku.id);
    };
    
    ctrl.switchSku = function(attribute, option) {
      if (option) {
        var skuAttributes = angular.merge({}, ctrl.sku.attributes);
        skuAttributes[attribute] = option;
        var sku = getSku(ctrl.product, false, skuAttributes);
        if (sku) {
          ctrl.sku = sku;
          ctrl.skuQuantity = mdCartFactory.getCartItemQuantity(ctrl.sku.id);
        }
      }
      ctrl.attribute = false;
    };
    
    ctrl.openOptions = function(attribute) {
      ctrl.attribute = attribute;
    };
    
    ctrl.closeProduct = function() {
      ctrl.dialog = false;
    };
    
    ctrl.$onInit = function() {
      ctrl.dialog = true;
      //ctrl.sku = false;
      ctrl.attribute = false;
      if (ctrl.productId) {
        $http.get('product/' + ctrl.productId.toString(), {'cache': true}).then(function(response) {
          ctrl.product = response.data;
          if (ctrl.product && ctrl.product.active) {
            var sku = getSku(ctrl.product, ctrl.skuId);
            if (sku) {
              ctrl.sku = sku;
              ctrl.skuQuantity = mdCartFactory.getCartItemQuantity(ctrl.sku.id);
            }
          }
        }, mdIntercomFactory.get('error'));
      }
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
    
  }],
  bindings: {
    settings: '<',
    productId: '<',
    skuId: '<',
    onExit: '&'
  }
});

mdApp.component('mdProducts', {
  template: `<md-wall min-item-width="240">
              <md-wall-item-multiline-clickable md-width="mdWall.itemWidth" ng-repeat="product in $ctrl.products.data" value="product" on-click="$ctrl.onSelect({productId: value.id, skuId: false})">
                <img md-base ng-if="product.images.length"
                     ng-src="{{product.images[0]}}"
                     width="100%">
                <md-base md-pad="24,16">
                  <md-base md-font="headline" md-content="{{product.name}}"></md-base>
                  <md-base md-font="body1" md-misc="textTrim" md-content="{{product.description}}" ng-if="product.description"></md-base>
                </md-base>
              </md-wall-item-multiline-clickable>
              <div md-clear></div>
              <md-cards-item-multiline-clickable ng-if="$ctrl.products.has_more" on-click="$ctrl.loadMoreProducts()">
                <md-base md-pad="4"
                         md-icon="avatar"
                         md-content="refresh"></md-base>
              </md-cards-item-multiline-clickable>
            </md-wall>`,
  controller: ['$scope', '$element', '$attrs', '$http', 'mdIntercomFactory',  function($scope, $element, $attrs, $http, mdIntercomFactory) {
    var ctrl = this;
    
    var getProducts = function(products) {
      var query = '';
      if (products.has_more) {
        query = '?start=' + products.data[products.data.length - 1]['id'];
      }
      $http.get('products' + query, {'cache': true}).then(function(response) {
        products.data.push.apply(products.data, response.data.data);
        products.has_more = response.data.has_more;
      }, mdIntercomFactory.get('error'));
    };
    
    ctrl.loadMoreProducts = function() {
      if (ctrl.products.has_more) {
        getProducts(ctrl.products);
      }
    };
    
    ctrl.$onInit = function() {
      ctrl.products = {'data': [], 'has_more': false};
      getProducts(ctrl.products);
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    onSelect: '&'
  }
});

mdApp.component('mdHome', {
  template: `<md-full-screen>
              <md-app-bar>
                <md-app-logo img-width="'24px'"
                             img-height="'24px'"
                             img-src="$ctrl.settings.account.business_logo"
                             img-alt="$ctrl.settings.account.business_name">
                </md-app-logo>
                <md-actions side="right" lines="4">
                  <button md-button-icon-flat md-content="shopping_cart" ng-click="$ctrl.openCart()"></button>
                </md-actions>
              </md-app-bar>
              <md-page vertical-scroll="scroll" top="56px">
                <md-products settings="$ctrl.settings"
                             on-select="$ctrl.openProduct(productId, skuId)"></md-products>
              </md-page>
            </md-full-screen>
            <md-cart settings="$ctrl.settings"
                     cart="$ctrl.cart"
                     ng-if="$ctrl.cartDialog"
                     on-open-product="$ctrl.openProduct(productId, skuId)"
                     on-exit="$ctrl.closeCart()"></md-cart>
            <md-product settings="$ctrl.settings"
                        product-id="$ctrl.productId"
                        sku-id="$ctrl.skuId"
                        ng-if="$ctrl.productId"
                        on-exit="$ctrl.closeProduct()"></md-product>
            <md-brief message="$ctrl.message" ng-if="$ctrl.message" on-hide="$ctrl.eraseMessage()"></md-brief>`,
  controller: ['$scope', '$element', '$attrs', '$http', 'mdCartFactory', 'mdIntercomFactory', function($scope, $element, $attrs, $http, mdCartFactory, mdIntercomFactory) {
    var ctrl = this;
    
    ctrl.openProduct = function(productId, skuId) {
      ctrl.productId = productId;
      ctrl.skuId = skuId;
    };
    
    ctrl.closeProduct = function() {
      ctrl.productId = false;
      ctrl.skuId = false;
    };
    
    ctrl.openCart = function() {
      ctrl.cartDialog = true;
    };
    
    ctrl.closeCart = function() {
      ctrl.cartDialog = false;
    };
    
    ctrl.eraseMessage = function() {
      ctrl.message = false;
    };
    
    ctrl.$onInit = function() {
      mdIntercomFactory.register('error', function(response) {
        if (response.data && response.data.error && ctrl.settings.errors[response.data.error]) {
          ctrl.message = ctrl.settings.errors[response.data.error];
        } else if (response.status && ctrl.settings.errors[response.status.toString()]) {
          ctrl.message = ctrl.settings.errors[response.status.toString()];
        }
      });
      ctrl.message = false;
      ctrl.productId = false;
      ctrl.cartDialog = false;
      $http.get('app/settings.json', {'cache': true}).then(function(response) {
        ctrl.settings = response.data;
        $http.get('app/currency.json', {'cache': true}).then(function(response) {
          ctrl.settings.currencies = response.data;
        }, mdIntercomFactory.get('error'));
        $http.get('app/countries.json', {'cache': true}).then(function(response) {
          ctrl.settings.countries = response.data.list;
        }, mdIntercomFactory.get('error'));
        $http.get('account', {'cache': true}).then(function(response) {
          ctrl.settings.account = response.data;
        }, mdIntercomFactory.get('error'));
        mdCartFactory.createCart(function(response) {
          mdIntercomFactory.get('error')(response);
        });
      }, mdIntercomFactory.get('error'));
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
  }
});

mdApp.controller('AppController', ['$scope', '$http', function($scope, $http) {
  
  $http.get('app/settings.json', {'cache': true}).then(function(response) {
    $scope.settings = response.data;
    $http.get('account', {'cache': true}).then(function(response) {
      $scope.settings.account = response.data;
      Stripe.setPublishableKey($scope.settings.account.public_key);
    });
  });
  
}]);

})();