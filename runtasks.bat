@echo off
timeout /t 180 /nobreak
npm run test
npm run testWithCoverage
npm run test:dev
npm run test:api
