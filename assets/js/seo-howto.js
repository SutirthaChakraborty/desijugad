/**
 * Dynamic HowTo + speakable JSON-LD schema injection for Desi Jugad convert pages.
 * Googlebot executes JavaScript, so dynamically injected schema is fully indexed.
 * Adds HowTo rich results eligibility to all 130+ convert pages with one script include.
 */
(function () {
  'use strict';

  var path = window.location.pathname.toLowerCase();
  if (!path.includes('/convert/')) return;

  var slug = path.split('/').pop().replace('.html', '');
  var pageTitle = (document.title || '').split('|')[0].split('—')[0].trim();

  // --- Tool-specific step overrides ------------------------------------------------
  var TOOL_STEPS = {
    'heic-to-jpg':      [['Upload HEIC files', 'Click "Choose Files" or drag and drop your iPhone HEIC photos onto the page.'],
                         ['Convert instantly', 'Conversion starts automatically in your browser — no waiting for a server.'],
                         ['Download JPG', 'Click Download All to save your JPG files. Works on Windows, Mac, iPhone, Android.']],
    'pdf-merge':        [['Add PDF files', 'Click "Choose Files" or drag multiple PDFs onto the upload area.'],
                         ['Reorder pages', 'Drag the PDF cards to set the order you want before merging.'],
                         ['Merge & download', 'Click "Merge PDF" — your combined PDF downloads instantly to your device.']],
    'pdf-compress':     [['Upload your PDF', 'Drag and drop your PDF or click to browse. Any file size is accepted.'],
                         ['Choose compression level', 'Select Balanced, High Quality, or Maximum Compression based on your needs.'],
                         ['Download compressed PDF', 'Click Compress PDF. The smaller file downloads directly — no email required.']],
    'image-compressor': [['Select your images', 'Drop JPEG, PNG, or WebP images onto the page, or click to browse.'],
                         ['Set quality', 'Use the quality slider (default 82%) or choose a target file size.'],
                         ['Download compressed images', 'Click Download All to save all compressed images as a ZIP.']],
    'image-resize':     [['Upload your image', 'Click Choose File or drag any JPG, PNG, or WebP image onto the page.'],
                         ['Set dimensions', 'Enter your target width and height in pixels, or pick a preset size.'],
                         ['Download resized image', 'Click Resize Image and download the result instantly.']],
    'pdf-to-jpg':       [['Upload your PDF', 'Drag and drop your PDF file or click to choose from your device.'],
                         ['Select pages', 'Choose to convert all pages or enter a page range (e.g. 1-3).'],
                         ['Download JPG images', 'Click Convert and download individual JPGs or a ZIP of all pages.']],
    'webp-to-jpg':      [['Upload WebP files', 'Drag and drop one or more .webp images, or click to browse.'],
                         ['Click Convert', 'Conversion happens instantly in your browser — no server involved.'],
                         ['Download JPG', 'Save the converted JPG files to your device with one click.']],
    'mp4-to-mp3':       [['Upload your video', 'Drop your MP4, MOV, or AVI file onto the page or click Choose File.'],
                         ['Set audio quality', 'Choose the bitrate (128 kbps is standard; 320 kbps for high quality).'],
                         ['Download MP3', 'Click Extract Audio — your MP3 downloads without uploading to any server.']],
    'pdf-split':        [['Upload PDF', 'Drop your PDF onto the page or click Choose File.'],
                         ['Choose split method', 'Split by page range, extract specific pages, or split every page individually.'],
                         ['Download split PDFs', 'Click Split PDF. Each page or range downloads as a separate file.']],
    'pdf-protect':      [['Upload PDF', 'Drop your PDF or click to browse. File never leaves your browser.'],
                         ['Set password', 'Enter the password you want to apply to your PDF document.'],
                         ['Download protected PDF', 'Click Protect PDF — the encrypted file downloads directly to your device.']],
    'pdf-crop':         [['Upload PDF', 'Drop your PDF file or click Choose File.'],
                         ['Set crop margins', 'Adjust top, right, bottom, left crop values in millimetres.'],
                         ['Download cropped PDF', 'Click Crop PDF and save the result.']],
    'json-to-csv':      [['Paste or upload JSON', 'Paste your JSON data into the text area or upload a .json file.'],
                         ['Preview the table', 'Desi Jugad shows a live table preview of how your CSV will look.'],
                         ['Download CSV', 'Click Download CSV to save the converted file.']],
    'qr-code':          [['Enter your text or URL', 'Type or paste the link, phone number, email, or any text into the input.'],
                         ['Customize', 'Optionally change the QR code size, error correction level, and colors.'],
                         ['Download QR code', 'Click Download PNG or SVG to save your QR code.']],
    'image-converter':  [['Upload images', 'Drag and drop JPG, PNG, WebP, BMP, or GIF files onto the page.'],
                         ['Choose output format', 'Select your target format: JPG, PNG, WebP, or GIF.'],
                         ['Download converted images', 'Click Convert All and download each image in the new format.']],
    'rotate-image':     [['Upload your image', 'Choose any JPG, PNG, or WebP image from your device.'],
                         ['Rotate', 'Click the rotate buttons to turn 90°, 180°, or flip horizontally/vertically.'],
                         ['Download', 'Click Download to save the rotated image.']],
    'compress-jpg':     [['Upload JPGs', 'Drag and drop one or more JPEG images onto the upload area.'],
                         ['Set quality', 'Adjust the quality slider to control file size vs. image quality.'],
                         ['Download compressed JPGs', 'Click Compress and save the smaller JPEG files.']],
    'zip-converter':    [['Upload files', 'Select any files you want to archive — documents, images, any type.'],
                         ['Click Create ZIP', 'Your ZIP archive is created instantly in the browser.'],
                         ['Download ZIP', 'Click Download ZIP to save your archive to your device.']]
  };

  // Generic fallback steps
  var defaultSteps = [
    ['Upload your file', 'Click "Choose File" or drag and drop your file onto the upload area on this page.'],
    ['Start conversion', 'Click the Convert button. Processing happens instantly inside your browser — no file is sent to any server.'],
    ['Download result', 'Click Download to save your converted file. No sign-up, no watermark, no waiting.']
  ];

  var steps = TOOL_STEPS[slug] || defaultSteps;

  var howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to use ' + pageTitle + ' — free, no upload',
    'description': 'Step-by-step guide to ' + pageTitle.toLowerCase() + ' free online. Runs entirely in your browser — no file upload, no sign-up, no watermark.',
    'totalTime': 'PT1M',
    'estimatedCost': { '@type': 'MonetaryAmount', 'currency': 'USD', 'value': '0' },
    'tool': [
      { '@type': 'HowToTool', 'name': 'Web browser (Chrome, Firefox, Safari, Edge)' }
    ],
    'step': steps.map(function (s, i) {
      return {
        '@type': 'HowToStep',
        'position': i + 1,
        'name': s[0],
        'text': s[1]
      };
    })
  };

  var speakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': window.location.href,
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['h1', '.tool-tagline', '.faq-question']
    }
  };

  function inject(schema) {
    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
  }

  inject(howTo);
  inject(speakable);
})();
