@echo off
TITLE Prospi Punto de Venta

git diff --quiet || (git stash && git pull origin master && npm i --save)

start ng serve --configuration=production --public-host -o
exit