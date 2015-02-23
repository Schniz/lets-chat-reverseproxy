# Let's Chat - Reverse Proxy Plugin

Add Reverse Proxy authentication to [Let's Chat](http://sdelements.github.io/lets-chat/).

## The "BTW"s
### XMPP is not supported
`lets-chat-reverseproxy` uses HTTP headers.
I'm not fimiliar with XMPP, but I guess it works differently than HTTP.

### LDAP integration isn't tested yet
you can test it yourself and send a pull request!

### Auto-login isn't implemented yet
`lets-chat` does not support it yet.

## Installation

### Install

```
npm install lets-chat-reverseproxy
```

### Configure

Add these settings to your ```settings.yml``` file:

```yml
auth:
  reverseproxy:
    userHeader: 'REMOTE_USER'
    use_ldap_authorization: false

    # if use_ldap_authorization == true
    ldap:
      connect_settings:
        url: ldap://example.com
        tlsOptions:
          ca: ca.pem
      server_certs: []
      bind_options:
        bindDN:
        bindCredentials:
      search:
        base:
        opts:
          scope: one
          filter: (uid={{username}})
          attributes: []
      field_mappings:
        uid: uid
        firstName: givenName
        lastName: sn
        displayName: givenName
        email: mail
```
