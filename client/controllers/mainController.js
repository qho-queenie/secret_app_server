app.controller("mainController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
  $scope.users = [];
  $scope.contacts = [];
  $scope.addUser = function() {
    $scope.users.push($scope.newUser);
    $http.post('/registration', $scope.newUser).then(function(res){
      console.log(res);
    })
    window.location.href = "#/account";
  }
  $scope.addContact = function(){
    $scope.contacts.push($scope.newContact);
    $http.post('/add_new_contact', $scope.newContact).then(function(res){
      console.log(res);
    })
    window.location.href = "#/account";
  }
}])


