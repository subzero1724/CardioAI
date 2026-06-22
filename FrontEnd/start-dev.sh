#!/bin/bash
cd "$(dirname "$0")"
node node_modules/.bin/vite --port 3000 --host 0.0.0.0
