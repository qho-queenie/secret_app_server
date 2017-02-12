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
    .otherwise({
      templateUrl: "signup.html"
    })
  });
