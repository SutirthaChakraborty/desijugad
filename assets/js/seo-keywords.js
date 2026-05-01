/**
 * Long-tail SEO keyword injection for Desi Jugad convert pages.
 * Injects additional FAQPage JSON-LD schema and extends meta keywords for each page.
 * Googlebot fully executes JavaScript, so dynamically injected schemas are indexed.
 */
(function () {
  'use strict';

  var path = window.location.pathname.toLowerCase();
  var slug = path.split('/').pop().replace('.html', '');

  // --- Per-page FAQ Q&A pairs -------------------------------------------------------
  var PAGE_FAQS = {
    'unit-converter': [
      { q: 'How many katha in 1 bigha?', a: '1 Bigha (UP/Uttarakhand/Bihar/Bengal) equals 20 Katha. In some regions 1 Bigha = 16 or 20 Katha depending on local measurement standards.' },
      { q: 'How many square feet in 1 bigha?', a: '1 Bigha in UP/Uttarakhand = 27,225 sq ft. 1 Bigha in Punjab/Haryana = 43,560 sq ft (1 acre). 1 Bigha in Bengal = 14,400 sq ft.' },
      { q: 'How many square feet in 1 gaj?', a: '1 Gaj = 9 square feet (1 square yard). 1 Gaj = 0.836 square meters.' },
      { q: 'How many square feet in 1 marla?', a: '1 Marla = 272.25 square feet or 30.25 square yards. It is commonly used in Punjab, Haryana, and Pakistan.' },
      { q: 'How many square feet in 1 kanal?', a: '1 Kanal = 5,445 square feet = 20 Marla. It is commonly used in Punjab and Haryana for land measurement.' },
      { q: 'How to convert meter to feet?', a: '1 meter = 3.28084 feet. Multiply meters by 3.28084 to get feet. Use the Unit Converter above for any value.' },
      { q: 'How many biswa in 1 bigha UP?', a: '1 Bigha (UP) = 20 Biswa. 1 Biswa (UP) = 1,361.25 sq ft or 125 sq yards.' },
      { q: 'What is 1 acre in bigha?', a: '1 Acre = 1.6 Bigha (UP). 1 Acre = 43,560 sq ft. In Bengal, 1 Acre ≈ 3 Bigha.' }
    ],
    'currency-converter': [
      { q: 'What is the dollar to rupee rate today?', a: 'The live USD to INR rate is shown in the currency converter above. It updates in real time using the latest forex data.' },
      { q: 'How to convert USD to INR?', a: 'Enter the amount, select USD as the source currency and INR as the target. The converter shows the current exchange rate and converted amount instantly.' },
      { q: 'How much is 1 euro in Indian rupees?', a: 'The live EUR to INR exchange rate is shown in the currency converter. Euro to rupee rates fluctuate daily based on forex markets.' },
      { q: 'What is the pound to rupee rate today?', a: 'The live GBP to INR rate is displayed in the currency converter above. Use the converter to check any amount in real time.' },
      { q: 'How to convert rupee to dollar?', a: 'Enter the INR amount, select INR as source and USD as target currency. The live INR to USD rate is applied automatically.' }
    ],
    'gst-calculator': [
      { q: 'How to calculate 18% GST on a price?', a: 'Multiply the price by 0.18 to get the GST amount. For example, 18% GST on ₹1,000 = ₹180. Total inclusive price = ₹1,180. Use the GST Calculator above for instant results.' },
      { q: 'What is GST inclusive vs exclusive price?', a: 'GST exclusive: GST is added on top of the base price. GST inclusive: the price already includes GST. For a ₹1,180 inclusive price at 18%, the base is ₹1,000 and GST is ₹180.' },
      { q: 'What are the GST slab rates in India?', a: 'India has four main GST slabs: 5% (essential goods), 12% (processed food, medicines), 18% (most services and manufactured goods), and 28% (luxury/sin goods). Some items are 0% (exempt).' },
      { q: 'How to calculate GST on services?', a: 'For services, GST is usually 18%. Multiply the service charge by 0.18 to find GST. Example: ₹5,000 service + 18% GST = ₹5,900 total.' },
      { q: 'How to reverse calculate GST (remove GST from inclusive price)?', a: 'Divide the inclusive price by (1 + GST rate). For 18% GST: Base price = Inclusive price ÷ 1.18. Example: ₹1,180 ÷ 1.18 = ₹1,000 base price.' }
    ],
    'income-tax-calculator': [
      { q: 'Which is better — new or old income tax regime in India?', a: 'New regime is better if your deductions (80C, HRA, etc.) are below ₹3.75 lakh. Old regime suits those with high HRA, home loan interest, and 80C investments. Use the Income Tax Calculator to compare both.' },
      { q: 'How much income tax on ₹10 lakh salary (FY 2025-26)?', a: 'Under the new tax regime: tax on ₹10 lakh = approximately ₹60,000 (after standard deduction of ₹75,000). Under old regime with 80C and HRA, tax can be near zero depending on deductions.' },
      { q: 'What is the income tax slab for FY 2025-26?', a: 'New regime slabs: 0% up to ₹4L, 5% for ₹4L–8L, 10% for ₹8L–12L, 15% for ₹12L–16L, 20% for ₹16L–20L, 25% for ₹20L–24L, 30% above ₹24L. Standard deduction: ₹75,000.' },
      { q: 'What is the standard deduction for salaried employees in 2025-26?', a: 'The standard deduction for salaried employees under the new tax regime is ₹75,000 for FY 2025-26.' },
      { q: 'Is income up to ₹12 lakh tax free under new regime?', a: 'Yes, under the new regime (FY 2025-26), income up to ₹12 lakh is effectively tax free due to the ₹60,000 tax rebate under Section 87A after the ₹75,000 standard deduction.' }
    ],
    'sip-calculator': [
      { q: 'How to calculate SIP returns?', a: 'SIP returns are calculated using compound interest: M = P × [{(1+i)^n – 1}/i] × (1+i), where P = monthly investment, i = monthly rate, n = number of months. Use the SIP Calculator above for instant results.' },
      { q: 'How much to invest monthly in SIP for ₹1 crore?', a: 'To accumulate ₹1 crore in 15 years at 12% annual return, you need to invest approximately ₹20,000 per month. At 15% return, approximately ₹15,000/month. Use the SIP Calculator to experiment with different amounts.' },
      { q: 'What is the average SIP return in India?', a: 'Historically, diversified equity mutual funds in India have delivered 12–15% annual returns over a 10–15 year horizon. The SIP Calculator uses your chosen expected return rate.' }
    ],
    'emi-calculator': [
      { q: 'How to calculate home loan EMI?', a: 'EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P = loan amount, R = monthly interest rate, N = tenure in months. Example: ₹50L loan at 8.5% for 20 years = ~₹43,391/month. Use the EMI Calculator above.' },
      { q: 'What is the EMI for ₹20 lakh home loan for 10 years?', a: 'At 8.5% interest: EMI ≈ ₹24,797/month for 10 years. Total payment ≈ ₹29.76 lakh (interest ≈ ₹9.76 lakh). Use the EMI Calculator to get exact figures.' },
      { q: 'How to reduce home loan EMI?', a: 'You can reduce EMI by increasing loan tenure, paying a higher down payment, or choosing a bank with a lower interest rate. Prepaying principal amount also reduces total interest.' }
    ],
    'pdf-compressor': [
      { q: 'How to compress a PDF for WhatsApp?', a: 'Upload the PDF in the compressor above and choose "Maximum" compression. WhatsApp supports PDFs up to 100MB. For email, aim under 10MB using "High" compression.' },
      { q: 'How to reduce PDF size to under 1 MB?', a: 'Select "Maximum Compression" in the PDF Compressor. For image-heavy PDFs, reducing image DPI to 96 or 72 works best. Text-only PDFs can usually be compressed to under 200KB.' },
      { q: 'Is compressing a PDF safe? Will I lose data?', a: 'Yes, PDF compression is safe. The PDF Compressor at Desi Jugad runs entirely in your browser — your file is never uploaded to any server. Text content is never lost; only image quality may reduce slightly at maximum compression.' },
      { q: 'How to compress PDF on mobile (Android/iPhone)?', a: 'Open desijugad.co.in/convert/pdf-compressor.html in your mobile browser (Chrome or Safari). Tap to upload your PDF and download the compressed version. No app installation needed.' }
    ],
    'image-compress': [
      { q: 'How to compress image for WhatsApp?', a: 'Upload your image in the compressor above. Use 80–85% quality for the best balance. WhatsApp supports images up to 16MB. For profile photos aim under 5MB; for status media under 16MB.' },
      { q: 'How to compress an image below 200KB?', a: 'Use the Image Compressor above, set quality to 60–70% for JPEG. For PNG use WebP conversion (30–50% smaller). Most photos under 5MP can be reduced below 200KB at 75% quality.' },
      { q: 'How to compress image without losing quality?', a: 'Use 85–90% quality in the Image Compressor for near-lossless compression. WebP format gives 25–35% smaller files than JPG at the same visual quality. Lossy JPEG compression above 80% is generally imperceptible.' },
      { q: 'Which image format gives the smallest file size?', a: 'WebP is the smallest modern format — typically 25–34% smaller than JPG and 26% smaller than PNG at equivalent quality. AVIF is even smaller but has less browser support. For maximum compatibility, use JPG at 80% quality.' }
    ],
    'image-converter': [
      { q: 'How to convert PNG to JPG online free?', a: 'Upload your PNG file in the Image Converter above, select JPG as output format, and click Convert. Your JPG file downloads instantly — no watermark, no sign-up, no file upload to server.' },
      { q: 'How to convert JPG to PNG?', a: 'Drop your JPG into the Image Converter, choose PNG as the output format, and download. PNG preserves transparency; use this format for logos and graphics with transparent backgrounds.' },
      { q: 'How to convert PNG to BMP?', a: 'Upload your PNG in the Image Converter, select BMP as output, and click Convert. BMP is uncompressed so the file will be larger than PNG but has no quality loss.' },
      { q: 'What is the difference between PNG and JPG?', a: 'JPG uses lossy compression (smaller files, slight quality loss) and is best for photos. PNG uses lossless compression (larger files, no quality loss) and supports transparency. WebP supports both modes and is smaller than both.' },
      { q: 'How to convert WebP to JPG on iPhone?', a: 'Open desijugad.co.in/convert/webp-to-jpg.html in Safari on your iPhone. Tap to upload your WebP image and download the JPG. No app needed.' }
    ],
    'video-converter': [
      { q: 'How to convert MP4 to AVI online free?', a: 'Upload your MP4 file in the Video Converter above, select AVI as output format, and click Convert. The conversion happens in your browser — no upload to any server.' },
      { q: 'How to convert MOV to MP4?', a: 'Drop your MOV file into the Video Converter, select MP4 as output, and download. MOV is Apple\'s format (QuickTime); MP4 is universally compatible with all devices and platforms.' },
      { q: 'How to convert MKV to MP4?', a: 'Upload your MKV file, choose MP4 as the output format in the Video Converter, and click Convert. MKV to MP4 conversion is one of the most common video conversions.' },
      { q: 'What video formats can I convert online?', a: 'The Desi Jugad Video Converter supports MP4, WebM, MKV, AVI, MOV, WMV, FLV, and 3GP. Convert between any of these formats directly in your browser.' }
    ],
    'video-compressor': [
      { q: 'How to compress a video for WhatsApp?', a: 'Upload the video in the Video Compressor above. Select "WhatsApp" preset (under 16MB) or manually set bitrate. WhatsApp supports videos up to 16MB for regular messages.' },
      { q: 'How to reduce MP4 video file size?', a: 'Use the Video Compressor to lower the video bitrate and resolution. For social media, 720p at 2Mbps gives a good quality-to-size ratio. A 1-minute 720p video compresses to approximately 15–20MB.' },
      { q: 'Does compressing video reduce quality?', a: 'Some quality loss occurs, but modern compression at 70–80% setting is often imperceptible to the human eye. The Video Compressor preview shows the quality before you download.' }
    ],
    'audio-converter': [
      { q: 'How to convert WAV to MP3 online free?', a: 'Upload your WAV file in the Audio Converter above, select MP3 as the output format, choose your bitrate (128kbps standard, 320kbps high quality), and click Convert.' },
      { q: 'How to convert M4A to MP3?', a: 'Drop your M4A file into the Audio Converter, select MP3 output, and download. M4A is Apple\'s audio format (AAC); converting to MP3 makes it compatible with all devices.' },
      { q: 'How to convert FLAC to MP3?', a: 'Upload your FLAC file, select MP3 as output format. FLAC is lossless; converting to MP3 at 320kbps gives near-lossless quality with a 5–10x smaller file size.' },
      { q: 'What audio formats are supported?', a: 'The Desi Jugad Audio Converter supports MP3, WAV, OGG, M4A, FLAC, AAC, and WMA. Convert between any combination of these formats in your browser.' }
    ],
    'mp4-to-mp3': [
      { q: 'How to convert MP4 to MP3 online free?', a: 'Upload your MP4 video on this page, select the audio quality (128kbps or 320kbps), and click Convert. Your MP3 downloads instantly — the video never leaves your device.' },
      { q: 'Can I extract audio from any video format?', a: 'Yes. The MP4 to MP3 converter also accepts MOV, AVI, MKV, and WebM files. Drop any video file and extract the audio as MP3 or WAV.' },
      { q: 'Does converting MP4 to MP3 lose audio quality?', a: 'At 320kbps MP3 output, audio quality is near-indistinguishable from the original. For music, use 320kbps; for voice recordings or podcasts, 128kbps is sufficient.' }
    ],
    'heic-to-jpg': [
      { q: 'How to convert iPhone HEIC photos to JPG?', a: 'Drop your HEIC files (from iPhone/iPad) onto the HEIC to JPG converter. Conversion happens instantly in your browser. Download individual JPGs or a ZIP of all files.' },
      { q: 'Why can\'t I open HEIC files on Windows?', a: 'HEIC is Apple\'s proprietary format, not supported by default on Windows. Convert HEIC to JPG using this tool for universal compatibility.' },
      { q: 'Does HEIC to JPG conversion lose quality?', a: 'Very slight quality reduction occurs since JPG uses lossy compression. For photos, the difference is imperceptible. If you need lossless conversion, convert to PNG instead.' }
    ],
    'pdf-merge': [
      { q: 'How to merge two PDF files online free?', a: 'Upload both PDF files on this page, arrange the order by dragging, and click Merge PDF. The combined file downloads instantly — no upload to any server required.' },
      { q: 'How to combine multiple PDFs into one?', a: 'Click "Choose Files" or drag multiple PDFs onto the upload area. You can add up to 20 files. Reorder by dragging, then click Merge PDF.' },
      { q: 'Is there a file size limit for merging PDFs?', a: 'Desi Jugad\'s PDF Merger runs in your browser, so limits depend on your device\'s RAM. Most modern devices can handle PDFs up to 500MB total without issues.' }
    ],
    'image-to-pdf': [
      { q: 'How to convert JPG to PDF online free?', a: 'Upload your JPG images on this page. You can add multiple images. Arrange the order, choose page size (A4 or fit to image), and click Create PDF. Downloads instantly.' },
      { q: 'How to combine multiple photos into one PDF?', a: 'Upload all your photos using the Images to PDF tool. Drag to reorder, then click Create PDF. All images are compiled into a single multi-page PDF file.' },
      { q: 'Can I convert PNG to PDF?', a: 'Yes. The Images to PDF tool accepts JPG, PNG, WebP, GIF, and BMP files. Upload any combination and create a single PDF.' }
    ],
    'qr-code': [
      { q: 'How to create a QR code for a website?', a: 'Enter your website URL in the QR Code Generator above and click Generate. Download as PNG or SVG. The QR code works instantly — no sign-up required.' },
      { q: 'How to create a QR code for WhatsApp?', a: 'Enter your WhatsApp link (https://wa.me/91XXXXXXXXXX) in the generator. Anyone who scans the QR code will open a WhatsApp chat with you directly.' },
      { q: 'Can I customize the QR code color?', a: 'Yes. Use the color picker in the QR Code Generator to change the foreground and background colors. You can also adjust the QR code size and error correction level.' }
    ],
    'base64': [
      { q: 'How to encode text to Base64?', a: 'Paste your text in the input box and click Encode. The Base64 encoded string appears instantly. You can also encode files (images, documents) to Base64.' },
      { q: 'How to decode a Base64 string?', a: 'Paste the Base64 encoded string and click Decode. The original text or file content is shown immediately.' },
      { q: 'What is Base64 used for?', a: 'Base64 is used to encode binary data (images, files) as text for transmission in emails, APIs, and web pages. It\'s also used to embed images directly in HTML or CSS.' }
    ],
    'color-converter': [
      { q: 'How to convert HEX to RGB?', a: 'Enter the HEX color code (e.g., #FF5733) in the Color Converter. The RGB values are shown instantly: R=255, G=87, B=51.' },
      { q: 'How to convert RGB to HEX?', a: 'Enter R, G, B values (0–255 each) in the Color Converter and get the HEX code. Example: RGB(255,87,51) = #FF5733.' },
      { q: 'What is HSL color format?', a: 'HSL stands for Hue (0–360°), Saturation (0–100%), and Lightness (0–100%). It is a more intuitive way to describe colors than RGB. Use the Color Converter to convert between HEX, RGB, HSL, and CMYK.' }
    ],
    'word-counter': [
      { q: 'How to count words in an essay?', a: 'Paste your text into the Word Counter above. It shows word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time.' },
      { q: 'How many words is a 5-minute speech?', a: 'A 5-minute speech at average speaking pace (130 words/minute) contains approximately 650 words. Use the Word Counter to check your script\'s reading time.' },
      { q: 'What is the character limit for Twitter/X posts?', a: 'Twitter/X has a 280-character limit for standard posts (premium subscribers get 25,000 characters). The Word Counter shows character count in real time as you type.' }
    ],
    'bmi-calculator': [
      { q: 'What is a healthy BMI range?', a: 'According to WHO: Underweight: below 18.5, Normal: 18.5–24.9, Overweight: 25–29.9, Obese: 30 and above. For South Asians (including Indians), the overweight threshold is sometimes set at 23.' },
      { q: 'How to calculate BMI manually?', a: 'BMI = weight (kg) ÷ [height (m)]². Example: 70 kg, 1.75m → BMI = 70 ÷ (1.75 × 1.75) = 22.9 (Normal).' },
      { q: 'Is BMI 25 overweight for Indians?', a: 'For South Asians/Indians, a BMI of 23 is considered overweight due to higher metabolic risk at lower BMI values compared to Western populations. Consult your doctor for personalized assessment.' }
    ],
    'percentage-calculator': [
      { q: 'How to calculate percentage increase?', a: 'Percentage increase = [(New Value – Old Value) ÷ Old Value] × 100. Example: price increased from ₹100 to ₹120 → increase = [(120–100) ÷ 100] × 100 = 20%.' },
      { q: 'How to calculate what percentage X is of Y?', a: 'Percentage = (X ÷ Y) × 100. Example: 45 out of 60 = (45 ÷ 60) × 100 = 75%.' },
      { q: 'How to calculate discount percentage?', a: 'Discount % = [(Original Price – Sale Price) ÷ Original Price] × 100. Example: ₹800 item on sale for ₹600 → discount = (200 ÷ 800) × 100 = 25%.' }
    ],
    'age-calculator': [
      { q: 'How to calculate exact age in years, months, and days?', a: 'Enter your date of birth in the Age Calculator. It calculates your exact age in years, months, days, hours, minutes, and seconds as of today.' },
      { q: 'How old am I if I was born in 2000?', a: 'If born on Jan 1, 2000, you would be 26 years old in 2026. Use the Age Calculator to get the exact age including months and days based on your birth date.' }
    ],
    'timestamp-converter': [
      { q: 'How to convert Unix timestamp to date?', a: 'Paste the Unix timestamp (e.g., 1746057600) into the converter. It shows the human-readable date and time in your local timezone and UTC.' },
      { q: 'What is Unix epoch time?', a: 'Unix epoch time (Unix timestamp) is the number of seconds elapsed since January 1, 1970 00:00:00 UTC. The current timestamp is shown live in the converter.' },
      { q: 'How to get the current Unix timestamp?', a: 'The Timestamp Converter shows the current Unix timestamp in real time. You can also convert any date/time to its Unix timestamp.' }
    ],
    'hash-generator': [
      { q: 'How to generate SHA256 hash online?', a: 'Type or paste your text into the Hash Generator. The SHA-256 hash is calculated instantly in your browser — your data is never sent to any server.' },
      { q: 'What is the difference between MD5 and SHA-256?', a: 'MD5 produces a 128-bit (32-character) hash and is considered cryptographically broken (not suitable for security). SHA-256 produces a 256-bit (64-character) hash and is cryptographically secure.' },
      { q: 'How to verify file integrity using hash?', a: 'Generate the SHA-256 hash of your downloaded file. Compare it with the hash provided by the source. If they match, the file is authentic and unmodified.' }
    ],
    'pdf-to-image': [
      { q: 'How to convert PDF to JPG online free?', a: 'Upload your PDF in the PDF to Images converter. Select page range if needed, choose JPG output, and click Convert. Download individual page images or a ZIP of all pages.' },
      { q: 'How to extract images from a PDF?', a: 'Use the PDF to Images tool to render each PDF page as a high-resolution PNG or JPG image. You can select specific pages to extract.' },
      { q: 'What is the best DPI for PDF to image conversion?', a: '150 DPI is good for web use; 300 DPI is recommended for printing. The PDF to Images converter lets you choose output resolution.' }
    ],
    'ocr': [
      { q: 'How to extract text from an image online free?', a: 'Upload your image (JPG, PNG, PDF) in the OCR tool above. The text is extracted automatically. Supports printed and handwritten text in multiple languages including Hindi and English.' },
      { q: 'What is OCR?', a: 'OCR (Optical Character Recognition) converts images of text into machine-readable text. It works by analyzing pixel patterns to identify characters. Useful for digitizing scanned documents, photos of signs, and screenshots.' },
      { q: 'Does OCR work for Hindi text?', a: 'Yes. The Desi Jugad OCR tool supports Hindi (Devanagari script), English, and many other languages. Upload a photo of any Hindi text document and extract the text.' }
    ],
    'translate': [
      { q: 'How to translate Hindi to English online?', a: 'Select Hindi as the source language and English as the target in the Translate tool above. Type or paste your text and click Translate.' },
      { q: 'How to translate English to Hindi?', a: 'Choose English as source and Hindi (हिन्दी) as target in the translation tool. Paste your text and get instant Hindi translation.' },
      { q: 'Which languages does the translator support?', a: 'The Desi Jugad Translate tool supports 70+ languages including Hindi, English, Tamil, Telugu, Marathi, Kannada, Bengali, Gujarati, Spanish, French, Arabic, and more.' }
    ],
    'text-to-speech': [
      { q: 'How to convert Hindi text to speech?', a: 'Select Hindi as the language in the Text to Speech tool, paste your Hindi text, and click Play. Download the audio as an MP3 file. Supports male and female voices.' },
      { q: 'What languages does text to speech support?', a: 'The TTS tool supports 30+ languages including Hindi, English (US/UK/Australia), Tamil, Telugu, Marathi, Bengali, Gujarati, Spanish, French, and more.' },
      { q: 'Can I download the speech as an MP3?', a: 'Yes. After generating the speech, click the Download button to save the audio as an MP3 file to your device.' }
    ],
    'speech-to-text': [
      { q: 'How to convert speech to text in Hindi?', a: 'Click the mic button in the Speech to Text tool, select Hindi as the language, and start speaking. The text appears in real time.' },
      { q: 'Does speech to text work offline?', a: 'The speech recognition requires an internet connection to process audio. Results appear in real time as you speak.' },
      { q: 'Can I use speech to text for long recordings?', a: 'Yes. Start recording and speak continuously. The transcript accumulates in the text area. Click Stop when done and copy or download the text.' }
    ],
    'resume-builder': [
      { q: 'How to make a free resume online?', a: 'Fill in your details in the Resume Builder above — personal info, education, experience, skills. Select a template and click Download PDF. No sign-up required; the PDF is created in your browser.' },
      { q: 'What resume format is best for freshers in India?', a: 'For freshers, use a single-page reverse-chronological format highlighting education, projects, internships, and skills. The Resume Builder has templates optimized for Indian job applications.' },
      { q: 'Can I download my resume as PDF?', a: 'Yes. Click "Download PDF" in the Resume Builder. The PDF is generated in your browser instantly — no sign-up, no email required.' }
    ],
    'invoice-generator': [
      { q: 'How to create a GST invoice online free?', a: 'Enter your business details, client info, items, and GST rate in the Invoice Generator. It auto-calculates CGST/SGST/IGST. Download as PDF instantly — no sign-up needed.' },
      { q: 'What details are required on a GST invoice?', a: 'A valid GST invoice must include: supplier GSTIN, invoice number, date, buyer details, HSN/SAC codes, taxable value, GST rate and amount (CGST/SGST or IGST), and total amount.' },
      { q: 'Can I create invoices without a GSTIN?', a: 'Yes. If your turnover is below the GST registration threshold (₹40L for goods, ₹20L for services), you can issue a regular bill of supply without GSTIN using the Invoice Generator.' }
    ],
    'password-gen': [
      { q: 'How to generate a strong password?', a: 'Use the Password Generator to create passwords with uppercase, lowercase, numbers, and symbols. A 16-character random password is considered very strong by current standards.' },
      { q: 'What makes a password strong?', a: 'A strong password is at least 12–16 characters long, uses a mix of uppercase, lowercase, numbers, and special characters, and has no dictionary words or personal information.' },
      { q: 'Is the password generator secure?', a: 'Yes. Passwords are generated entirely in your browser using the Web Crypto API — no password data is ever sent to any server.' }
    ],
    'url-tools': [
      { q: 'How to URL encode a string?', a: 'Paste your text into the URL Tools encoder and click URL Encode. Special characters are converted to percent-encoded form (e.g., space becomes %20).' },
      { q: 'How to decode a URL-encoded string?', a: 'Paste the percent-encoded URL into the URL Decoder field and click Decode. The original human-readable text is shown.' },
      { q: 'What is URL encoding used for?', a: 'URL encoding (percent encoding) is used to safely transmit special characters in URLs and query strings. Characters like spaces, &, =, and # are encoded so they don\'t break the URL structure.' }
    ],
    'svg-to-png': [
      { q: 'How to convert SVG to PNG online free?', a: 'Upload or paste your SVG file in the SVG to PNG converter. Set the output size (pixels), and click Convert. Downloads as a transparent PNG.' },
      { q: 'Why convert SVG to PNG?', a: 'PNG is universally supported by all apps, email clients, and social media. SVG requires a browser or vector-aware app. Convert SVG to PNG when you need a raster image for printing, social media, or apps.' },
      { q: 'Can SVG to PNG preserve transparency?', a: 'Yes. PNG supports alpha transparency, so transparent areas in your SVG remain transparent in the converted PNG.' }
    ],
    'barcode-generator': [
      { q: 'How to generate an EAN-13 barcode online?', a: 'Select EAN-13 as the barcode type in the Barcode Generator, enter your 13-digit product number, and click Generate. Download as PNG or SVG.' },
      { q: 'What barcode formats are supported?', a: 'The Barcode Generator supports EAN-13, EAN-8, UPC-A, UPC-E, Code128, Code39, ITF, and QR codes.' },
      { q: 'Can I print the barcode?', a: 'Yes. Download the barcode as PNG (for digital use) or SVG (for scalable print quality). SVG barcodes print sharply at any size.' }
    ],
    'compound-interest-calculator': [
      { q: 'How to calculate compound interest?', a: 'Formula: A = P × (1 + r/n)^(n×t), where P = principal, r = annual rate, n = compounding frequency, t = years. Example: ₹1L at 8% compounded annually for 10 years = ₹2.16L.' },
      { q: 'What is compound interest vs simple interest?', a: 'Simple interest: interest only on principal. Compound interest: interest on principal AND accumulated interest. Over time, compound interest grows significantly faster.' },
      { q: 'How to calculate FD maturity amount?', a: 'Enter the principal, interest rate, tenure, and select quarterly compounding (most FDs compound quarterly). The Compound Interest Calculator shows exact maturity amount.' }
    ]
  };

  // --- Per-page extended meta keywords -----------------------------------------------
  var PAGE_KEYWORDS = {
    'unit-converter':      'bigha to katha,bigha to square feet,katha to square feet,gaj to square feet,1 bigha in square feet,marla to square feet,kanal to square feet,biswa to square feet,meter to feet,km to miles,kg to lbs,celsius to fahrenheit,acre to bigha,gaj to meter,tola,guntha,cent to square feet',
    'currency-converter':  'dollar to rupee today,usd to inr today,usd to inr,eur to inr,euro to rupee,pound to rupee,gbp to inr,live exchange rate,dollar rate india,forex converter,rupee to dollar,inr to usd',
    'gst-calculator':      'gst calculator,18% gst,gst 18 percent,gst inclusive price,gst exclusive price,calculate gst india,gst on services,gst slab rates,5% gst,12% gst,28% gst,remove gst from price',
    'income-tax-calculator':'income tax 2025-26,new tax regime,old tax regime,income tax slab 2025,new vs old regime,tax on 10 lakh salary,standard deduction 2025,section 87A rebate,salary tax calculator india',
    'pdf-compressor':      'compress pdf,reduce pdf size,compress pdf for whatsapp,compress pdf below 1mb,pdf compressor online free,reduce pdf file size,pdf size reducer',
    'image-compress':      'compress image for whatsapp,compress image below 200kb,compress png online,compress jpg online,reduce image file size,image compressor free,compress jpeg',
    'image-converter':     'png to jpg,jpg to png,webp to jpg,png to webp,bmp to jpg,png to bmp,jpg to webp,convert image online free,image format converter',
    'video-converter':     'mp4 to avi,avi to mp4,mkv to mp4,mov to mp4,wmv to mp4,flv to mp4,video format converter,convert video online free',
    'audio-converter':     'wav to mp3,m4a to mp3,flac to mp3,ogg to mp3,audio converter online free,mp3 converter,convert audio format',
    'mp4-to-mp3':          'mp4 to mp3,extract audio from mp4,video to mp3,mp4 audio extractor,convert mp4 to mp3 online free',
    'video-compressor':    'compress video,compress mp4,video compressor free,compress video for whatsapp,reduce video file size,mp4 compressor',
    'heic-to-jpg':         'heic to jpg,heif to jpg,iphone photo to jpg,heic converter,convert heic to jpeg,apple photo converter',
    'pdf-merge':           'merge pdf,combine pdf,merge pdf online free,join pdf files,pdf merger,combine multiple pdfs',
    'image-to-pdf':        'jpg to pdf,png to pdf,images to pdf,convert image to pdf,multiple photos to pdf,photo to pdf',
    'qr-code':             'qr code generator,create qr code,qr code for website,qr code for whatsapp,generate qr code free,qr code maker',
    'base64':              'base64 encode,base64 decode,base64 encoder,base64 decoder,base64 converter,encode text base64',
    'color-converter':     'hex to rgb,rgb to hex,hsl to rgb,rgb to hsl,cmyk to rgb,color code converter,hex color code',
    'word-counter':        'word counter,count words online,character count,word count checker,words in essay,reading time calculator',
    'bmi-calculator':      'bmi calculator india,body mass index,healthy bmi,bmi chart,overweight calculator,underweight bmi,bmi for indians',
    'percentage-calculator':'percentage calculator,percentage increase,percentage decrease,discount percentage,percent of number,percentage change calculator',
    'age-calculator':      'age calculator,calculate age online,how old am i,age from date of birth,years months days calculator',
    'timestamp-converter': 'unix timestamp,epoch converter,timestamp to date,date to timestamp,unix time converter,current unix timestamp',
    'hash-generator':      'sha256 generator,md5 hash generator,sha1 hash,sha512 hash,hash calculator online,checksum generator',
    'pdf-to-image':        'pdf to jpg,pdf to png,convert pdf to image,pdf page to jpg,extract pdf as image,pdf screenshot',
    'ocr':                 'image to text,ocr online free,extract text from image,photo to text,hindi ocr,scan text from image',
    'translate':           'hindi to english translation,english to hindi,translate hindi,online translator,hindi translator,language translator free',
    'text-to-speech':      'text to speech hindi,hindi text to speech,tts online free,convert text to audio,text to mp3,hindi voice generator',
    'speech-to-text':      'speech to text online,voice to text,hindi speech to text,dictation tool,voice typing online,mic transcription',
    'resume-builder':      'free resume maker,resume builder online,create resume free,cv maker india,resume template,download resume pdf',
    'invoice-generator':   'gst invoice generator,free invoice maker,create invoice online,tax invoice template,invoice pdf download,gst compliant invoice',
    'password-gen':        'password generator,strong password generator,random password,secure password creator,8 character password,16 character password',
    'sip-calculator':      'sip calculator india,sip returns calculator,mutual fund sip,monthly sip amount,sip maturity amount,sip investment calculator',
    'emi-calculator':      'emi calculator india,home loan emi,car loan emi,loan emi calculator,monthly emi calculator,personal loan emi',
    'compound-interest-calculator':'compound interest calculator,fd calculator,fixed deposit calculator,compound interest formula,investment return calculator',
    'svg-to-png':          'svg to png,svg to jpg,svg to pdf,convert svg online,vector to image,svg export',
    'barcode-generator':   'barcode generator,ean-13 barcode,upc barcode,code128 barcode,barcode maker,generate barcode online free',
    'url-tools':           'url encoder,url decoder,encode url,decode url,percent encoding,urlencode online',
    'pdf-rotate':          'rotate pdf,rotate pdf pages,fix pdf orientation,turn pdf upside down,pdf rotation online free',
    'pdf-watermark':       'add watermark to pdf,pdf watermark,text watermark pdf,image watermark pdf,stamp pdf online free',
    'color-palette':       'color palette from image,extract colors from image,dominant color finder,image color extractor,color scheme from photo',
    'csv-to-excel':        'csv to excel,csv to xlsx,convert csv online,spreadsheet converter,csv file to excel',
    'json-formatter':      'json formatter,json beautifier,json validator,prettify json,json pretty print,json minify',
    'meme-generator':      'meme generator,create meme online,add text to image,meme maker free,funny meme creator',
    'secret-message':      'encrypt message,decrypt text,text encryptor,message encryption,password protect message',
    'diff-checker':        'compare text online,text diff,find text differences,text comparison tool,diff checker free',
    'pomodoro-timer':      'pomodoro timer,focus timer,study timer,25 minute timer,work break timer,pomodoro technique',
    'regex-tester':        'regex tester,regular expression tester,regex validator,test regex online,regexp checker',
    'readability-analyzer':'readability score,flesch reading ease,grade level checker,text readability,reading time calculator'
  };

  // Inject FAQ schema ------------------------------------------------------------------
  function injectFAQ(faqs) {
    if (!faqs || !faqs.length) return;

    var newItems = faqs.map(function(f) {
      return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
    });

    // Find an existing FAQPage script block and merge into it to avoid duplicate schema error
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        var data = JSON.parse(scripts[i].textContent || scripts[i].innerText);
        if (data['@type'] === 'FAQPage') {
          var existing = data.mainEntity || [];
          // Avoid adding duplicate questions (match by name)
          var existingNames = existing.map(function(q) { return q.name; });
          newItems.forEach(function(item) {
            if (existingNames.indexOf(item.name) === -1) existing.push(item);
          });
          data.mainEntity = existing;
          scripts[i].textContent = JSON.stringify(data);
          return; // merged — done
        }
      } catch (e) {}
    }

    // No existing FAQPage found — create a fresh one
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'dj-seo-faq-schema';
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: newItems });
    document.head.appendChild(s);
  }

  // Extend meta keywords ---------------------------------------------------------------
  function extendKeywords(extra) {
    if (!extra) return;
    var meta = document.querySelector('meta[name="keywords"]');
    if (meta) {
      var existing = meta.getAttribute('content') || '';
      meta.setAttribute('content', existing ? existing + ', ' + extra : extra);
    } else {
      var m = document.createElement('meta');
      m.name = 'keywords';
      m.content = extra;
      document.head.appendChild(m);
    }
  }

  // Run ---------------------------------------------------------------------------------
  if (PAGE_FAQS[slug])     injectFAQ(PAGE_FAQS[slug]);
  if (PAGE_KEYWORDS[slug]) extendKeywords(PAGE_KEYWORDS[slug]);

})();
