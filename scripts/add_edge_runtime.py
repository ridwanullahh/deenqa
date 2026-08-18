#!/usr/bin/env python3
"""Bismillah. Adds `export const runtime = "edge"` and
`export const dynamic = "force-dynamic"` to every Next.js API
route.ts file, placing them after the import block. Removes any
existing duplicates first.

Usage: python3 scripts/add_edge_runtime.py [app/api]
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

RUNTIME_LINE = 'export const runtime = "edge"'
DYNAMIC_LINE = 'export const dynamic = "force-dynamic"'

# Match any runtime/dynamic declaration (with or without semicolon).
RUNTIME_RE = re.compile(
    r'^\s*export\s+const\s+runtime\s*=\s*[\'"]edge[\'"]\s*;?\s*\n',
    re.MULTILINE,
)
DYNAMIC_RE = re.compile(
    r'^\s*export\s+const\s+dynamic\s*=\s*[\'"]force-dynamic[\'"]\s*;?\s*\n',
    re.MULTILINE,
)


def find_end_of_imports(text: str) -> int:
    """Return the character offset AFTER the last import statement.

    Handles both single-line and multi-line imports. An import starts
    with `import ` (or `import{`) and ends with `;` (or at the matching
    closing `}` for `import {...} from "..."` followed by optional `;`).
    """
    pos = 0
    last_end = 0
    while True:
        m = re.search(r'^import\b', text[pos:], re.MULTILINE)
        if not m:
            break
        start = pos + m.start()
        # Find the end: scan for the matching `;` or `\n` after `}`
        # Simple approach: find the first `;` or newline-balanced `}`.
        i = start
        depth = 0
        in_string = False
        string_char = ""
        while i < len(text):
            ch = text[i]
            if in_string:
                if ch == "\\":
                    i += 2
                    continue
                if ch == string_char:
                    in_string = False
                i += 1
                continue
            if ch in ('"', "'"):
                in_string = True
                string_char = ch
                i += 1
                continue
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
            elif ch == ";" and depth == 0:
                i += 1
                break
            elif ch == "\n" and depth == 0:
                # implicit semicolon at end of line for ESM imports
                # but only if line is not a continuation
                break
            i += 1
        last_end = i
        pos = i
    return last_end


def process_file(path: Path) -> bool:
    text = path.read_text()
    original = text

    # Remove existing runtime/dynamic declarations
    text = RUNTIME_RE.sub("", text)
    text = DYNAMIC_RE.sub("", text)

    # Collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Find end of imports and insert after
    end_of_imports = find_end_of_imports(text)
    if end_of_imports == 0:
        # No imports — put at the top
        text = f"{RUNTIME_LINE}\n{DYNAMIC_LINE}\n\n" + text
    else:
        insertion = f"\n\n{RUNTIME_LINE}\n{DYNAMIC_LINE}\n"
        text = text[:end_of_imports] + insertion + text[end_of_imports:]

    text = re.sub(r"\n{3,}", "\n\n", text)

    if text != original:
        path.write_text(text)
        return True
    return False


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("app/api")
    if not root.exists():
        print(f"ERROR: {root} does not exist")
        return 1
    count = 0
    seen: set[Path] = set()
    patterns = ["page.tsx", "route.ts", "layout.tsx", "page.ts", "route.tsx", "layout.ts"]
    for pattern in patterns:
        for path in root.rglob(pattern):
            if path in seen:
                continue
            seen.add(path)
            if process_file(path):
                print(f"  updated: {path}")
                count += 1
    print(f"\nDone. {count} file(s) updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
