#!/usr/bin/env python3
"""
Profile Completion Implementation Script
Analyzes existing MERN job portal and implements role-based validation
"""

import os
import re
import json
from pathlib import Path

BASE_DIR = Path('/home/khan/Downloads/Project/InterNova')
SERVER_DIR = BASE_DIR / 'server'
CLIENT_DIR = BASE_DIR / 'client'

def find_files(directory, pattern):
    """Find files matching pattern"""
    files = []
    for root, dirs, filenames in os.walk(directory):
        # Skip node_modules and other unwanted directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'uploads', '.venv', 'dist', 'build']]
        for filename in filenames:
            if re.search(pattern, filename):
                files.append(os.path.join(root, filename))
    return files

def read_file(filepath):
    """Safely read file content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

def analyze_project_structure():
    """Analyze the project structure"""
    print("=" * 80)
    print("ANALYZING PROJECT STRUCTURE")
    print("=" * 80)
    
    # Find key server files
    print("\n📁 SERVER FILES:")
    server_files = {
        'models': find_files(SERVER_DIR / 'models', r'(Candidate|Company|User|Job|Application)\.js$'),
        'controllers': find_files(SERVER_DIR / 'controllers', r'(candidate|company|job|application|auth)Controller\.js$'),
        'routes': find_files(SERVER_DIR / 'routes', r'(candidate|company|job|application|auth)Routes?\.js$'),
        'middleware': find_files(SERVER_DIR / 'middleware', r'(auth|rbac)\.js$'),
    }
    
    for category, files in server_files.items():
        print(f"\n  {category.upper()}:")
        for f in files:
            print(f"    - {os.path.relpath(f, BASE_DIR)}")
    
    # Find key client files  
    print("\n📁 CLIENT FILES:")
    client_files = {
        'profile_pages': find_files(CLIENT_DIR / 'src', r'(CandidateProfile|CompanyProfile|Profile)\.jsx$'),
        'job_pages': find_files(CLIENT_DIR / 'src', r'(JobDetail|JobList|ApplyJob|PostJob)\.jsx$'),
        'components': find_files(CLIENT_DIR / 'src/components', r'.*\.(jsx|js)$')[:20],  # Limit output
    }
    
    for category, files in client_files.items():
        print(f"\n  {category.upper()}:")
        for f in files[:10]:  # Limit output
            print(f"    - {os.path.relpath(f, BASE_DIR)}")
    
    return server_files, client_files

def analyze_file_content(filepath, keywords):
    """Analyze file for specific keywords"""
    content = read_file(filepath)
    if not content:
        return None
    
    results = {}
    for keyword in keywords:
        if keyword in content:
            results[keyword] = True
            # Find the line
            for i, line in enumerate(content.split('\n'), 1):
                if keyword in line:
                    results[f"{keyword}_line"] = i
                    break
    return results

def generate_implementation_report():
    """Generate implementation report with findings"""
    server_files, client_files = analyze_project_structure()
    
    print("\n" + "=" * 80)
    print("IMPLEMENTATION ANALYSIS")
    print("=" * 80)
    
    # Analyze models
    print("\n🔍 ANALYZING MODELS...")
    for model_file in server_files.get('models', []):
        content = read_file(model_file)
        if content:
            filename = os.path.basename(model_file)
            print(f"\n  {filename}:")
            
            # Check for schema fields
            if 'Schema' in content:
                print(f"    ✓ Contains Mongoose Schema")
            if 'education' in content.lower():
                print(f"    ✓ Has education field")
            if 'skills' in content.lower():
                print(f"    ✓ Has skills field")
            if 'resume' in content.lower():
                print(f"    ✓ Has resume field")
    
    # Analyze controllers
    print("\n🔍 ANALYZING CONTROLLERS...")
    for controller_file in server_files.get('controllers', []):
        content = read_file(controller_file)
        if content:
            filename = os.path.basename(controller_file)
            print(f"\n  {filename}:")
            
            # Check for key functions
            if 'getProfile' in content or 'getCandidateProfile' in content:
                print(f"    ✓ Has getProfile function")
            if 'updateProfile' in content or 'updateCandidate' in content:
                print(f"    ✓ Has updateProfile function")
            if 'applyJob' in content or 'applyForJob' in content:
                print(f"    ✓ Has applyJob function")
            if 'postJob' in content or 'createJob' in content:
                print(f"    ✓ Has postJob/createJob function")
    
    print("\n" + "=" * 80)
    print("READY FOR IMPLEMENTATION")
    print("=" * 80)
    print("\nNext steps:")
    print("1. Update controllers to include profile completion")
    print("2. Add validation guards to apply/post endpoints")
    print("3. Create frontend progress bar components")
    print("4. Update profile pages to display completion")

if __name__ == '__main__':
    generate_implementation_report()
