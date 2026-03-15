#!/usr/bin/env bash

rm -rf ./static-server-frontend || true
cd ./FRONTEND-REACT
npm run build
cd ..
mv ./FRONTEND-REACT/dist ./static-server-frontend