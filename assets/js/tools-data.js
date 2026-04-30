/* Desi Jugad — central registry of all tools.
   Single source of truth for the command palette, recent-tools strip, and drop-zone routing.
   Loaded standalone by every page that needs the global ⌘K palette. */
(function () {
  'use strict';
  if (window.DJ_ALL_TOOLS) return; // idempotent

  /* Path prefix: when on /convert/* or /ai/* or /blog/* we need "../",
     when on root we need "" — keeps relative URLs working everywhere. */
  function pfx() {
    var p = window.location.pathname;
    if (p.indexOf('/convert/') !== -1 || p.indexOf('/ai/') !== -1 || p.indexOf('/blog/') !== -1) return '../';
    return '';
  }
  var P = pfx();

  window.DJ_ALL_TOOLS = [
    { name:'Image Converter',       desc:'PNG · JPG · WebP · BMP · GIF',                  url:P+'convert/image-converter.html',     icon:'🖼️' },
    { name:'Image Compressor',      desc:'Shrink PNG, JPG, WebP by up to 90%',            url:P+'convert/image-compress.html',      icon:'🗜️' },
    { name:'Image Resize + DPI',    desc:'Resize to exact pixels or target DPI',          url:P+'convert/image-resize.html',        icon:'📐' },
    { name:'Image Cropper',         desc:'Crop to any aspect ratio or custom size',       url:P+'convert/image-cropper.html',       icon:'🖼️' },
    { name:'Images to PDF',         desc:'Combine multiple images into a PDF',            url:P+'convert/image-to-pdf.html',        icon:'📄' },
    { name:'HEIC to JPG',           desc:'Convert iPhone HEIC/HEIF photos to JPEG',       url:P+'convert/heic-to-jpg.html',         icon:'📱' },
    { name:'JPG to WebP',           desc:'Convert JPG to modern WebP format',             url:P+'convert/jpg-to-webp.html',         icon:'🖼️' },
    { name:'WebP to JPG',           desc:'Convert WebP to JPG format',                    url:P+'convert/webp-to-jpg.html',         icon:'🖼️' },
    { name:'PDF to Images',         desc:'Extract PDF pages as PNG or JPG',               url:P+'convert/pdf-to-image.html',        icon:'📑' },
    { name:'PDF Merge & Split',     desc:'Combine PDFs or extract specific pages',        url:P+'convert/pdf-merge.html',           icon:'📋' },
    { name:'PDF Compressor',        desc:'Reduce PDF file size in your browser',          url:P+'convert/pdf-compressor.html',      icon:'📄' },
    { name:'PDF Rotate',            desc:'Rotate pages 90°, 180°, 270°',                  url:P+'convert/pdf-rotate.html',          icon:'🔄' },
    { name:'PDF Watermark',         desc:'Add text or image watermark to a PDF',          url:P+'convert/pdf-watermark.html',       icon:'💧' },
    { name:'SVG to PNG',            desc:'Rasterize vector graphics at any size',         url:P+'convert/svg-to-png.html',          icon:'🎨' },
    { name:'Photo Editor',          desc:'Crop, resize, rotate, flip, adjust',            url:P+'convert/photo-editor.html',        icon:'✂️' },
    { name:'Image Metadata',        desc:'View EXIF + remove sensitive metadata',         url:P+'convert/image-metadata.html',      icon:'🔍' },
    { name:'Image to Text (OCR)',   desc:'Extract text from photos and scans',            url:P+'convert/ocr.html',                 icon:'🔤' },
    { name:'Meme Generator',        desc:'Add top/bottom text to images',                 url:P+'convert/meme-generator.html',      icon:'😂' },
    { name:'Favicon Generator',     desc:'Create ICO/PNG favicons from image or emoji',   url:P+'convert/favicon-generator.html',   icon:'🌐' },
    { name:'Color Palette',         desc:'Extract palettes from images',                  url:P+'convert/color-palette.html',       icon:'🎨' },
    { name:'CSV to Excel',          desc:'Convert CSV to a proper .xlsx workbook',        url:P+'convert/csv-to-excel.html',        icon:'📊' },
    { name:'JSON ↔ CSV',            desc:'Flatten nested JSON to spreadsheet rows',       url:P+'convert/json-to-csv.html',         icon:'🔄' },
    { name:'JSON Formatter',        desc:'Beautify, minify and validate JSON',            url:P+'convert/json-formatter.html',      icon:'{}' },
    { name:'JSON ↔ YAML',           desc:'Convert between the two config formats',        url:P+'convert/json-to-yaml.html',        icon:'⚙️' },
    { name:'XML ↔ JSON',            desc:'Parse XML into JSON and serialize back',        url:P+'convert/xml-to-json.html',         icon:'🏷️' },
    { name:'Markdown to HTML',      desc:'Render Markdown as clean valid HTML',           url:P+'convert/markdown-to-html.html',    icon:'📝' },
    { name:'Base64 Encode/Decode',  desc:'Encode text or files to Base64 and back',       url:P+'convert/base64.html',              icon:'🔢' },
    { name:'Text Tools',            desc:'Case, URL encode, HTML escape, count',          url:P+'convert/text-tools.html',          icon:'✏️' },
    { name:'Word Counter',          desc:'Word, char, line, sentence count',              url:P+'convert/word-counter.html',        icon:'🔢' },
    { name:'Hash Generator',        desc:'SHA-1, SHA-256, SHA-384, SHA-512',              url:P+'convert/hash-generator.html',      icon:'#️⃣' },
    { name:'Diff Checker',          desc:'Compare two texts and highlight differences',   url:P+'convert/diff-checker.html',        icon:'🔍' },
    { name:'Regex Tester',          desc:'Test regular expressions live',                 url:P+'convert/regex-tester.html',        icon:'🔣' },
    { name:'URL Tools',             desc:'Encode/decode, parse, shorten URL',             url:P+'convert/url-tools.html',           icon:'🔗' },
    { name:'Timestamp Converter',   desc:'Unix ↔ human date, timezones',                  url:P+'convert/timestamp-converter.html', icon:'⏱️' },
    { name:'Code Beautifier',       desc:'Prettify HTML, CSS, JS, JSON, SQL, XML',        url:P+'convert/code-beautifier.html',     icon:'💅' },
    { name:'Readability Analyzer',  desc:'Flesch score, grade level, reading time',       url:P+'convert/readability-analyzer.html',icon:'📚' },
    { name:'Audio Converter',       desc:'MP3, WAV, OGG, M4A, FLAC',                      url:P+'convert/audio-converter.html',     icon:'🎵' },
    { name:'SRT ↔ VTT',             desc:'Convert subtitle formats',                      url:P+'convert/srt-to-vtt.html',          icon:'💬' },
    { name:'Video Converter',       desc:'MP4, WebM, MKV, AVI, MOV',                      url:P+'convert/video-converter.html',     icon:'🎬' },
    { name:'Video to Audio',        desc:'Extract MP3/WAV/OGG from video',                url:P+'convert/video-to-audio.html',      icon:'🎵' },
    { name:'Video Trimmer',         desc:'Cut and trim video clips',                      url:P+'convert/video-trimmer.html',       icon:'✂️' },
    { name:'Video Compressor',      desc:'Reduce video file size',                        url:P+'convert/video-compressor.html',    icon:'🗜️' },
    { name:'Video to GIF',          desc:'Convert video clips to animated GIF',           url:P+'convert/video-to-gif.html',        icon:'🖼️' },
    { name:'GIF to Video',          desc:'Convert animated GIF to MP4/WebM',              url:P+'convert/gif-to-video.html',        icon:'📹' },
    { name:'Password Generator',    desc:'Strong random passwords',                       url:P+'convert/password-gen.html',        icon:'🔑' },
    { name:'QR Code Generator',     desc:'QR codes from URL, text, phone, email',         url:P+'convert/qr-code.html',             icon:'⬛' },
    { name:'QR Scanner',            desc:'Scan QR from camera or image',                  url:P+'convert/qr-scanner.html',          icon:'📷' },
    { name:'Barcode Generator',     desc:'EAN, UPC, Code128, etc.',                       url:P+'convert/barcode-generator.html',   icon:'⏐' },
    { name:'Barcode Scanner',       desc:'Scan barcode from camera',                      url:P+'convert/barcode-scanner.html',     icon:'📷' },
    { name:'Secret Message',        desc:'Encrypt & decrypt with passphrase',             url:P+'convert/secret-message.html',      icon:'🔐' },
    { name:'Color Converter',       desc:'HEX, RGB, HSL, CMYK',                           url:P+'convert/color-converter.html',     icon:'🎨' },
    { name:'Unit Converter',        desc:'Length, weight, temp, area',                    url:P+'convert/unit-converter.html',      icon:'📏' },
    { name:'Currency Converter',    desc:'Live INR, USD, EUR rates',                      url:P+'convert/currency-converter.html',  icon:'💱' },
    { name:'Text to Speech',        desc:'Hindi, English, Tamil, 30+ languages',          url:P+'convert/text-to-speech.html',      icon:'🔊' },
    { name:'Speech to Text',        desc:'Live mic transcription',                        url:P+'convert/speech-to-text.html',      icon:'🎤' },
    { name:'Translate',             desc:'70+ languages, Hindi ↔ English',                url:P+'convert/translate.html',           icon:'🌐' },
    { name:'Email Validator',       desc:'Check syntax + suggest fixes',                  url:P+'convert/email-validator.html',     icon:'📧' },
    { name:'Pomodoro Timer',        desc:'Focus timer with stats',                        url:P+'convert/pomodoro-timer.html',      icon:'🍅' },
    { name:'Age Calculator',        desc:'Exact age in years, months, days',              url:P+'convert/age-calculator.html',      icon:'🎂' },
    { name:'Resume Builder',        desc:'Free PDF resume in your browser',               url:P+'convert/resume-builder.html',      icon:'📄' },
    { name:'Invoice Generator',     desc:'GST-compliant invoice PDF',                     url:P+'convert/invoice-generator.html',   icon:'🧾' },
    { name:'Receipt Generator',     desc:'Custom receipt as PDF/PNG',                     url:P+'convert/receipt-generator.html',   icon:'🧾' },
    { name:'SERP Simulator',        desc:'Preview Google search snippet',                 url:P+'convert/serp-simulator.html',      icon:'🔍' },
    { name:'SIP Calculator',        desc:'Mutual fund SIP returns',                       url:P+'convert/sip-calculator.html',      icon:'📈' },
    { name:'EMI Calculator',        desc:'Loan EMI, total interest',                      url:P+'convert/emi-calculator.html',      icon:'🏦' },
    { name:'Loan Calculator',       desc:'Home / personal / car loan',                    url:P+'convert/loan-calculator.html',     icon:'🏦' },
    { name:'Income Tax Calculator', desc:'New & old regime FY 2025-26',                   url:P+'convert/income-tax-calculator.html',icon:'🏛️' },
    { name:'GST Calculator',        desc:'GST inclusive / exclusive',                     url:P+'convert/gst-calculator.html',      icon:'💸' },
    { name:'BMI Calculator',        desc:'Body Mass Index with chart',                    url:P+'convert/bmi-calculator.html',      icon:'⚖️' },
    { name:'Percentage Calculator', desc:'%, increase, decrease, of-what',                url:P+'convert/percentage-calculator.html',icon:'💯' },
    { name:'CAGR Calculator',       desc:'Compound annual growth rate',                   url:P+'convert/cagr-calculator.html',     icon:'📈' },
    { name:'Compound Interest',     desc:'Compound interest calculator',                  url:P+'convert/compound-interest-calculator.html', icon:'💰' },
    { name:'Retirement Calculator', desc:'Target corpus + monthly SIP',                   url:P+'convert/retirement-calculator.html',icon:'🏖️' },
    { name:'Debt Payoff Calculator',desc:'Avalanche & snowball strategies',               url:P+'convert/debt-payoff-calculator.html',icon:'💳' },
    { name:'Adsense Calculator',    desc:'Estimate AdSense earnings',                     url:P+'convert/adsense-calculator.html',  icon:'💵' },
    { name:'Lead Value Calculator', desc:'Cost per lead, lead value',                     url:P+'convert/lead-value-calculator.html',icon:'📊' },
    { name:'Churn Rate Calculator', desc:'Customer churn % & retention',                  url:P+'convert/churn-rate-calculator.html',icon:'📉' },
    { name:'AI Image Studio',       desc:'Free Pollinations + Gemini Imagen',             url:P+'ai/image.html',                    icon:'🤖' },
    { name:'AI Writer',             desc:'Long-form articles via Gemini',                 url:P+'ai/writer.html',                   icon:'📖' },
    { name:'AI Photo Studio',       desc:'Edit photos with a sentence',                   url:P+'ai/photo-studio.html',             icon:'📸' },
    { name:'AI Background Remover', desc:'100% browser-side, no key',                     url:P+'ai/bg-remove.html',                icon:'✂️' },
    { name:'AI Social Post Maker',  desc:'Pre-sized graphics for IG, LinkedIn, X',        url:P+'ai/social-post.html',              icon:'📣' },

    // Image Tools
    { name:'Color Picker',          desc:'Pick colors from images or screen',              url:P+'convert/color-picker.html',        icon:'🎨' },
    { name:'Rotate Image',          desc:'Rotate photos 90°, 180°, 270° or custom',       url:P+'convert/rotate-image.html',        icon:'🔄' },
    { name:'Flip Image',            desc:'Mirror images horizontally or vertically',       url:P+'convert/flip-image.html',          icon:'↔️' },
    { name:'Image Enlarger',        desc:'Upscale images 2x, 3x, 4x',                     url:P+'convert/image-enlarger.html',      icon:'🔍' },
    { name:'GIF Maker',             desc:'Create animated GIF from multiple images',       url:P+'convert/gif-maker.html',           icon:'🎞️' },
    { name:'JPEG to JPG',           desc:'Convert JPEG/JFIF files to .jpg extension',     url:P+'convert/jpeg-to-jpg.html',         icon:'🖼️' },
    { name:'JFIF to JPG',           desc:'Convert JFIF format to JPG',                    url:P+'convert/jfif-to-jpg.html',         icon:'🖼️' },
    { name:'Compress JPG',          desc:'Reduce JPG file size with quality control',      url:P+'convert/compress-jpg.html',        icon:'🗜️' },

    // Audio/Video Conversions
    { name:'MP4 to MP3',            desc:'Extract audio from MP4 video files',             url:P+'convert/mp4-to-mp3.html',          icon:'🎵' },
    { name:'M4A to MP3',            desc:'Convert M4A audio to MP3 format',               url:P+'convert/m4a-to-mp3.html',          icon:'🎵' },
    { name:'MOV to MP4',            desc:'Convert MOV video to MP4',                       url:P+'convert/mov-to-mp4.html',          icon:'🎬' },
    { name:'AIFF to MP3',           desc:'Convert AIFF audio to MP3',                     url:P+'convert/aiff-to-mp3.html',         icon:'🎵' },
    { name:'3GP to MP3',            desc:'Extract audio from 3GP video',                  url:P+'convert/3gp-to-mp3.html',          icon:'🎵' },
    { name:'AMR to MP3',            desc:'Convert AMR voice recordings to MP3',           url:P+'convert/amr-to-mp3.html',          icon:'🎵' },
    { name:'MP3 to WAV',            desc:'Convert MP3 to lossless WAV format',            url:P+'convert/mp3-to-wav.html',          icon:'🎵' },
    { name:'AVI to GIF',            desc:'Convert AVI video to animated GIF',             url:P+'convert/avi-to-gif.html',          icon:'🖼️' },
    { name:'Crop Video',            desc:'Spatially crop video frame — remove borders',   url:P+'convert/crop-video.html',          icon:'✂️' },

    // PDF Tools
    { name:'PDF Split',             desc:'Split PDF by page range or into single pages',  url:P+'convert/pdf-split.html',           icon:'📄' },
    { name:'Protect PDF',           desc:'Add password protection to PDF',                url:P+'convert/pdf-protect.html',         icon:'🔒' },
    { name:'Organize PDF',          desc:'Reorder and delete PDF pages',                  url:P+'convert/pdf-organize.html',        icon:'📋' },
    { name:'Extract PDF Pages',     desc:'Extract specific pages from a PDF',             url:P+'convert/pdf-extract-pages.html',   icon:'📑' },
    { name:'PDF Page Remover',      desc:'Remove specific pages from a PDF',              url:P+'convert/pdf-page-remover.html',    icon:'🗑️' },
    { name:'Flatten PDF',           desc:'Flatten form fields and annotations',           url:P+'convert/pdf-flatten.html',         icon:'📄' },
    { name:'Resize PDF',            desc:'Change PDF page size (A4, Letter, etc.)',        url:P+'convert/pdf-resize.html',          icon:'📐' },
    { name:'Unlock PDF',            desc:'Remove password from PDF',                      url:P+'convert/pdf-unlock.html',          icon:'🔓' },
    { name:'Crop PDF',              desc:'Crop PDF page margins',                         url:P+'convert/pdf-crop.html',            icon:'✂️' },

    // Archive & File Tools
    { name:'ZIP Converter',         desc:'Create or extract ZIP archives',                url:P+'convert/zip-converter.html',       icon:'📦' },
    { name:'Create Archive',        desc:'Pack multiple files into a ZIP',                url:P+'convert/create-archive.html',      icon:'📦' },
    { name:'CBR/CBZ to PDF',        desc:'Convert comic book archives to PDF',            url:P+'convert/cbr-to-pdf.html',          icon:'📚' },

    // Font Tools
    { name:'OTF to TTF Converter',  desc:'Convert between OTF, TTF font formats',        url:P+'convert/otf-to-ttf.html',          icon:'🔤' },

    // Spreadsheet Tools
    { name:'XLSX Converter',        desc:'Convert XLSX, XLS, CSV, ODS files',            url:P+'convert/xlsx-converter.html',      icon:'📊' },
    { name:'CSV Converter',         desc:'Change CSV delimiter or convert to JSON/HTML',  url:P+'convert/csv-converter.html',       icon:'📊' },

    // eBook Tools
    { name:'EPUB to PDF',           desc:'Convert EPUB ebooks to PDF',                   url:P+'convert/epub-to-pdf.html',         icon:'📖' },
    { name:'EPUB Converter',        desc:'EPUB reader and converter',                    url:P+'convert/epub-converter.html',      icon:'📖' },

    // 3D Tools
    { name:'STL to OBJ',            desc:'Convert STL 3D mesh files to OBJ format',      url:P+'convert/stl-to-obj.html',          icon:'🧊' },
    { name:'FBX to OBJ',            desc:'Convert FBX 3D files to OBJ format',           url:P+'convert/fbx-to-obj.html',          icon:'🧊' },

    // Web Capture
    { name:'Save Page as PDF',      desc:'Convert HTML or webpage to PDF',               url:P+'convert/save-website-as-pdf.html', icon:'🌐' },
    { name:'Website Screenshot',    desc:'Capture webpage as PNG or JPG',                url:P+'convert/website-screenshot.html',  icon:'📷' },

    // DOCX Tools
    { name:'DOCX Converter',        desc:'Extract text from DOCX files',                 url:P+'convert/docx-converter.html',      icon:'📝' },

    // Format Hubs (SEO landing pages)
    { name:'JPG Converter',         desc:'All JPG/JPEG conversions in one place',        url:P+'convert/jpg-converter.html',       icon:'🖼️' },
    { name:'PNG Converter',         desc:'All PNG conversions in one place',             url:P+'convert/png-converter.html',       icon:'🖼️' },
    { name:'GIF Converter',         desc:'All GIF conversions in one place',             url:P+'convert/gif-converter.html',       icon:'🎞️' },
    { name:'MP3 Converter',         desc:'All MP3 audio conversions in one place',       url:P+'convert/mp3-converter.html',       icon:'🎵' },
    { name:'MP4 Converter',         desc:'All MP4 video conversions in one place',       url:P+'convert/mp4-converter.html',       icon:'🎬' },
    { name:'PDF Converter',         desc:'All PDF tools in one place',                   url:P+'convert/pdf-converter.html',       icon:'📄' },
    { name:'SVG Converter',         desc:'Convert SVG to PNG, JPG, PDF',                url:P+'convert/svg-converter.html',       icon:'🎨' },
    { name:'Font Converter',        desc:'OTF, TTF, WOFF font conversions',             url:P+'convert/font-converter.html',      icon:'🔤' },
    { name:'ZIP Archiver',          desc:'Create and extract ZIP archives',              url:P+'convert/zip-archiver.html',        icon:'📦' },
    { name:'Spreadsheet Converter', desc:'XLSX, CSV, ODS conversions',                  url:P+'convert/xlsx-hub.html',            icon:'📊' },
  ];

  /* File-type → tool detection (for hero drop-zone and global file-drop banner) */
  window.DJ_FILE_RULES = [
    { t: function(f){ return /\.(heic|heif)$/i.test(f.name) || f.type==='image/heic' || f.type==='image/heif'; }, k:'HEIC to JPG' },
    { t: function(f){ return f.type==='image/svg+xml' || /\.svg$/i.test(f.name); },                              k:'SVG to PNG' },
    { t: function(f){ return f.type.startsWith('image/'); },                                                     k:'Image Converter' },
    { t: function(f){ return f.type==='application/pdf'; },                                                      k:'PDF Merge & Split' },
    { t: function(f){ return f.type.startsWith('audio/'); },                                                     k:'Audio Converter' },
    { t: function(f){ return f.type.startsWith('video/') || /\.(mp4|mkv|avi|mov|webm|flv|wmv)$/i.test(f.name); }, k:'Video Converter' },
    { t: function(f){ return f.type==='application/json' || /\.json$/i.test(f.name); },                          k:'JSON Formatter' },
    { t: function(f){ return /\.(yaml|yml)$/i.test(f.name); },                                                   k:'JSON ↔ YAML' },
    { t: function(f){ return f.type==='text/csv' || /\.csv$/i.test(f.name); },                                   k:'CSV to Excel' },
    { t: function(f){ return f.type.includes('xml') || /\.xml$/i.test(f.name); },                                k:'XML ↔ JSON' },
    { t: function(f){ return /\.(srt|vtt)$/i.test(f.name); },                                                    k:'SRT ↔ VTT' },
    { t: function(f){ return /\.(md|markdown)$/i.test(f.name); },                                                k:'Markdown to HTML' },
  ];

  function findTool(name) {
    for (var i = 0; i < window.DJ_ALL_TOOLS.length; i++) {
      if (window.DJ_ALL_TOOLS[i].name === name) return window.DJ_ALL_TOOLS[i];
    }
    return null;
  }
  window.DJ_DETECT_TOOL = function (file) {
    for (var i = 0; i < window.DJ_FILE_RULES.length; i++) {
      if (window.DJ_FILE_RULES[i].t(file)) return findTool(window.DJ_FILE_RULES[i].k);
    }
    return null;
  };
})();
