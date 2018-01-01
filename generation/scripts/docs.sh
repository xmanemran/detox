#!/bin/bash
set -ex

FILES=( '../detox/src/ios/expect.js' )

for FILE in "${FILES[@]}"
do
    ./node_modules/.bin/documentation lint $FILE
    ./node_modules/.bin/documentation build $FILE -o 'jsdoc.json' --shallow -a 'public'

    # TODO: build the documentation from this file using node
    echo "$(cat jsdoc.json)"

    rm jsdoc.json
done

