const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Voldemort\\Desktop\\PAGINA IMPORATADA";
const outputFile = path.join(basePath, "PAGES", "HOME_PREVIEW.html");

const files = {
    css: path.join(basePath, "assets", "css", "style.css"),
    js_entity: path.join(basePath, "Entities", "ContactSubmission.js"),
    js_main: path.join(basePath, "assets", "js", "main.js"),
    components: [
        "Navbar.html",
        "HeroSection.html",
        "TrustSection.html",
        "WhatWeDoSection.html",
        "ServicesSection.html",
        "PricingSection.html",
        "ROICalculatorSection.html",
        "PortafolioSection.html",
        "TestimonialsSection.html",
        "FAQSection.html",
        "TeamSection.html",
        "ContactSection.html",
        "ChatbotWidget.html",
        "Footer.html",
        "AdminDashboard.html",
        "CookieBanner.html"
    ]
};

try {
    let htmlContent = "<!DOCTYPE html><html lang='es'><head>";
    htmlContent += "<meta charset='UTF-8'>";
    htmlContent += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    htmlContent += "<title>SOM ATLAS | Automatización Inteligente con IA</title>";
    htmlContent += "<meta name='description' content='Transformamos tu negocio con Inteligencia Artificial y Automatización. Soluciones a medida para escalar resultados.'>";
    htmlContent += "<meta name='keywords' content='IA, Automatización, Chatbots, Desarrollo Web, Transformación Digital, SOM ATLAS'>";
    htmlContent += "<meta name='author' content='SOM ATLAS SOLUTION'>";
    htmlContent += "<meta property='og:type' content='website'>";
    htmlContent += "<meta property='og:url' content='https://somsyngular.com/'>";
    htmlContent += "<meta property='og:title' content='SOM ATLAS SOLUTION | IA & Automatización'>";
    htmlContent += "<meta property='og:description' content='Transformamos tu negocio con Inteligencia Artificial y Automatización. Soluciones a medida para escalar resultados.'>";
    htmlContent += "<meta property='og:image' content='https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'>";
    htmlContent += "<link rel='icon' href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'>";
    htmlContent += "<style>";

    // CSS
    htmlContent += fs.readFileSync(files.css, 'utf8');
    htmlContent += "</style></head><body style='background-color: #0a0a0f;'>";

    // Components
    files.components.forEach(comp => {
        const compPath = path.join(basePath, "COMPONENTES", "som-atlas", comp);
        htmlContent += fs.readFileSync(compPath, 'utf8');
    });

    // JS
    htmlContent += "<script>";

    // Entity
    let entityCode = fs.readFileSync(files.js_entity, 'utf8');
    entityCode = entityCode.replace("export class", "class");
    htmlContent += entityCode;

    // Main
    let mainCode = fs.readFileSync(files.js_main, 'utf8');
    mainCode = mainCode.replace("import { ContactSubmission } from '../../Entities/ContactSubmission.js';", "");
    mainCode = mainCode.replace("export default function initApp()", "function initApp()");
    htmlContent += mainCode;

    // Init
    htmlContent += "\ndocument.addEventListener('DOMContentLoaded', initApp);";
    htmlContent += "</script></body></html>";

    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log("Preview generated successfully at: " + outputFile);

} catch (err) {
    console.error("Error building preview:", err);
}
