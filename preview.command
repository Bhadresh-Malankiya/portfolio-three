#!/bin/bash
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
(sleep 8; open http://localhost:3000) &
npm run dev
