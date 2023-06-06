#!/bin/sh
echo What is the password?
read PASSWORD
node mongo.js $PASSWORD "Arto Hellas" 040-123456
node mongo.js $PASSWORD "Ada Lovelace" 39-44-5323523
node mongo.js $PASSWORD "Dan Abramov" 12-43-234345
node mongo.js $PASSWORD "Mary Poppendieck" 39-23-6423122
node mongo.js $PASSWORD