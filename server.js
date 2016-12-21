http = require('http');
var express = require('express');
var fs      = require('fs');

var WebApp = function() {
    var self = this;
    self.setupVariables = function() {
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            self.ipaddress = "127.0.0.1";
        };
    };
    self.initializeServer = function() {
        self.app = express();
        self.server= http.createServer(self.app);
        self.app.use(express.static(__dirname + '/'));
    };

    self.initialize = function() {
        self.setupVariables();
        self.initializeServer();
    };

    self.start = function() {
        self.server.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

}; 

var zapp = new WebApp();
zapp.initialize();
zapp.start();