@echo off
TITLE Prospi Punto de Venta

git diff --quiet || (git stash && git pull origin master && npm i --save)

npm start
exit