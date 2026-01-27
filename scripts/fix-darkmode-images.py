import re

file_path = "src/components/DarkMode.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Add import if not present
if "import Image from 'next/image';" not in content:
    content = content.replace(
        "import React from 'react';",
        "import React from 'react';\nimport Image from 'next/image';",
    )

# Regex to find img tags with src={variable}
# Pattern: <img alt="" className="block max-w-none size-full" src={imgVariable} />
# We want: <Image alt="" className="block max-w-none size-full" src={imgVariable} fill unoptimized />


# Use a function to handle the replacement to preserve the variable name
def replace_img(match):
    # match.group(0) is the whole tag
    # We want to extract attributes.
    # Simple approach: replace "<img " with "<Image " and " />" with " fill unoptimized />"
    # But we need to be careful.

    tag = match.group(0)
    if "src={" in tag:
        new_tag = tag.replace("<img", "<Image").replace("/>", "fill unoptimized />")
        return new_tag
    return tag


# Regex for the specific pattern seen in the file
# <img alt="" className="block max-w-none size-full" src={img...} />
pattern = (
    r'<img\s+alt=""\s+className="block max-w-none size-full"\s+src=\{([^}]+)\}\s*/>'
)


# Replacement function
def replacer(match):
    var_name = match.group(1)
    return f'<Image alt="" className="block max-w-none size-full" src={{{var_name}}} fill unoptimized />'


new_content = re.sub(pattern, replacer, content)

with open(file_path, "w") as f:
    f.write(new_content)

print("Replaced img tags with Image components.")
