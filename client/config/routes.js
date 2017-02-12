var app = angular.module("app", ["ngRoute"]);

  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "/partials/signup.html",
      controller: "mainController"
    })
    .when("/account", {
        templateUrl: "/partials/account.html",
        controller: "mainController"
      })
    .when("/step1", {
        templateUrl: "/partials/step1_tasks.html",
        controller: "mainController"
      })
    .when("/step2", {
        templateUrl: "/partials/step2_contacts.html",
        controller: "mainController"
      })
    .when("/step3", {
        templateUrl: "/partials/step3_countdown.html",
        controller: "mainController"
      })
    .otherwise({
      templateUrl: "signup.html"
    })
  });
