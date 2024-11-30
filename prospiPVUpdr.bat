@echo off
TITLE Prospi Punto de Venta Updater

git diff --quiet || (
    git stash
    git pull
    npm i --save )
exit