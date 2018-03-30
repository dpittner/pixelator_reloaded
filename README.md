# pixelator_reloaded

Trying to batch convert images? Imagemagick doesn't work out of the box for you? Using elaborate shell seems quirky? 
This tool may help you... in my specific case, I needed to move the files to a mirrored directory structure after conversion, which seemed to be not possible with ImageMagick (or my lack of understanding ImageMagick). After trying for a while, I decided to hack together a small node cli (Limited bash skills ;-) ) to convert stuff for me. 

Maybe this is usefull for others...

## Setup:

NOTE: Node 8 >= is required

```javascript
git clone https://github.com/dpittner/pixelator_reloaded.git
npm install 
node pixelator.js
```

Will output something like:

```bash
Usage: pixelator.js [options]

Options:
  --version     Show version number                                    [boolean]
  -s, --source  Source directory                                      [required]
  -p, --prefix  Prefix in target directory                   [default: "output"]
  -f, --format  target format                                   [default: "jpg"]
  -h, --help    Show help                                              [boolean]

Examples:
  pixelator.js -s /home/media/usb01 -p output

copyright 2018

Missing required argument: s
```

