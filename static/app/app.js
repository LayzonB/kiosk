(function() {
  'use strict';

/*--------------------------------------------------App--------------------------------------------------*/

var dataLayer = [];

var mdApp = angular.module('mdApp', ['mdUXUI', 'ngTouch']);

mdApp.config([function() {
  
}]);

mdApp.run([function(){
  
}]);

/*--------------------------------------------------Services--------------------------------------------------*/

mdApp.factory('mdCartFactory', ['$http', function($http) {
  
  var setupCart = function() {
    var cart = {
      'currency': '',
      'coupon': '',
      'email': '',
      'items': [],
      'metadata': {},
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
      }
    };
    return cart;
  };
  
  var buildOrder = function(cart) {
    var order = {
      'currency': '',
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
      }
    };
    order.currency = cart.currency;
    if (cart.coupon) {
      order.coupon = cart.coupon;
    }
    order.email = cart.email;
    angular.forEach(cart.items, function(item) {
      var newItem = {
        'type': item.type,
        'parent': item.parent,
        'quantity': item.quantity
      };
      order.items.push(newItem);
    });
    order.shipping.name = cart.shipping.name;
    order.shipping.phone = cart.shipping.phone;
    order.shipping.address.country = cart.shipping.address.country;
    order.shipping.address.state = cart.shipping.address.state;
    order.shipping.address.city = cart.shipping.address.city;
    order.shipping.address.postal_code = cart.shipping.address.postal_code;
    order.shipping.address.line1 = cart.shipping.address.line1;
    order.shipping.address.line2 = cart.shipping.address.line2;
    return order;
  };
  
  var createOrder = function(cart) {
    var order = buildOrder(cart);
    $http.post('order/create', order, {'cache': true}).then(function(response) {
      order = response.data;
      return order;
    });
  };
  
  var updateOrder = function(cart) {
    if (cart.id) {
      $http.get('order/' + cart.id.toString(), {'cache': true}).then(function(response) {
        var order = response.data;
        return order;
      });
    }
  };
  
  var getCartItemQuantity = function(cart, skuId) {
    var quantity = 0;
    angular.forEach(cart.items, function(item, key) {
      if ((item.type === 'sku') && (item.parent === skuId)) {
        quantity = item.quantity;
      }
    });
    return quantity;
  };
  
  var updateCartItem = function(cart, product, sku, quantity) {
    if (typeof quantity === 'number') {
      var newItem = {
        'type': 'sku',
        'parent': sku.id,
        'quantity': quantity,
        'amount': sku.price,
        'currency': sku.currency,
        'description': product.name,
        'product': product.id
      };
      var updated = false;
      angular.forEach(cart.items, function(item, key) {
        if ((item.type === 'sku') && (item.parent === sku.id)) {
          updated = true;
          if (quantity > 0) {
            cart.items[key] = newItem;
          } else {
            cart.items.splice(key, 1);
          }
        }
      });
      if (!updated && (quantity > 0)) {
        cart.items.push(newItem);
      }
      return cart;
    }
  };
  
  var updateCartShipping = function(cart, name, value) {
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
    return cart;
  };
  
  var updateCartShippingMethods = function(cart, value) {
    angular.forEach(cart.shipping_methods, function(method) {
      if (value === method.id) {
        cart.selected_shipping_method = method.id;
      }
    });
    return cart;
  };
  
  return {
    'setupCart': setupCart,
    'buildOrder': buildOrder,
    'createOrder': createOrder,
    'updateOrder': updateOrder,
    'getCartItemQuantity': getCartItemQuantity,
    'updateCartItem': updateCartItem,
    'updateCartShipping': updateCartShipping,
    'updateCartShippingMethods': updateCartShippingMethods
  };
  
}]);

/*--------------------------------------------------Filters--------------------------------------------------*/

mdApp.filter('formatCountry', [function() {
  return function(input, countries) {
    var output = '';
    angular.forEach(countries, function(country){
      if (country.code === input) {
        output = country.name;
      }
    });
    return output;
  };
}]);

mdApp.filter('formatCurrency', [function() {
  return function(input, currency) {
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
  };
}]);

mdApp.filter('formatCurrencyPrefix', [function() {
  return function(input, currency) {
    var output = currency.code;
    output = output + input.toString();
    return output;
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
    icon: '<',
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
                     theme="tracking-dark">
              <md-list-item-multiline>
                <md-base ng-transclude></md-base>
              </md-list-item-multiline>
            </button>`,
  transclude: true,
  bindings: {
    onClick: '&',
    value: '<'
  }
});

mdApp.component('mdCardsItemMultiline', {
  template: `<md-cards-cell>
              <md-cards-cell-tile ng-transclude>
              </md-cards-cell-tile>
            </md-cards-cell>`,
  transclude: true
});

mdApp.component('mdCardsItemMultilineClickable', {
  template: `<md-cards-item-multiline>
              <button md-button-composite
                      ng-click="$ctrl.onClick({value: $ctrl.value})"
                      theme="tracking-dark"
                      ng-transclude>
              </button>
            </md-cards-item-multiline>`,
  transclude: true,
  bindings: {
    onClick: '&',
    value: '<'
  }
});

mdApp.component('mdWallItemMultiline', {
  template: `<md-wall-cell md-width="{{$ctrl.mdWidth}}">
              <md-wall-cell-tile ng-transclude>
              </md-wall-cell-tile>
            </md-wall-cell>`,
  transclude: true,
  bindings: {
    mdWidth: '<'
  }
});

mdApp.component('mdWallItemMultilineClickable', {
  template: `<md-wall-item-multiline md-width="$ctrl.mdWidth">
              <button md-button-composite
                      ng-click="$ctrl.onClick({value: $ctrl.value})"
                      theme="tracking-dark"
                      ng-transclude>
              </button>
            </md-wall-item-multiline>`,
  transclude: true,
  bindings: {
    onClick: '&',
    value: '<',
    mdWidth: '<'
  }
});

mdApp.component('mdListItem', {
  template: `<md-list-cell>
              <md-list-cell-tile lines="{{$ctrl.lines}}" side="{{$ctrl.iconPosition}}" dialog="{{$ctrl.dialog}}">
                <md-primary md-content="{{$ctrl.first}}" md-disabled="$ctrl.disabled"></md-primary>
                <md-secondary md-content="{{$ctrl.second}}" md-disabled="$ctrl.disabled" ng-if="$ctrl.second"></md-secondary>
                <md-secondary md-content="{{$ctrl.third}}" md-disabled="$ctrl.disabled" ng-if="$ctrl.third"></md-secondary>
                <md-actions side="{{$ctrl.iconPosition}}" lines="{{$ctrl.lines}}" dialog="{{$ctrl.dialog}}" ng-if="$ctrl.icon">
                  <md-base md-icon md-content="{{$ctrl.icon}}" md-disabled="$ctrl.disabled" md-pad="12"></md-base>
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
                     md-disabled="$ctrl.disabled"
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
                       ng-required="$ctrl.required"
                       ng-trim="$ctrl.trim"
                       ng-minlength="$ctrl.minlength"
                       ng-maxlength="$ctrl.maxlength"
                       ng-pattern="$ctrl.pattern"
                       ng-change="$ctrl.onChange({name: $ctrl.name, value: $ctrl.value})">
                <md-input-helper md-content="{{$ctrl.instruction}}"
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
    instructions: '<'
  }
});

mdApp.component('mdSelectionInput', {
  template: `<md-list-cell>
              <md-list-cell-tile>
                <md-input-label focus="{{$ctrl.focused}}"
                                md-content="{{$ctrl.label}}"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                </md-input-label>
                <button md-button-composite
                        ng-click="$ctrl.onClick({value: $ctrl.value})"
                        theme="tracking-dark">
                  <md-input-selection name="{{$ctrl.name}}"
                              type="text"
                              md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"
                              ng-blur="$ctrl.blur()"
                              ng-focus="$ctrl.focus()"
                              ng-model="$ctrl.value"
                              ng-model-options="{allowInvalid: false}"
                              ng-disabled="$ctrl.disabled"
                              ng-required="$ctrl.required"
                              ng-trim="$ctrl.trim"
                              ng-minlength="$ctrl.minlength"
                              ng-maxlength="$ctrl.maxlength"
                              ng-pattern="$ctrl.pattern"
                              ng-change="$ctrl.change()"
                              md-content="{{$ctrl.display}}"></md-input-selection>
                  <md-input-selection-icon
                              md-content="arrow_drop_down"
                              md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-input-selection-icon>
                </button>
                <md-input-helper md-content="{{$ctrl.instruction}}"
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
    instructions: '<'
  }
});

mdApp.component('mdRadioInput', {
  template: `<button md-button-composite
                     ng-click="$ctrl.onSelect({sample: $ctrl.sample})"
                     name="{{$ctrl.name}}"
                     ng-model="$ctrl.value"
                     ng-required="$ctrl.required"
                     theme="tracking-dark">
              <md-list-cell>
                <md-list-cell-tile lines="{{$ctrl.lines}}" side="left">
                  <md-primary md-content="{{$ctrl.first}}"
                              md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-primary>
                  <md-secondary md-content="{{$ctrl.second}}" ng-if="$ctrl.second"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-secondary>
                  <md-secondary md-content="{{$ctrl.third}}" ng-if="$ctrl.third"
                                md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></md-secondary>
                  <md-actions side="left" lines="{{$ctrl.lines}}" dialog="{{$ctrl.dialog}}">
                    <md-base md-icon md-pad="12"
                             md-fade="{{($ctrl.value !== $ctrl.sample)}}"
                             md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">radio_button_checked</md-base>
                  </md-actions>
                  <md-actions side="left" lines="{{$ctrl.lines}}" dialog="{{$ctrl.dialog}}">
                    <md-base md-icon md-pad="12"
                             md-fade="{{($ctrl.value === $ctrl.sample)}}"
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
    required: '<'
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
                     theme="tracking-dark">
              <md-base md-font="body2" md-misc="textCenter" md-content="{{$ctrl.name.toUpperCase()}}">
              </md-base>
              <div style="width: 0px;
                          height: 0px;
                          border-left: 72px solid transparent;
                          border-right: 72px solid transparent;
                          border-top: 36px solid rgba(0, 0, 0, 0.54);
                          margin: auto;"></div>
            </button>`,
  bindings: {
    name: '<',
    value: '<',
    onClick: '&'
  }
});

mdApp.component('mdCartPage', {
  template: `<md-page vertical-scroll="scroll" top="{{$ctrl.top}}" bottom="{{$ctrl.bottom}}" ng-transclude>
            </md-page>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      
    };
    
    ctrl.$onChanges = function(changes) {
      if (changes.currentPage && changes.currentPage.currentValue) {
        if (ctrl.currentPage === ctrl.page) {
          ctrl.top = '56px';
          ctrl.bottom = '0';
        } else if (ctrl.currentPage > ctrl.page) {
          ctrl.top = '-100%';
          ctrl.bottom = '100%';
        } else if (ctrl.currentPage < ctrl.page) {
          ctrl.top = '100%';
          ctrl.bottom = '-100%';
        }
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
                          md-content="{{$ctrl.settings.modals.cart.delete.buttons.cancel}}"></button>
                  <button md-button-text-flat
                          ng-click="$ctrl.ok()"
                          md-content="{{$ctrl.settings.modals.cart.delete.buttons.ok}}"></button>
                </md-action>
              </md-base>
            </md-confirmation>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      ctrl.dialog = true;
      ctrl.delete = false;
    };
    
    ctrl.cancel = function() {
      ctrl.delete = false;
      ctrl.dialog = false;
    };
    
    ctrl.ok = function() {
      ctrl.delete = true;
      ctrl.dialog = false;
    };
    
    ctrl.$onChanges = function(changes) {
      
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
                  <md-list-item-clickable ng-repeat="option in $ctrl.settings.countries"
                                          first="option.name"
                                          value="option.code"
                                          sample="$ctrl.sample"
                                          disabled="option.disabled"
                                          on-click="$ctrl.selectOption(value)">
                  </md-list-item-clickable>
                </md-list>
              </md-page>
            </md-simple>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.selectOption = function(value) {
      ctrl.option = value;
    };
    
    ctrl.$onInit = function() {
      ctrl.option = false;
    };
  }],
  bindings: {
    settings: '<',
    sample: '<',
    onSelect: '&'
  }
});

mdApp.component('mdCartEmpty', {
  template: `<md-cart-page page="-1" current-page="-1">
              <md-list>
                <md-list-item-multiline>
                  <md-base md-font="display1" md-misc="textCenter" md-pad="0,24" md-content="{{$ctrl.settings.modals.cart.empty}}">
                  </md-base>
                </md-list-item-multiline>
              </md-list>
            </md-cart-page>`,
  bindings: {
    settings: '<'
  }
});

mdApp.component('mdCartProducts', {
  template: `<md-cart-page page="1" current-page="$ctrl.step">
              <md-cards>
                <md-cards-item-multiline-clickable ng-repeat="item in $ctrl.cart.items"
                                                   value="item" on-click="$ctrl.onSelect({productId: value.product, skuId: value.parent})">
                  <md-base md-pad="24,16">
                    <md-base md-font="headline" md-content="{{item.description}}"></md-base>
                    <md-base md-font="secondary" md-content="{{item.parent}}" md-pad="0,0,16,0"></md-base>
                    <md-action side="right">
                    <table>
                      <tbody>
                        <tr>
                          <td md-font="secondary"
                              md-misc="textRight"
                              md-pad="0,16,0,0"
                              md-content="{{$ctrl.settings.modals.cart.items.amount.label}}"></td>
                          <td md-font="secondary"
                              md-misc="textRight"
                              md-pad="0"
                              md-content="{{item.amount | formatCurrency:$ctrl.settings.currencies[item.currency.toUpperCase()]}}"></td>
                        </tr>
                        <tr>
                          <td md-font="secondary"
                              md-misc="textRight"
                              md-pad="0,16,0,0"
                              md-content="{{$ctrl.settings.modals.cart.items.quantity.label}}"></td>
                          <td md-font="secondary"
                              md-misc="textRight"
                              md-pad="0"
                              md-content="{{item.quantity}}"></td>
                        </tr>
                        <tr>
                          <td md-font="secondary"
                              md-misc="textRight"
                              md-pad="0,16,0,0"
                              md-content="{{$ctrl.settings.modals.cart.items.subtotal.label}}"></td>
                          <td md-font="secondary"
                              md-misc="textRight"
                              md-pad="0" md-content="{{(item.amount * item.quantity) | formatCurrency:$ctrl.settings.currencies[item.currency.toUpperCase()]}}"></td>
                        </tr>
                      </tbody>
                    </table>
                    </md-action>
                  </md-base>
                </md-cards-item-multiline>
              </md-cards>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.products"
                              on-click="$ctrl.onNextStep()"></md-cart-button>
            </md-cart-page>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    onSelect: '&',
    onNextStep: '&'
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
                                      label="$ctrl.settings.modals.cart.shipping.address.country.label"
                                      instructions="$ctrl.settings.modals.cart.shipping.address.country.instructions"
                                      value="$ctrl.cart.shipping.address.country"
                                      display="$ctrl.cart.shipping.address.country | formatCountry:$ctrl.settings.countries"
                                      on-click="$ctrl.onOpenCountries({value: value})"></md-selection-input>
                  <md-text-input name="'state'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.address.state.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.state.instructions"
                                 value="$ctrl.cart.shipping.address.state"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'city'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.address.city.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.city.instructions"
                                 value="$ctrl.cart.shipping.address.city"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'postal_code'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.address.postal_code.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.postal_code.instructions"
                                 value="$ctrl.cart.shipping.address.postal_code"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'line1'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.address.line1.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.line1.instructions"
                                 value="$ctrl.cart.shipping.address.line1"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'line2'"
                                 required="false"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.address.line2.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.address.line2.instructions"
                                 value="$ctrl.cart.shipping.address.line2"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'name'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.name.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.name.instructions"
                                 value="$ctrl.cart.shipping.name"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'email'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.email.label"
                                 instructions="$ctrl.settings.modals.cart.email.instructions"
                                 value="$ctrl.cart.email"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                  <md-text-input name="'phone'"
                                 required="true"
                                 trim="true"
                                 label="$ctrl.settings.modals.cart.shipping.phone.label"
                                 instructions="$ctrl.settings.modals.cart.shipping.phone.instructions"
                                 value="$ctrl.cart.shipping.phone"
                                 on-change="$ctrl.onUpdateShipping({name: name, value: value})"></md-text-input>
                </md-form>
              </md-list>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.shipping"
                              on-click="$ctrl.nextStep()"></md-cart-button>
            </md-cart-page>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.register = function(validator) {
      ctrl.validator = validator;
    };
    
    ctrl.nextStep = function() {
      var isValid = ctrl.validator();
      if (isValid) {
        ctrl.onNextStep();
      }
    };
    
    ctrl.$onInit = function() {
      
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    onUpdateShipping: '&',
    onOpenCountries: '&',
    onNextStep: '&'
  }
});

mdApp.component('mdCartShippingMethods', {
  template: `<md-cart-page page="3" current-page="$ctrl.step">
              <md-list>
                <md-list-subheader md-content="{{$ctrl.settings.modals.cart.shipping_methods.label}}"></md-list-subheader>
                <md-form name="'cartShippingMethodsForm'" on-init="$ctrl.register(validator)">
                  <md-radio-input ng-repeat="item in $ctrl.cart.shipping_methods"
                                  name="shipping_methods"
                                  value="$ctrl.cart.selected_shipping_method"
                                  sample="item.id"
                                  first="item.amount | formatCurrency:$ctrl.settings.currencies[item.currency.toUpperCase()] | formatCurrencyPrefix:$ctrl.settings.currencies[item.currency.toUpperCase()]"
                                  second="item.description"
                                  on-select="$ctrl.onSelectShippingMethod({value: sample})"></md-radio-input>
                </md-form>
              </md-list>
              <md-cart-button name="$ctrl.settings.modals.cart.steps.methods"
                              on-click="$ctrl.nextStep()"></md-cart-button>
            </md-cart-page>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.register = function(validator) {
      ctrl.validator = validator;
    };
    
    ctrl.nextStep = function() {
      var isValid = ctrl.validator();
      if (isValid) {
        ctrl.onNextStep();
      }
    };
    
    ctrl.$onInit = function() {
      
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    step: '<',
    onSelectShippingMethod: '&',
    onNextStep: '&'
  }
});

mdApp.component('mdCart', {
  template: `<md-full-screen side="'right'" active="$ctrl.dialog" on-close="$ctrl.onExit()">
              <md-app-bar>
                <md-app-icon icon="'shopping_cart'"></md-app-icon>
                <md-actions side="left" lines="4">
                  <button md-button-icon-flat
                          md-content="arrow_back"
                          ng-click="$ctrl.closeCart()"></button>
                </md-actions>
                <md-actions side="right" lines="4" ng-if="$ctrl.cart.items.length">
                  <button md-button-icon-flat
                          md-content="delete"
                          ng-click="$ctrl.deleteDialog = true"></button>
                </md-actions>
              </md-app-bar>
              <md-cart-empty settings="$ctrl.settings"
                             ng-if="!$ctrl.cart.items.length"></md-cart-empty>
              <md-cart-products settings="$ctrl.settings"
                                ng-if="$ctrl.cart.items.length"
                                step="$ctrl.step"
                                cart="$ctrl.cart"
                                on-select="$ctrl.onOpenProduct({productId: productId, skuId: skuId})"
                                on-next-step="$ctrl.progress()"></md-cart-products>
              <md-cart-shipping settings="$ctrl.settings"
                                ng-if="$ctrl.cart.items.length"
                                step="$ctrl.step"
                                cart="$ctrl.cart"
                                on-update-shipping="$ctrl.onUpdateShipping({name: name, value: value})"
                                on-open-countries="$ctrl.openCountries({value: value})"
                                on-next-step="$ctrl.progress()"></md-cart-shipping>
              <md-cart-shipping-methods settings="$ctrl.settings"
                                        ng-if="$ctrl.cart.items.length"
                                        step="$ctrl.step"
                                        cart="$ctrl.cart"
                                        on-select-shipping-method="$ctrl.onUpdateShippingMethods({value: value})"
                                        on-next-step="$ctrl.progress()"></md-cart-shipping-methods>
            </md-full-screen>
            <md-cart-delete settings="$ctrl.settings"
                            on-close="$ctrl.deleteCart(value)"
                            ng-if="$ctrl.deleteDialog"></md-cart-delete>
            <md-cart-countries settings="$ctrl.settings"
                               sample="$ctrl.selectedCountry"
                               ng-if="$ctrl.countriesDialog"
                               on-select="$ctrl.selectCountry(value)"></md-cart-countries>`,
  controller: ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    ctrl.closeCart = function() {
      ctrl.dialog = false;
    };
    
    ctrl.deleteCart = function(value) {
      ctrl.deleteDialog = false;
      if (value) {
        ctrl.onDeleteCart();
      }
    };
    
    ctrl.openCountries = function(value) {
      ctrl.selectedCountry = value;
      ctrl.countriesDialog = true;
    };
    
    ctrl.selectCountry = function(value) {
      if (value) {
        ctrl.onUpdateShipping({'name': 'country', 'value': value});
      }
      ctrl.countriesDialog = false;
    };
    
    ctrl.progress = function() {
      if (ctrl.step === 2) {
        ctrl.onCreateOrder();
      }
      ctrl.step = ctrl.step + 1;
    };
    
    ctrl.$onInit = function() {
      ctrl.dialog = true;
      ctrl.step = 1;
      ctrl.deleteDialog = false;
      ctrl.countriesDialog = false;
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    onOpenProduct: '&',
    onUpdateShipping: '&',
    onCreateOrder: '&',
    onUpdateShippingMethods: '&',
    onDeleteCart: '&',
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
    
    var getProductAttributes = function(product) {
      var result = {};
      angular.forEach(product.skus.data, function(sku) {
        angular.forEach(sku.attributes, function(value, key) {
          if (!result[key]) {
            result[key] = [];
          }
          if (result[key].indexOf(value) === -1) {
            result[key].push(value);
          }
        });
      });
      return angular.equals({}, result) ? false : result;
    };
    
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
    onSelect: '&',
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
    inventory: '<',
  }
});

mdApp.component('mdProductImageSlider', {
  template: `<md-base md-get-height="-124" md-set-height="{{mdGetHeight}}" md-get-width>
              <md-carousel-action side="left" lines="4">
                <button md-button-composite theme="tracking-dark" ng-click="$ctrl.rewind()">
                  <md-base md-icon="avatar" md-pad="12" md-content="chevron_left"></md-bsae>
                </button>
              </md-carousel-action>
              <md-carousel-action side="right" lines="4">
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
            </md-base>`,
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
                                     value="$ctrl.quantity"
                                     on-change="$ctrl.onUpdateQuantity({product: $ctrl.product, sku: $ctrl.sku, quantity: value})"></md-sku-quantity>
                  </md-list>
                </md-form>
              </md-page>
            </md-full-screen-fade>
            <md-sku-attribute-options ng-if="$ctrl.attribute"
                                      product="$ctrl.product"
                                      attributes="$ctrl.sku.attributes"
                                      attribute="$ctrl.attribute"
                                      on-select="$ctrl.switchSku(attribute, option)"></md-sku-attribute-options>`,
  controller: ['$scope', '$element', '$attrs', '$http',  function($scope, $element, $attrs, $http) {
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
    
    ctrl.switchSku = function(attribute, option) {
      if (option) {
        var skuAttributes = angular.merge({}, ctrl.sku.attributes);
        skuAttributes[attribute] = option;
        var sku = getSku(ctrl.product, false, skuAttributes);
        if (sku) {
          ctrl.sku = sku;
          ctrl.onSwitchSku({'product': ctrl.product, 'sku': ctrl.sku});
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
              ctrl.onSwitchSku({'product': ctrl.product, 'sku': ctrl.sku});
            }
          }
        });
      }
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
    
  }],
  bindings: {
    settings: '<',
    productId: '<',
    skuId: '<',
    quantity: '<',
    onSwitchSku: '&',
    onUpdateQuantity: '&',
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
                <md-base md-pad="24,16"
                         md-icon="avatar"
                         md-content="refresh"></md-base>
              </md-cards-item-multiline-clickable>
            </md-wall>`,
  controller: ['$scope', '$element', '$attrs', '$http',  function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    var getProducts = function(products) {
      var query = '';
      if (products.has_more) {
        query = '?start=' + products.data[products.data.length - 1]['id'];
      }
      $http.get('products' + query, {'cache': true}).then(function(response) {
        products.data.push.apply(products.data, response.data.data);
        products.has_more = response.data.has_more;
      });
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
    onSelect: '&',
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
                             products="$ctrl.products"
                             on-select="$ctrl.openProduct(productId, skuId)"></md-products>
              </md-page>
            </md-full-screen>
            <md-cart settings="$ctrl.settings"
                     cart="$ctrl.cart"
                     ng-if="$ctrl.cartDialog"
                     on-open-product="$ctrl.openProduct(productId, skuId)"
                     on-update-shipping="$ctrl.updateShipping(name, value)"
                     on-create-order="$ctrl.createOrder()"
                     on-update-shipping-methods="$ctrl.updateShippingMethods(value)"
                     on-delete-cart="$ctrl.deleteCart()"
                     on-exit="$ctrl.closeCart()"></md-cart>
            <md-product settings="$ctrl.settings"
                        product-id="$ctrl.productId"
                        sku-id="$ctrl.skuId"
                        quantity="$ctrl.skuQuantity"
                        ng-if="$ctrl.productId"
                        on-switch-sku="$ctrl.switchProductSku(product, sku)"
                        on-update-quantity="$ctrl.updateProductSkuQuantity(product, sku, quantity)"
                        on-exit="$ctrl.closeProduct()"></md-product>`,
  controller: ['$scope', '$element', '$attrs', '$http', 'mdCartFactory', function($scope, $element, $attrs, $http, mdCartFactory) {
    var ctrl = this;
    
    ctrl.openProduct = function(productId, skuId) {
      ctrl.productId = productId;
      ctrl.skuId = skuId;
    };
    
    ctrl.closeProduct = function() {
      ctrl.productId = false;
      ctrl.skuId = false;
    };
    
    ctrl.switchProductSku = function(product, sku) {
      ctrl.skuQuantity = mdCartFactory.getCartItemQuantity(ctrl.cart, sku.id);
    };
    
    ctrl.updateProductSkuQuantity = function(product, sku, quantity) {
      mdCartFactory.updateCartItem(ctrl.cart, product, sku, quantity);
      ctrl.skuQuantity = mdCartFactory.getCartItemQuantity(ctrl.cart, sku.id);
    };
    
    ctrl.openCart = function() {
      ctrl.cartDialog = true;
    };
    
    ctrl.closeCart = function() {
      ctrl.cartDialog = false;
    };
    
    ctrl.updateShipping = function(name, value) {
      mdCartFactory.updateCartShipping(ctrl.cart, name, value);
    };
    
    ctrl.createOrder = function() {
      ctrl.cart = mdCartFactory.createOrder(ctrl.cart);
    };
    
    ctrl.updateShippingMethods = function(value) {
      mdCartFactory.updateCartShippingMethods(ctrl.cart, value);
    };
    
    ctrl.deleteCart = function() {
      ctrl.cart = mdCartFactory.setupCart();
      ctrl.cart.currency = ctrl.settings.account.default_currency;
    };
    
    ctrl.$onInit = function() {
      $http.get('app/settings.json', {'cache': true}).then(function(response) {
        ctrl.settings = response.data;
        $http.get('app/currency.json', {'cache': true}).then(function(response) {
          ctrl.settings.currencies = response.data;
        });
        $http.get('app/countries.json', {'cache': true}).then(function(response) {
          ctrl.settings.countries = response.data.list;
        });
        $http.get('account', {'cache': true}).then(function(response) {
          ctrl.settings.account = response.data;
          ctrl.cart = mdCartFactory.setupCart();
          ctrl.cart.currency = ctrl.settings.account.default_currency;
        });
        ctrl.productId = false;
        ctrl.cartDialog = false;
      });
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
  }
});

mdApp.controller('AppController', ['$scope', '$http', function($scope, $http) {
  
  $http.get('account', {'cache': true}).then(function(response) {
    $scope.account = response.data;
  });
  
}]);

})();