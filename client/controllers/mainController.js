app.controller("mainController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
  $scope.users = [];
  $scope.contacts = [];
  $scope.events = [];

  $http.get('/display_events').then(function(res){
    console.log(res.data.data);
    $scope.events = res.data.data;
  });

  $http.get('/display_contacts').then(function(res){
    console.log(res.data.data);
    $scope.contacts = res.data.data;
  });

  $scope.addUser = function() {
    $scope.users.push($scope.newUser);
    $http.post('/registration', $scope.newUser).then(function(res){
      console.log(res);
    });
    window.location.href = "#/account";
  }
  $scope.addContact = function(){
    $scope.contacts.push($scope.newContact);
    $http.post('/add_new_contact', $scope.newContact).then(function(res){
      console.log(res);
    });
  }
  $scope.loginUser = function(){
    $http.post('/login', $scope.login).then(function(res){
      console.log(res);
    });
    window.location.href = "#/account";
  };
  $scope.startCountdown = function(){
    var data = {
      contact: $scope.chosen_contact,
      event: $scope.chosen_event,
      minutes: $scope.minutes,
    };
    $http.post('/start_task', data).then(function(res){
      console.log(res);
    });
  };
  $scope.chooseEvent = function(index){
    $scope.chosen_event = events[index];
  };
  $scope.chooseContact = function(index){
    $scope.chosen_contact = contacts[index];
  };


}])


