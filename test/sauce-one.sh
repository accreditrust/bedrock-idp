#!/bin/bash
BATCH=$(date +%k%M)
node --preserve-symlinks test test --framework protractor --sauce-config $1 --sauce-name $BATCH-bedrock-idp