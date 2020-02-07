#!/bin/bash

ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 -t "cd 100shuiyin && git checkout master && git fetch origin master && git reset --hard FETCH_HEAD && npm install & npm run build && cp -r build/* /var/www/html"

# sftp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 << EOF
# put -r ./build/* /var/www/html
# EOF