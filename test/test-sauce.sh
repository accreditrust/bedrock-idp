#!/bin/bash
BATCH=$(date +%k%M)
CONFIGS=$(find protractor/sauce-configs/ -name "*.js")
for line in $CONFIGS; do
  node --preserve-symlinks test test --framework protractor --sauce-config $line --sauce-name $BATCH-bedrock-idp
done