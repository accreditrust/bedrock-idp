#!/bin/bash
BATCH=$(date +%k%M)
for run in {1..5}
do
  node --preserve-symlinks test test --framework protractor --sauce-config $1 --sauce-name $BATCH-bedrock-idp-hammer-$run
done

