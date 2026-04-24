import os
import json

def explore_directory(path, extensions=['.js', '.jsx'], max_depth=4, current_depth=0):
    """Explore directory structure and find relevant files"""
    if current_depth >= max_depth:
        return
    
    try:
        items = os.listdir(path)
        for item in sorted(items):
            if item.startswith('.'):
                continue
            
            item_path = os.path.join(path, item)
            
            if os.path.isdir(item_path):
                if item not in ['node_modules', '.git', 'uploads', '.venv']:
                    print('  ' * current_depth + f"📁 {item}/")
                    explore_directory(item_path, extensions, max_depth, current_depth + 1)
            elif os.path.isfile(item_path):
                if any(item.endswith(ext) for ext in extensions):
                    print('  ' * current_depth + f"📄 {item}")
    except PermissionError:
        pass

print("\n=== SERVER STRUCTURE ===")
explore_directory('/home/khan/Downloads/Project/InterNova/server', ['.js'])

print("\n\n=== CLIENT STRUCTURE ===")
explore_directory('/home/khan/Downloads/Project/InterNova/client/src', ['.js', '.jsx'])
