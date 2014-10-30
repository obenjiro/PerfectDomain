#!/bin/sh

killall node
node server & node client & open http://127.0.0.1:8000 & read -p "Press any key..."