import os

base_path = r"C:\Users\Voldemort\Desktop\PAGINA IMPORATADA"
output_file = os.path.join(base_path, "PAGES", "HOME_PREVIEW.html")

files = {
    "css": os.path.join(base_path, "assets", "css", "style.css"),
    "js_entity": os.path.join(base_path, "Entities", "ContactSubmission.js"),
    "js_main": os.path.join(base_path, "assets", "js", "main.js"),
    "components": [
        "Navbar.html",
        "HeroSection.html",
        "ServicesSection.html",
        "WhatWeDoSection.html",
        "PortafolioSection.html",
        "TeamSection.html",
        "ContactSection.html",
        "ChatbotWidget.html",
        "Footer.html"
    ]
}

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

html_content = ["<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>SOM ATLAS | AI Automation</title><style>"]

# Add CSS
html_content.append(read_file(files["css"]))
html_content.append("</style></head><body style='background-color: #0a0a0f;'>")

# Add Components
for comp in files["components"]:
    path = os.path.join(base_path, "COMPONENTES", "som-atlas", comp)
    html_content.append(read_file(path))

# Add JS
html_content.append("<script>")

# Entity (Remove export)
entity_code = read_file(files["js_entity"]).replace("export class", "class")
html_content.append(entity_code)

# Main (Remove imports and export default)
main_code = read_file(files["js_main"])
main_code = main_code.replace("import { ContactSubmission } from '../../Entities/ContactSubmission.js';", "")
main_code = main_code.replace("export default function initApp()", "function initApp()")
html_content.append(main_code)

# Init
html_content.append("\ndocument.addEventListener('DOMContentLoaded', initApp);")
html_content.append("</script></body></html>")

with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(html_content))

print(f"Preview generated at: {output_file}")
