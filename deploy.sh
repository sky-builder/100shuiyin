#!/bin/bash

ls -l

sftp root@47.240.77.251 << EOF
yes
put ./build/index.html /root/webhook/index.html
EOF