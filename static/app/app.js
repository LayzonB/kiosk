/*--------------------------------------------------App--------------------------------------------------*/

var dataLayer = [];

var mdApp = angular.module('mdApp', ['mdUXUI']);

mdApp.config([function() {
  
}]);

mdApp.run([function(){
  
}]);

/*--------------------------------------------------Filters--------------------------------------------------*/

mdApp.filter('currencyFormater', [function() {
  return function(input, currency) {
    input = parseFloat(input) || 0;
    var output = currency.code;
    var formater = '1';
    for (var i = 0; i < currency.decimal_digits; i++) {
      formater = formater + '0';
    }
    formater = parseInt(formater);
    input = input / formater;
    input = input.toFixed(currency.decimal_digits);
    output = output + input.toString();
    return output;
  };
}]);

mdApp.filter('inventoryFormater', [function() {
  return function(inventory, settings, print) {
    var output = '';
    if (inventory.type === 'infinite') {
      if (print) {
        output = 'in_stock';
      } else {
        output = Infinity;
      }
    } else if (inventory.type === 'bucket') {
      if (print) {
        output = inventory.value;
      } else {
        output = (inventory.value === 'out_of_stock') ? 0 : Infinity;
      }
    } else if (inventory.type === 'finite') {
      if (print) {
        output = (inventory.quantity > 0) ? 'in_stock' : 'out_of_stock';
      } else {
        output = inventory.quantity;
      }
    }
    if (settings && print) {
      return settings[output];
    }
    return output;
  };
}]);

mdApp.filter('imagesFormater', [function() {
  return function(skuImage, productImages) {
    var output = [];
    if (skuImage) {
      output.push(skuImage);
    }
    if (productImages) {
      angular.forEach(productImages, function(image) {
        if (skuImage !== image) {
          output.push(image);
        }
      });
    }
    return output;
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
  template: `<md-wall-cell>
              <md-wall-cell-tile ng-transclude>
              </md-wall-cell-tile>
            </md-wall-cell>`,
  transclude: true
});

mdApp.component('mdWallItemMultilineClickable', {
  template: `<md-wall-item-multiline>
              <button md-button-composite
                      ng-click="$ctrl.onClick({value: $ctrl.value})"
                      theme="tracking-dark"
                      ng-transclude>
              </button>
            </md-wall-item-multiline>`,
  transclude: true,
  bindings: {
    onClick: '&',
    value: '<'
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

mdApp.component('mdNumberInput', {
  template: `<md-list-cell>
                <md-base md-pad="0,16">
                  <md-input-label focus="true"
                                  md-content="{{$ctrl.label}}"
                                  md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                  </md-input-label>
                </md-base>
                <md-action md-pad="0,4">
                  <button md-button-icon-flat md-content="remove" ng-click="$ctrl.remove()"
                          md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></button>
                  <input name="{{$ctrl.name}}"
                         type="text"
                         readonly
                         md-input-number
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
                  <button md-button-icon-flat md-content="add" ng-click="$ctrl.add()"
                          md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></button>
                </md-action>
                <md-base md-pad="0,16">
                  <md-input-helper md-content="{{$ctrl.instruction}}"
                                   md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}">
                  </md-input-helper>
                </md-base>
            </md-list-cell>`,
  require: {'form': '^^mdForm'},
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.$postLink = function() {
      ctrl.input = ctrl.form.getInput(ctrl);
      ctrl.instruction = ctrl.instructions['info'];
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
    ctrl.$doCheck = function() {
      if (ctrl.input) {
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
    min: '<',
    max: '<',
    step: '<',
    instructions: '<'
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
  controller: ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
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

mdApp.component('mdCartProducts', {
  template: `<md-cart-page page="1" current-page="$ctrl.step">
              <md-cards>
                <md-cards-item-multiline-clickable ng-repeat="item in $ctrl.items" value="item" on-click="">
                  <md-base md-pad="24,16">
                    <md-base md-font="headline" md-content="{{item.sku.name}}"></md-base>
                    <md-base md-font="secondary" md-content="{{item.parent}}" md-pad="0,0,16,0"></md-base>
                    <md-action side="right">
                    <table>
                      <tbody>
                        <tr>
                          <td md-font="secondary" md-misc="textRight" md-pad="0,16,0,0" md-content="{{$ctrl.settings.modals.cart.items.amount.label}}"></td>
                          <td md-font="secondary" md-misc="textRight" md-pad="0" md-content="{{item.sku.priceView}}"></td>
                        </tr>
                        <tr>
                          <td md-font="secondary" md-misc="textRight" md-pad="0,16,0,0" md-content="{{$ctrl.settings.modals.cart.items.quantity.label}}"></td>
                          <td md-font="secondary" md-misc="textRight" md-pad="0" md-content="{{item.quantity}}"></td>
                        </tr>
                        <tr>
                          <td md-font="secondary" md-misc="textRight" md-pad="0,16,0,0" md-content="{{$ctrl.settings.modals.cart.items.subtotal.label}}"></td>
                          <td md-font="secondary" md-misc="textRight" md-pad="0" md-content="{{item.sku.subtotal}}"></td>
                        </tr>
                      </tbody>
                    </table>
                    </md-action>
                  </md-base>
                </md-cards-item-multiline>
              </md-cards>
              <md-cart-button name="'PROCEED to CHECKOUT'"></md-cart-button>
            </md-cart-page>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    items: '<',
    step: '<'
  }
});

mdApp.component('mdCartShipping', {
  template: `<md-cart-page page="1" current-page="$ctrl.step">
              <md-cards>
                <md-cards-item-multiline-clickable>
                  <md-base md-pad="24,16">
                    <md-base md-font="headline">Product</md-base>
                    <md-base md-font="secondary" md-pad="0,0,16,0">Product</md-base>
                  </md-base>
                </md-cards-item-multiline>
              </md-cards>
              <md-cart-button name="'PROCEED to CHECKOUT'"></md-cart-button>
            </md-cart-page>`,
  transclude: true,
  controller: ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    step: '<',
  }
});

mdApp.component('mdCart', {
  template: `<md-full-screen side="'right'" active="$ctrl.dialog" on-close="$ctrl.onExit()">
              <md-app-bar>
                <md-app-icon icon="'shopping_cart'"></md-app-icon>
                <md-actions side="left" lines="4">
                  <button md-button-icon-flat md-content="arrow_back" ng-click="$ctrl.closeCart()"></button>
                </md-actions>
              </md-app-bar>
              <md-cart-products step="$ctrl.step" ng-if="$ctrl.step === 1" settings="$ctrl.settings" items="$ctrl.cart.items"></md-cart-products>
            </md-full-screen>`,
  controller: ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    ctrl.closeCart = function() {
      ctrl.dialog = false;
    };
    
    ctrl.$onInit = function() {
      ctrl.dialog = true;
      ctrl.step = 1;
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    cart: '<',
    onExit: '&'
  }
});

mdApp.component('mdProductQuantity', {
  template: `<md-list-cell>
                <md-action md-pad="0,4">
                  <button md-button-icon-flat md-content="remove_shopping_cart" ng-click="$ctrl.remove()"
                          md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></button>
                  <input name="{{$ctrl.name}}"
                         type="text"
                         readonly
                         md-input-number
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
                  <button md-button-icon-flat md-content="add_shopping_cart" ng-click="$ctrl.add()"
                          md-error="{{($ctrl.input && $ctrl.input.$dirty && $ctrl.input.$invalid)}}"></button>
                </md-action>
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

mdApp.component('mdProductVariantOptions', {
  template: `<md-drawer-wide on-close="$ctrl.onSelect({attribute: $ctrl.attribute, option: $ctrl.option})" active="!$ctrl.option">
              <md-page vertical-scroll="scroll">
                <md-list>
                  <md-list-subheader md-content="{{$ctrl.attribute}}"></md-list-subheader>
                  <md-list-item-clickable ng-repeat="option in $ctrl.options"
                                          first="option.name"
                                          value="option.name"
                                          sample="$ctrl.variant[$ctrl.attribute]"
                                          disabled="option.disabled"
                                          on-click="$ctrl.selectOption(value)">
                  </md-list-item-clickable>
                </md-list>
              </md-page>
            </md-drawer-wide>`,
  controller: ['$scope', '$element', '$attrs', 'inventoryFormaterFilter', function($scope, $element, $attrs, inventoryFormaterFilter) {
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
    
    var getOptions = function(product, variant, attribute) {
      var skus = [];
      var options = [];
      var variantCopy = angular.merge({}, variant);
      delete variantCopy[attribute];
      angular.forEach(product.skus.data, function(sku) {
        var matched = true;
        angular.forEach(variantCopy, function(value, key) {
          if (sku.attributes[key] !== value) {
            matched = false;
          }
        });
        if (matched) {
          skus.push(sku);
        }
      });
      angular.forEach(skus, function(sku) {
        //var inventory = inventoryFormaterFilter(sku.inventory, false, false);
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
      ctrl.options = getOptions(ctrl.product, ctrl.variant, ctrl.attribute);
    };
  }],
  bindings: {
    product: '<',
    variant: '<',
    attribute: '<',
    onSelect: '&'
  }
});

mdApp.component('mdProductVariants', {
  template: `<md-list md-seam>
              <md-list-item-clickable ng-repeat="(attribute, value) in $ctrl.variant"
                                      first="attribute"
                                      second="value"
                                      value="attribute"
                                      icon="'chevron_right'"
                                      icon-position="'right'"
                                      on-click="$ctrl.onSelect({value: value})"></md-list-item-clickable>
            </md-list>`,
  bindings: {
    variant: '<',
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
  template: `<md-actions side="left" lines="4">
              <button md-button-icon-flat md-content="chevron_left" ng-click="$ctrl.rewind()"></button>
            </md-actions>
            <md-actions side="right" lines="4">
              <button md-button-icon-flat md-content="chevron_right" ng-click="$ctrl.forward()"></button>
            </md-actions>
            <md-carousel index="{{$ctrl.images.length}}" position="{{$ctrl.position}}">
              <md-carousel-cell ng-repeat="item in $ctrl.images"
                                md-width="{{mdCarouselWidth}}"
                                md-height="{{mdCarouselHeight}}" >
                <img md-img
                     ng-src="{{item}}"
                     md-width="{{mdCarouselWidth}}"
                     md-height="{{mdCarouselHeight}}">
              </md-carousel-cell>
            </md-carousel>`,
  controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      ctrl.position = 0;
    };
    ctrl.$onChanges = function(changes) {
      if (changes.images) {
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
    images: '<',
  }
});

mdApp.component('mdProduct', {
  template: `<md-full-screen-fade active="$ctrl.dialog" on-close="$ctrl.onExit()">
              <md-actions side="left" lines="4">
                <button md-button-icon-flat md-content="close" ng-click="$ctrl.closeProduct()"></button>
              </md-actions>
              <md-page vertical-scroll="scroll" ng-if="$ctrl.sku">
                <md-form name="'productForm'">
                  <md-product-image-slider images="$ctrl.sku.images" ng-if="$ctrl.sku.images.length"></md-product-image-slider>
                  <md-product-info name="$ctrl.sku.name" description="$ctrl.sku.description" id="$ctrl.sku.id" price="$ctrl.sku.priceView" inventory="$ctrl.sku.inventoryView"></md-product-info>
                  <md-product-variants variant="$ctrl.variant" ng-if="$ctrl.variant"
                                       on-select="$ctrl.openOptions(value)"></md-product-variants>
                  <md-list>
                    <md-product-quantity label="$ctrl.settings.modals.product.quantity.label"
                                     instructions="$ctrl.settings.modals.product.quantity.instructions"
                                     name="'quantity'"
                                     min="0"
                                     max="$ctrl.sku.availability"
                                     step="1"
                                     required="true"
                                     value="$ctrl.sku.quantity"
                                     on-change="$ctrl.updateQuantity(name, value)"></md-product-quantity>
                  </md-list>
                </md-form>
              </md-page>
            </md-full-screen-fade>
            <md-product-variant-options ng-if="$ctrl.attribute"
                                        product="$ctrl.product"
                                        variant="$ctrl.variant"
                                        attribute="$ctrl.attribute"
                                        on-select="$ctrl.switchSku(attribute, option)"></md-product-variant-options>`,
  controller: ['$scope', '$element', '$attrs', '$http', 'currencyFormaterFilter', 'inventoryFormaterFilter', 'imagesFormaterFilter',  function($scope, $element, $attrs, $http, currencyFormaterFilter, inventoryFormaterFilter, imagesFormaterFilter) {
    var ctrl = this;
    
    var getSku = function(product, skuId) {
      var result = {};
      angular.forEach(product.skus.data, function(sku) {
        if (angular.equals({}, result)) {
          if (sku.active) {
            if (!skuId || (skuId === sku.id)) {
              result = sku;
            }
          }
        }
      });
      return angular.equals({}, result) ? false : result;
    };
    
    var formatSku = function(sku, product, currencies, cart, settings) {
      var result = angular.merge({}, sku);
      result.name = product.name;
      result.description = product.description;
      result.priceView = currencyFormaterFilter(sku.price, currencies[sku.currency.toUpperCase()]);
      result.inventoryView = inventoryFormaterFilter(sku.inventory, settings.modals.product.inventory, true);
      result.availability = inventoryFormaterFilter(sku.inventory, false, false);
      result.images = imagesFormaterFilter(sku.image, product.images);
      result.quantity = 0;
      angular.forEach(cart.items, function(item, key) {
        if ((item.type === 'sku') && (item.parent === sku.id)) {
          result.quantity = item.quantity;
        }
      });
      return result;
    };
    
    var buildCartItem = function(quantity, sku, currencies) {
      var newSku = angular.merge({}, sku);
      newSku.subtotal = currencyFormaterFilter((sku.price * quantity), currencies[sku.currency.toUpperCase()]);
      var result = {
        'type': 'sku',
        'parent': sku.id,
        'quantity': quantity,
        'sku': newSku
      };
      return result;
    };
    
    ctrl.switchSku = function(attribute, option) {
      if (option) {
        var variant = angular.merge({}, ctrl.variant);
        variant[attribute] = option;
        var result = {};
        angular.forEach(ctrl.product.skus.data, function(sku) {
          if (angular.equals({}, result)) {
            if (sku.active) {
              result = sku;
              angular.forEach(variant, function(value, key) {
                if (sku.attributes[key] !== value) {
                  result = {};
                }
              });
            }
          }
        });
        if (!angular.equals({}, result)) {
          ctrl.variant = variant;
          ctrl.sku = formatSku(result, ctrl.product, ctrl.currencies, ctrl.cart, ctrl.settings);
          ctrl.onSwitchSku({'sku': ctrl.sku});
        }
      }
      ctrl.attribute = false;
    };
    
    ctrl.openOptions = function(attribute) {
      ctrl.attribute = attribute;
    };
    
    ctrl.updateQuantity = function(name, quantity) {
      if (typeof quantity === 'number') {
        var updated = false;
        angular.forEach(ctrl.cart.items, function(item, key) {
          if ((item.type === 'sku') && (item.parent === ctrl.sku.id)) {
            updated = true;
            if (quantity > 0) {
              ctrl.cart.items[key] = buildCartItem(quantity, ctrl.sku, ctrl.currencies);
            } else {
              ctrl.cart.items.splice(key, 1);
            }
          }
        });
        if (!updated && (quantity > 0)) {
          ctrl.cart.items.push(buildCartItem(quantity, ctrl.sku, ctrl.currencies));
        }
      }
    };
    
    ctrl.closeProduct = function() {
      ctrl.dialog = false;
    };
    
    ctrl.$onInit = function() {
      ctrl.dialog = true;
      //ctrl.sku = false;
      ctrl.attribute = false;
      if (ctrl.productId) {
        $http.get('product/' + ctrl.productId.toString(), {'cache': true}).then(function(product) {
          ctrl.product = product.data;
          if (ctrl.product && ctrl.product.active) {
            var sku = getSku(ctrl.product, ctrl.skuId);
            if (sku) {
              ctrl.variant = angular.merge({}, sku.attributes);
              $http.get('app/currency.json', {'cache': true}).then(function(currencies) {
                ctrl.currencies = currencies.data;
                ctrl.sku = formatSku(sku, ctrl.product, ctrl.currencies, ctrl.cart, ctrl.settings);
              });
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
    cart: '<',
    onSwitchSku: '&',
    onExit: '&'
  }
});

mdApp.component('mdProducts', {
  template: `<md-wall min-item-width="240">
              <md-wall-item-multiline-clickable ng-repeat="product in $ctrl.products.data" value="product" on-click="$ctrl.onSelect({value: value})">
                <img md-base ng-if="product.images.length"
                     ng-src="{{product.images[0]}}"
                     width="100%">
                <md-base md-pad="24,16">
                  <md-base md-font="headline" md-content="{{product.name}}"></md-base>
                  <md-base md-font="body1" md-misc="textTrim" md-content="{{product.description}}" ng-if="product.description"></md-base>
                </md-base>
              </md-wall-item-multiline-clickable>
            </md-wall>`,
  controller: ['$scope', '$element', '$attrs', '$http',  function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    ctrl.$onInit = function() {
      // here we use path to list all products
      $http.get('products', {'cache': true}).then(function(response) {
        ctrl.products = response.data;
      });
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
                <md-app-logo img-width="$ctrl.settings.logo.width"
                             img-height="$ctrl.settings.logo.height"
                             img-src="$ctrl.settings.logo.src"
                             img-alt="$ctrl.settings.site">
                </md-app-logo>
                <md-actions side="right" lines="4">
                  <button md-button-icon-flat md-content="shopping_cart" ng-click="$ctrl.openCart()"></button>
                </md-actions>
              </md-app-bar>
              <md-page vertical-scroll="scroll" top="56px">
                <md-products settings="$ctrl.settings" products="$ctrl.products" on-select="$ctrl.openProduct(value)"></md-products>
              </md-page>
            </md-full-screen>
            <md-product settings="$ctrl.settings" product-id="$ctrl.id" cart="$ctrl.cart" ng-if="$ctrl.id" on-exit="$ctrl.closeProduct()"></md-product>
            <md-cart settings="$ctrl.settings" cart="$ctrl.cart" ng-if="$ctrl.cartDialog" on-exit="$ctrl.closeCart()"></md-cart>`,
  controller: ['$scope', '$element', '$attrs', '$http', function($scope, $element, $attrs, $http) {
    var ctrl = this;
    
    var resetCart = function() {
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
    
    ctrl.openProduct = function(value) {
      ctrl.id = value.id;
    };
    
    ctrl.closeProduct = function(value) {
      ctrl.id = false;
    };
    
    ctrl.openCart = function() {
      ctrl.cartDialog = true;
    };
    
    ctrl.closeCart = function() {
      ctrl.cartDialog = false;
    };
    
    ctrl.$onInit = function() {
      $http.get('app/settings.json', {'cache': true}).then(function(res) {
        ctrl.settings = res.data;
        ctrl.id = false;
        ctrl.cartDialog = false;
        ctrl.cart = resetCart();
      });
    };
    
    ctrl.$onChanges = function(changes) {
      
    };
  }],
  bindings: {
    settings: '<',
    products: '<',
  }
});

mdApp.controller('AppController', ['$scope', '$http', 'currencyFormaterFilter', function($scope, $http, currencyFormaterFilter) {
  
  $http.get('app/countries.json', {'cache': true}).then(function(res) {
    $scope.countries = res.data.list;
  });
  
  
  $scope.pattern = RegExp(/^\s*\w*\s*$/);
  
  $scope.cart = {};
  $scope.order = {
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
  $scope.cart.progress = function(value) {
    if (value === 'address') {
      $scope.cart.products.top = '-100%';
      $scope.cart.products.bottom = '100%';
      $scope.cart.address.top = '56px';
      $scope.cart.address.bottom = '0';
    }
    
  };
  $scope.cart.update_shipping = function(name, value) {
    if (name === 'country') {
      $scope.order.shipping.address.country = value;
      $scope.countryDialog.active = false;
    }
    if (name === 'state') {
      $scope.order.shipping.address.state = value;
    }
    if (name === 'city') {
      $scope.order.shipping.address.city = value;
    }
    if (name === 'postal_code') {
      $scope.order.shipping.address.postal_code = value;
    }
    if (name === 'line1') {
      $scope.order.shipping.address.line1 = value;
    }
    if (name === 'line2') {
      $scope.order.shipping.address.line2 = value;
    }
    if (name === 'name') {
      $scope.order.shipping.name = value;
    }
    if (name === 'phone') {
      $scope.order.shipping.phone = value;
    }
    if (name === 'email') {
      $scope.order.email = value;
    }
  };
  $scope.cart.register = function(validator) {
    $scope.cart.validator = validator;
  };
  $scope.cart.submit = function(form) {
    var isCartValid = $scope.cart.validator();
    if (isCartValid) {
      $scope.order_results = $scope.order;
    }
    if ($scope.submitLine === "Submit") {
      $scope.submitLine = "Bla";
    } else {
      $scope.submitLine = "Submit";
    }
    
    /*$http.post('https://mystical-banner-139818.appspot.com/pay', {'order': $scope.order}, {'cache': true}).then(function(res) {
      $scope.results = res.data;
    });*/
  };
  $scope.cartDialog = {'show': false, 'active': false};
  
  $scope.submitLine = "Submit";
  
  $scope.radio = "";
  
  $scope.num = "";
  
  $scope.update_radio = function(value) {
    $scope.radio = value;
  };
  
  $scope.simpleDialog = {'show': false, 'active': false};
  $scope.drawerWideDialog = {'show': false, 'active': false};
  $scope.openDialog = function(dialog, title, options, callback) {
    $scope.options_title = title;
    $scope.options = options;
    $scope.option_callback = callback;
    $scope[dialog].show = true;
    $scope[dialog].active = true;
  };
  $scope.closeDialog = function(dialog) {
    $scope[dialog].show = false;
    $scope[dialog].active = false;
    $scope.options_title = '';
    $scope.options = '';
    $scope.option_callback = '';
  };
}]);
