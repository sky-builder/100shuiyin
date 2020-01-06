#!/bin/bash

sftp root@47.240.77.251 << EOF
put ./build/index.html /root/webhook/index.html
EOF