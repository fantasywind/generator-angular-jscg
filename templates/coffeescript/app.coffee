'use strict'

###*
 # @ngdoc overview
 # @name <%= scriptAppName %>
 # @description
 # # <%= scriptAppName %>
 #
 # Main module of the application.
###
angular
  .module('<%= scriptAppName %>', [<%= angularModules %>])<% if (ngRoute) { %>
  .config(($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .otherwise
        redirectTo: '/'
  )
<% } %><% if (socketio) {%>
  .factory '$socket', (socketFactory)->
    $socket = socketFactory()
    $socket.forward 'error'
    return $socket
<% }%>