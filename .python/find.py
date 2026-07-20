from pathlib import Path
import sys

if len(sys.argv) != 3:
    print("Usage: python find.py <search> <directory>")
    sys.exit(1)

search = sys.argv[1].lower()
directory = Path(sys.argv[2])

print(f"Searching '{search}' in '{directory}'...\n")

matches = 0

for file in directory.rglob("*"):
    if not file.is_file():
        continue

    try:
        text = file.read_text(encoding="utf-8", errors="ignore")

        if search in text.lower():
            matches += 1
            print(file)

    except (PermissionError, OSError):
        continue

print(f"\nFinished. {matches} file(s) found.")