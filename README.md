# Let's Chat - Reverse Proxy Plugin

Add Reverse Proxy authentication to [Let's Chat](http://sdelements.github.io/lets-chat/).

## Node 0.10.x required!
[See ticket for more information](https://github.com/sdelements/lets-chat-kerberos/issues/1)

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
