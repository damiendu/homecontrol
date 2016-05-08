#!/bin/bash


#arguments: 1-> FM command, 2->plug number  , 3 -> music host, 4-> playlist

#turn on raspberry pi
sudo /home/pi/rcswitch-pi/send $1 $2 1;
sleep 1;

#send command to play repository in room
curl -i -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":"1","method":"Player.Open","params":{"item":{"directory":"'$4'"},"options":{"shuffled":true}}}' http://$3/jsonrpc;
