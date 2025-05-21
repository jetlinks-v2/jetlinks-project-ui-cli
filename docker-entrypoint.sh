#!/usr/bin/env bash

SERVER_NAME=$SERVER_NAME;

NAMESERVERS=$(cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' ')

resolver="resolver $NAMESERVERS ipv6=off;"

sed -i '11c '"$resolver"'' /etc/nginx/conf.d/default.conf

#cat /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"

