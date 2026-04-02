import React, { createContext, useContext, useState } from 'react';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Sistema de Automatización Inteligente',
    title: 'Tu empresa no necesita más herramientas.',
    titleHighlight: 'Necesita un sistema inteligente.',
    subtitle: 'Automatizamos procesos, integramos IA y diseñamos sistemas digitales que trabajan por ti 24/7.',
    cta1: 'Agendar diagnóstico IA',
    cta2: 'Ver casos reales',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600',
  },
  socialProof: {
    title: 'Impulsando empresas que ya automatizaron su futuro',
  },
  features: {
    badge: 'Nuestras Soluciones',
    title: 'Todo lo que necesitas para escalar.',
    subtitle: 'Un ecosistema completo de automatización e inteligencia artificial diseñado para empresas modernas.',
  },
  manifesto: {
    title: 'Creemos que el trabajo duro no debería ser Manual.',
    body: 'La mayoría de las empresas están atrapadas en ciclos repetitivos: responder emails, actualizar hojas de cálculo, mover datos entre sistemas. Nosotros pensamos diferente. La inteligencia artificial y la automatización no son el futuro — son el presente, y las empresas que los adopten hoy serán las que dominen mañana.',
    cta: 'Únete al movimiento →',
  },
  proceso: {
    badge: 'Nuestro Proceso',
    title: 'De la idea al sistema en 4 semanas.',
    subtitle: 'Un proceso probado que garantiza resultados medibles desde el primer mes.',
  },
  equipo: {
    badge: 'El Equipo',
    title: 'Personas reales, resultados reales.',
    subtitle: 'Un equipo multidisciplinario de ingenieros, diseñadores y estrategas de IA.',
    members: [
      {
        name: 'Alex Rivera',
        role: 'Arquitecto de Automatización',
        desc: 'Experto en optimización de flujos de trabajo empresariales y backend escalable.',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Elena Soler',
        role: 'Especialista IA',
        desc: 'Diseñadora de modelos de lenguaje y agentes autónomos para servicios dinámicos.',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      },
      {
        name: 'Marcus Chen',
        role: 'Ingeniero de Sistemas',
        desc: 'Integrador de APIs complejas y arquitecturas cloud de alta disponibilidad.',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      },
    ],
  },
  casos: {
    items: [
      { title: 'Automatización CRM IA', category: 'Enterprise', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
      { title: 'Agente conversacional ecommerce', category: 'UX / Service', img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=600' },
      { title: 'Sistema IA atención cliente', category: 'Support', img: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=600' },
      { title: 'Dashboard analítico automatizado', category: 'Data', img: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=600' },
      { title: 'Integración IA marketing', category: 'Automation', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
      { title: 'Sistema de generación de leads', category: 'Sales', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600' },
    ],
  },
  cta: {
    title: 'Construye un negocio que funcione incluso cuando no estás.',
    subtitle: 'Cuéntanos qué proceso quieres automatizar y te contactamos en menos de 24 h con un plan de acción.',
    button: 'Solicitar Diagnóstico IA →',
  },
  footer: {
    tagline: 'Automatización inteligente para empresas modernas que buscan escalar sin límites.',
  },
};

const STORAGE_KEY = 'syngular_content';
const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return deepMerge(DEFAULT_CONTENT, JSON.parse(stored));
    } catch {}
    return DEFAULT_CONTENT;
  });

  const updateSection = (section, field, value) => {
    setContent(prev => {
      const next = { ...prev, [section]: { ...prev[section], [field]: value } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Update a nested array item (e.g. equipo.members[1].img)
  const updateArrayItem = (section, arrayKey, index, field, value) => {
    setContent(prev => {
      const arr = [...(prev[section][arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      const next = { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Add a new item to an array field (e.g. equipo.members)
  const addArrayItem = (section, arrayKey, newItem) => {
    setContent(prev => {
      const arr = [...(prev[section][arrayKey] || []), newItem];
      const next = { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Remove an item from an array field by index
  const removeArrayItem = (section, arrayKey, index) => {
    setContent(prev => {
      const arr = (prev[section][arrayKey] || []).filter((_, i) => i !== index);
      const next = { ...prev, [section]: { ...prev[section], [arrayKey]: arr } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetSection = (section) => {
    setContent(prev => {
      const next = { ...prev, [section]: DEFAULT_CONTENT[section] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(DEFAULT_CONTENT);
  };

  return (
    <ContentContext.Provider value={{ content, updateSection, updateArrayItem, addArrayItem, removeArrayItem, resetSection, resetAll, DEFAULT_CONTENT }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

function deepMerge(defaults, override) {
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (override[key] === undefined) continue;
    if (Array.isArray(defaults[key])) {
      result[key] = override[key]; // arrays replaced wholesale
    } else if (typeof defaults[key] === 'object') {
      result[key] = { ...defaults[key], ...override[key] };
    } else {
      result[key] = override[key];
    }
  }
  return result;
}
