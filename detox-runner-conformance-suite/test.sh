#!/bin/bash

cleanup() {
  rm -rf e2e
  git checkout -- adapter.js
}

cleanup
node -e 'require("./init")()'
rm e2e/*.spec.js
cp test/* e2e/
sed -i -E "s/require.'detox'/require('detox-runner-conformance-suite\/detox'/" adapter.js
sed -i -E "s/require.'detox'/require('detox-runner-conformance-suite\/detox'/" e2e/init.js
cd e2e
pwd
npm install
npm test
cd ..
cleanup
