#!/bin/bash

echo "Testing Ethos Reputation Gate API..."
echo ""

echo "1. Health Check"
curl http://localhost:8000/health
echo -e "\n"

echo "2. API Info"
curl http://localhost:8000/
echo -e "\n"

echo "3. Check Access - Signature Required"
curl -X POST http://localhost:8000/api/check-access \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "minScore": 1400
  }'
echo -e "\n"

echo "Tests complete!"
