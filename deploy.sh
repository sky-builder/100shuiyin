#!/bin/bash

ls -l

ssh root@47.240.77.251 -t "cd 100shuiyin && git checkout master && git pull && npm run build && ls -l ./build"

# sftp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 << EOF
# put ./build/index.html /root/webhook/index.html
# EOF