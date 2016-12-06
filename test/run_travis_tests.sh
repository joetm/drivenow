#!/bin/bash
set -ev
# npm run eslint
# npm run jscs
# npm run test:coverage
# npm run test:karma
# coveralls < ./test/coverage/lcov.info
npm install
npm test
