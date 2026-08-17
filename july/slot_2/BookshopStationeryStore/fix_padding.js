const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'pages', 'contact.html');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('</style>', `    @media (max-width: 1024px) {
        .contact-shop-section { padding-bottom: 120px !important; }
    }
    </style>`);

content = content.replace('<!-- 1. Contact Info & Map -->\r\n    <section class="section">', '<!-- 1. Contact Info & Map -->\r\n    <section class="section contact-shop-section">');

content = content.replace('<!-- 1. Contact Info & Map -->\n    <section class="section">', '<!-- 1. Contact Info & Map -->\n    <section class="section contact-shop-section">');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done padding');
