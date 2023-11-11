@echo off
ping /n 1 /w 180000 localhost >nul
npm run test
npm run testWithCoverage
npm run test:dev
npm run test:api
