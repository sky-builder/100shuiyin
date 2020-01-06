#!/bin/bash

ls -l

ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 -t "cd 100shuiyin && git checkout ci_setup && git pull && npm run build && cp -r build/* /var/www/html"

# sftp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 << EOF
# put ./build/index.html /root/webhook/index.html
# EOF