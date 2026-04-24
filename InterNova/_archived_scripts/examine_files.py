#!/usr/bin/env python3
import os
import glob

server_dir = '/home/khan/Downloads/Project/InterNova/server'

print("\n" + "="*80)
print("EXAMINING SERVER DIRECTORY STRUCTURE")
print("="*80)

# Walk through server directory
for root, dirs, files in os.walk(server_dir):
    # Skip node_modules
    dirs[:] = [d for d in dirs if d != 'node_modules']
    
    level = root.replace(server_dir, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    
    subindent = ' ' * 2 * (level + 1)
    for file in sorted(files):
        if file.endswith('.js'):
            print(f'{subindent}{file}')

print("\n" + "="*80)
print("KEY FILES TO EXAMINE")
print("="*80)

# Find specific files
key_patterns = [
    'models/Candidate.js',
    'models/Company.js',
    'models/User.js',
    'models/Job.js',
    'models/Application.js',
    'controllers/*candidate*.js',
    'controllers/*company*.js',
    'controllers/*job*.js',
    'controllers/*application*.js',
    'routes/*candidate*.js',
    'routes/*company*.js',
    'routes/*job*.js',
    'routes/*application*.js',
]

for pattern in key_patterns:
    full_pattern = os.path.join(server_dir, pattern)
    matches = glob.glob(full_pattern)
    for match in matches:
        rel_path = os.path.relpath(match, server_dir)
        print(f"\n📄 {rel_path}")
        
        # Read first 50 lines to understand structure
        try:
            with open(match, 'r') as f:
                lines = f.readlines()[:50]
                print(''.join(lines))
                if len(f.readlines()) > 0:
                    print("... (file continues)")
        except:
            pass
