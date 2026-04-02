# DIRECTIVA: LANDING_SOM_SYNGULAR

> **ID:** 2026-03-10
> **Script Asociado:** `React Application (App.jsx)`
> **Última Actualización:** 2026-03-10
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Construir una landing page moderna, cinematográfica e interactiva para SOM SYNGULAR (IA & Automatización).
- **Criterio de Éxito:** La web es funcional, utiliza GSAP para animaciones fluidas, sigue la paleta Vapor Clinic y es responsive.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Presets Visuales:** Vapor Clinic (#0B0B12, #6C3BFF, #A855F7).
- **Contenido:** Flujo de secciones definido (Hero H2, Social Proof SP5, Features, Manifiesto M1, Proceso P1, CTA3).

### Salidas (Outputs)
- **Artefactos Generados:** Proyecto Vite + React con componentes modulares en `src/components`.
- **Estética:** Glassmorphism, texturas de ruido, animaciones ScrollTrigger.

## 3. Flujo Lógico (Algoritmo)
1. **Inicialización:** Setup de Vite, Tailwind CSS y GSAP.
2. **Sistema de Diseño:** Definición de tokens en `tailwind.config.js` e `index.css` (incluyendo filtro de ruido SVG).
3. **Desarrollo de Componentes:** Creación de Navbar, Hero, SocialProof, Features (Telemetría, Métricas, Orbit), ROICalculator (reactiva/desplegable), Manifesto, Proceso, Equipo (stagger fade-up) y CTA.
4. **Animación:** Integración de ScrollTrigger para efectos de revelado y apilamiento (Sticky Stack).
5. **Verificación:** Ejecución de build para asegurar integridad estructural.

## 4. Herramientas y Librerías
- **Framework:** React 19
- **Estilos:** Tailwind CSS v3.4.17
- **Animaciones:** GSAP 3 + ScrollTrigger
- **Iconos:** Lucide React

## 5. Restricciones y Casos Borde (Edge Cases)
- **Rendimiento:** El uso de GSAP ScrollTrigger requiere limpieza en el desmontaje (useEffect cleanup).
- **Responsividad:** El layout 3x2 de Social Proof y el split del Hero deben adaptarse a una sola columna en móviles.
- **Interactividad:** Los botones magnéticos y hover effects deben ser suaves (transiciones de 300ms+).

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)

| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 10/03 | Setup Tailwind | Versión específica v3 requerida | Se instaló `tailwindcss@3.4.17` explícitamente. |
| 10/03 | Animación Stick | Colisión de z-index en Proceso | Se usó `sticky` con offsets calculados y `glass` con blur. |
| 10/03 | Modificación ROI | Añadir interactividad reactiva | Se implementó calculadora ROI desplegable con GSAP height. |

## 7. Ejemplos de Uso
```bash
# Iniciar desarrollo
npm run dev

# Generar producción
npm run build
```

## 8. Checklist de Pre-Ejecución
- [x] Node.js instalado
- [x] Variables de colores configuradas en Tailwind
- [x] Assets de Unsplash vinculados correctamente

## 9. Checklist Post-Ejecución
- [x] Build verificado (0 errores)
- [x] Animaciones ScrollTrigger sincronizadas
- [x] Filtro de ruido SVG aplicado en overlay global
