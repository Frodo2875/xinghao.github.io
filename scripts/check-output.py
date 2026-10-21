"""Validate internal links and resources in a Hugo build (Python standard library)."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.urls.append(value)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("base_url")
    args = parser.parse_args()
    base = urlsplit(args.base_url)
    prefix = base.path.rstrip("/") + "/"
    errors = []
    checked = 0
    pages = list(args.directory.rglob("*.html"))
    for page in pages:
        relative = page.relative_to(args.directory).as_posix()
        page_url = urljoin(args.base_url, relative.removesuffix("index.html"))
        links = Links()
        links.feed(page.read_text(encoding="utf-8"))
        for value in links.urls:
            if value.startswith("#"):
                continue
            parsed = urlsplit(urljoin(page_url, value))
            if parsed.scheme not in ("http", "https") or parsed.netloc != base.netloc:
                continue
            path = unquote(parsed.path)
            if not path.startswith(prefix):
                errors.append(f"{relative}: URL escapes site prefix: {value}")
                continue
            target = args.directory / path[len(prefix):]
            if target.is_dir():
                target /= "index.html"
            checked += 1
            if not target.is_file():
                errors.append(f"{relative}: missing {value}")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"PASS: {len(pages)} HTML pages, {checked} internal links/resources.")


if __name__ == "__main__":
    main()
