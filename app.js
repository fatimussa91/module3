// Define the module
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

// Controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrow = this;

  narrow.narrowItDown = function() {
    if (narrow.searchTerm) {
      MenuSearchService.getMatchedMenuItems(narrow.searchTerm)
      .then(function(foundItems) {
        narrow.found = foundItems;
        narrow.message = "";
      })
      .catch(function() {
        narrow.message = "Nothing found";
      });
    } else {
      narrow.message = "Nothing found";
      narrow.found = [];
    }
  };

  narrow.removeItem = function(index) {
    narrow.found.splice(index, 1);
  };
}

// Service
MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: "GET",
      url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
    }).then(function(response) {
      var foundItems = [];
      var menuItems = response.data;
      for (var key in menuItems) {
        if (menuItems[key].description.includes(searchTerm)) {
          foundItems.push(menuItems[key]);
        }
      }
      return foundItems;
    });
  };
}

// Directive
function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };
  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;
}
