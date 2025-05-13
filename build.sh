#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-storybook-ui:1.0.0-SNAPSHOT .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-storybook-ui:1.0.0-SNAPSHOT
