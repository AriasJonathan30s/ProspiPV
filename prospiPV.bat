@echo off
TITLE Prospi Punto de Venta

git diff --quiet || (git stash && git pull force origin master && npm i --save)

npm start
exit