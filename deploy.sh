#!/bin/bash

ls -l

sftp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 << EOF
put ./build/index.html /root/webhook/index.html
EOF