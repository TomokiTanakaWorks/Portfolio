#!/usr/bin/env python3
"""Generate first-party WebP previews without modifying original portfolio media."""
from pathlib import Path
import re
from PIL import Image, ImageOps, UnidentifiedImageError
ROOT=Path(__file__).resolve().parent.parent
IMAGES=ROOT/"img"
OUT=ROOT/"assets"/"optimized"
PATTERN=re.compile(r'thumbnail:\s*"([^"]+)"')
SOURCE=(ROOT/"js"/"projects.js").read_text(encoding="utf-8")
THUMBS={re.sub(r'/+', '/', p).removeprefix("img/") for p in PATTERN.findall(SOURCE)}

def convert(src,relative,edge,thumb=False):
    stem=OUT/relative.with_suffix("")
    output=stem.with_name(stem.name+(".thumb.webp" if thumb else ".webp"))
    output.parent.mkdir(parents=True,exist_ok=True)
    with Image.open(src) as image:
        if getattr(image, "is_animated", False):return False
        im=ImageOps.exif_transpose(image)
        im.thumbnail((edge,edge),Image.Resampling.LANCZOS)
        if im.mode not in ("RGB","RGBA"):
            im=im.convert("RGBA" if "A" in im.getbands() else "RGB")
        im.save(output,format="WEBP",quality=(70 if thumb else 78),method=5)
    return True

def main():
    count=0
    for src in IMAGES.rglob("*"):
        if not src.is_file() or src.suffix.lower() not in {".jpg",".jpeg",".jfif",".png"}:continue
        relative=src.relative_to(IMAGES)
        if relative.parts[0] in {"icon","navi"} or src.name.lower()=="favicon.png":continue
        try:
            if convert(src,relative,1440):count+=1
            if relative.as_posix() in THUMBS:convert(src,relative,640,True)
        except (OSError,UnidentifiedImageError,ValueError) as error:
            print("SKIP",relative,error)
    generated=list(OUT.rglob("*.webp"))
    print("Optimized still images:",count,"WebP output files:",len(generated))

if __name__=="__main__":main()
