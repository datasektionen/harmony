#!/bin/bash

# Setup the SSH environment
mkdir -p ~/.ssh
eval `ssh-agent -s`
ssh-add - <<< "$SSH_PRIVATE_KEY"
ssh-keyscan medusa.datasektionen.se >> ~/.ssh/known_hosts

GIT_COMMAND="git push dokku@medusa.datasektionen.se:harmony harmony-official:main"

GIT_SSH_COMMAND="ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -p 22" $GIT_COMMAND
