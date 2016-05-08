#!/bin/bash

#arguments: 1-> FM command, 2->plug number  , 3 -> music host

#turn on raspberry pi
sudo /home/pi/rcswitch-pi/send $1 $2 0;
sleep 1;

#send command to play repository in room
curl -i -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","method":"Player.Stop","id":"1","params":{"playerid":0}}' http://$3/jsonrpc;
