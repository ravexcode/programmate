from pathlib import Path
import sys

search = sys.argv[1]
find = sys.argv[2]
directory = sys.argv[3]

print("Process starter, command set: " + str(sys.argv))

for file in Path(directory).rglob("*"):
    if file.is_file():
        try:
            text = file.read_text()

            if search.lower() in text.lower():
                new_text = text.replace(search, find)
                file.write_text(new_text)
                print("file changed: " + file.__dir__)
        except:
            pass
        
print("Process finished")