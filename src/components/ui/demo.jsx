import React from 'react';
import { PoemAnimation } from "./3d-animation";

// --- Data Configuration ---
const paragraphText = "SOM SYNGULAR — TU EMPRESA NO NECESITA MÁS HERRAMIENTAS. <span style='color: #FFFFFF; text-shadow: 0 0 10px rgba(255,255,255,0.8);'>NECESITA UN SISTEMA INTELIGENTE.</span> AUTOMATIZACIÓN AVANZADA. IA AL SERVICIO DE TUS RESULTADOS. ".repeat(30);

const ANIMATION_DATA = {
    poemHTML: `<div style="display:flex; align-items:center; height:100%;"><p style="margin:0;">${paragraphText}</p></div>`,
    backgroundImageUrl: "https://i.ibb.co/q3XSxR9W/20250831-120144.jpg",
    boyImageUrl: "https://i.ibb.co/Y4FKvK38/20250831-113022.png"
};

export default function AppDemo() {
    return (
        <PoemAnimation
            poemHTML={ANIMATION_DATA.poemHTML}
            backgroundImageUrl={ANIMATION_DATA.backgroundImageUrl}
            boyImageUrl={ANIMATION_DATA.boyImageUrl}
        />
    );
}
