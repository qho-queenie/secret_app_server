var app = angular.module('app', []);
    app.controller('mainController', ['$scope', function($scope){
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
