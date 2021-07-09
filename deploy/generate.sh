#!/bin/sh -e

echo "Generating initial stats..."
/opt/eva/venv/bin/python /opt/sse/_online-demo-initial-generator.py
echo "Initial stats generated successfully"
