#!/bin/bash
#
npm run generate

cp -r dist ./electron/

cd electron

cd dist
find ./ -type f -exec sed -i -e 's/\/_nuxt/.\/_nuxt/g' {} \;

cd ..
npm run start
