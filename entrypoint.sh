#!/bin/bash

echo "Starting LM Studio daemon..."
lms daemon up &

sleep 3

echo "Starting LM Studio OpenAI proxy..."
node index.js
