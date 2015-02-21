var _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    ReverseProxyStrategy = require('passport-reverseproxy');

function ReverseProxy(options, core) {
    this.options = options;

    if (this.options.use_ldap_authorization) {
        this.ldap = require('lets-chat-ldap').auth;
    }

    this.core = core;
    this.key = 'reverseproxy';

    this.setup = this.setup.bind(this);
    this.getReverseProxyStrategy = this.getReverseProxyStrategy.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.getReverseProxyCallback = this.getReverseProxyCallback.bind(this);
    this.createSimpleReverseProxyUser = this.createSimpleReverseProxyUser.bind(this);
}

ReverseProxy.key = 'reverseproxy';

ReverseProxy.prototype.setup = function() {
    passport.use(this.getReverseProxyStrategy());
};

ReverseProxy.prototype.getReverseProxyStrategy = function() {
    var userHeader = this.options.userHeader;
    var headers = {};
    headers[userHeader] = { alias: 'username', required: true };

    return new ReverseProxyStrategy(
        {
            headers: headers
        },
        function (headers, user, done) {
            return done(null, headers[userHeader]);
        }
    );
};

ReverseProxy.prototype.authenticate = function(req, cb) {
    cb = this.getReverseProxyCallback(cb);
    passport.authenticate('reverseproxy', cb)(req);
};

ReverseProxy.prototype.getReverseProxyCallback = function(done) {
    return function(err, username, info) {
        if (err) {
            return done(err);
        }

        if (!username) {
            // Authentication failed
            return done(err, username, info);
        }

        var User = mongoose.model('User');
        User.findOne({ uid: username }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (this.options.use_ldap_authorization) {
                var opts = _.extend(this.options.ldap, {'reverseproxy': true});
                return this.ldap.authorize(opts, this.core, username, done);

            } else {
                // Not using LDAP
                if (user) {
                    return done(null, user);
                } else {
                    this.createSimpleReverseProxyUser(username,
                        function(err, newUser) {
                        if (err) {
                            console.error(err);
                            return done(err);
                        }
                        return done(err, newUser);
                    });
                }
            }
        }.bind(this));
    }.bind(this);
};

ReverseProxy.prototype.createSimpleReverseProxyUser = function(username, cb) {
    this.core.account.create('reverseproxy', {
        uid: username,
        username: username,
        displayName: username,
        firstName: username,
        lastName: username,
        email: username.concat("@localhost.com")
    }, cb);
};

module.exports = ReverseProxy;
