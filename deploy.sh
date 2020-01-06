#!/bin/bash

sftp root@10.42.255.209 << EOF
put ./build/index.html /root/webhook/index.html
EOF