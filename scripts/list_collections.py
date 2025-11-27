#!/usr/bin/env python3
import requests
import json

# Read token
with open('/tmp/pb_token.txt', 'r') as f:
    token = f.read().strip()

# Get collections
response = requests.get(
    'http://localhost:8090/api/collections?perPage=100',
    headers={'Authorization': token}
)

data = response.json()

# List non-system collections
print("Custom collections:")
for c in data['items']:
    if not c['name'].startswith('_'):
        print(f"  {c['name']}: {c['id']}")

print(f"\nTotal: {len([c for c in data['items'] if not c['name'].startswith('_')])} custom collections")
