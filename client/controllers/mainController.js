var loop;
app.controller("mainController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
  $scope.users = [];
  $scope.contacts = [];
  $scope.events = [];
  $scope.user = [];
  $scope.choices = {};

  if(window.location.hash != "#/"){
    document.getElementById("navbar").style.visibility = "visible";
  }else{
    document.getElementById("navbar").style.visibility = "hidden";
  }

$scope.load = function(){
    $http.get('/display_events').then(function(res){
      console.log(res.data.data);
      $scope.events = res.data.data;
    });

    $http.get('/display_user').then(function(res){
      console.log(res.data.data);
      $scope.user = res.data.data;
    });

    $http.get('/display_contacts').then(function(res){
      console.log(res.data.data);
      $scope.contacts = res.data.data;

      for(var contact of $scope.contacts){
        contact.contact_status = ["Pending", "Accepted", "Rejected"][parseInt(contact.contact_status)];
      }
    });
  };
  $scope.load();

  $scope.addUser = function() {
    $scope.users.push($scope.newUser);
    $http.post('/registration', $scope.newUser).then(function(res){
      console.log(res);
    });
    window.location.href = "#/account";
  };

  $scope.addContact = function(){
    $scope.contacts.push(Object.assign({}, $scope.newContact));
    $http.post('/add_new_contact', $scope.newContact).then(function(res){
      console.log(res);
    });
  };

  $scope.addTask = function(){
    $scope.events.push(Object.assign({}, $scope.newEvent));
    $http.post('/add_new_event', $scope.newEvent).then(function(res){
      console.log(res);
    });
  };

  $scope.loginUser = function(){
    $http.post('/login', $scope.login).then(function(res){
      console.log(res);
      window.location.href = "#/account";
    });
  };

  $scope.startCountdown = function(){
    var data = {
      contact: $scope.chosen_contact,
      event: $scope.chosen_event,
      minutes: $scope.minutes,
      user: $scope.user
    };
    $http.post('/start_task', data).then(function(res){
      console.log(res);
      var countdownContainer = document.getElementById("countdownContainer");
      var minCounter = document.getElementById("minCounter");
      var secCounter = document.getElementById("secCounter");
      minute = $scope.minutes;
      minCounter.innerText = ((minute < 10)?"0":"") + minute;
      second = 0;
      secCounter.innerText = "00";
      countdownContainer.style.visibility = "visible";

      if(loop){
        clearInterval(loop);
      }
      loop = setInterval(function(){
        if(--second < 0){
          second = 59;
          minute--;
        }
        if(minute < 0){
          secCounter.innerText = "00";
          minCounter.innerText = "00";
          clearInterval(loop);
        }else{   
          secCounter.innerText = ((second < 10)?"0":"") + second;
          minCounter.innerText = ((minute < 10)?"0":"") + minute;
        }
      }, 1000);
    });
  };

  $scope.deleteContact = function(index) {
    $http.get(`/delete_contact?id=${$scope.contacts[index].id}`).then(function(res){
      console.log(res);
    });
    $scope.load();
  }

  $scope.deleteEvent = function(index) {
    $http.get(`/delete_event?id=${$scope.events[index].id}`).then(function(res){
      console.log(res);
    });
    $scope.load();
  }

  $scope.chooseEvent = function(index){
    if($scope.lastChoiceButton)
      $scope.lastChoiceButton.style["background-color"] = "";
    $scope.lastChoiceButton = document.getElementById("chooseEventButton" + index);
    $scope.lastChoiceButton.style["background-color"] = "#ffff00";
    $scope.chosen_event = $scope.events[index];
  };

  $scope.chooseContact = function(index){
    if($scope.lastChoiceButton)
      $scope.lastChoiceButton.style["background-color"] = "";
    $scope.lastChoiceButton = document.getElementById("chooseContactButton" + index);
    $scope.lastChoiceButton.style["background-color"] = "#ffff00";
    $scope.chosen_contact = $scope.contacts[index];
    console.log("chosen_contact:", $scope.chosen_contact);
    console.log($scope.contacts[index]);
  };

  $scope.endCurrentTask = function(index){
    $http.get('/end_current_task').then(function(res){
      console.log(res);
    });
  };

}])


