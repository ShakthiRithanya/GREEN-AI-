import os

replace_map = {
    'rgba(16, 185, 129': 'rgba(217, 70, 239',
    'rgba(16,185,129': 'rgba(217,70,239',
    'rgba(59, 130, 246': 'rgba(99, 102, 241',
    'rgba(59,130,246': 'rgba(99,102,241',
    'emerald': 'fuchsia',
    'teal': 'purple',
    'cyan': 'violet',
    'blue': 'indigo',
    'amber': 'rose'
}

def swap_colors(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for old_color, new_color in replace_map.items():
        new_content = new_content.replace(old_color, new_color)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated colors in {file_path}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                swap_colors(os.path.join(root, file))

if __name__ == "__main__":
    process_directory(r"d:\green-ai-compressor\frontend\src")
