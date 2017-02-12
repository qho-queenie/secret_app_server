app.controller("panelController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
  $scope.users = [];
  $scope.contacts = [];
  $scope.addUser = function() {
    $scope.users.push($scope.newUser);
    $scope.newUser = {};
  }
  $scope.addContact = function(){
    $scope.contacts.push($scope.newContact);
    $scope.newContact = {};
  }
}])
