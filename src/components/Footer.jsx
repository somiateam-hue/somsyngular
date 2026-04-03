import React from 'react';
import AnimatedFooter from './ui/animated-footer';

const Footer = () => (
  <AnimatedFooter
    brand={{
      name: <span>SOM <span style={{ color: '#A855F7' }}>SYNGULAR</span></span>,
      tagline: 'Automatización inteligente para empresas modernas que buscan escalar sin límites.',
      status: 'Sistema activo',
      version: 'v1.0.4',
    }}
    columns={[
      {
        title: 'Soluciones',
        links: [
          { href: '#', label: 'Automatización' },
          { href: '#', label: 'IA Generativa' },
          { href: '#', label: 'Chatbots Avanzados' },
          { href: '#', label: 'Sistemas Cloud' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { href: '#casos',   label: 'Casos de Éxito' },
          { href: '#proceso', label: 'Nuestro Proceso' },
          { href: '#',        label: 'Blog Tech' },
          { href: '#',        label: 'Sobre Nosotros' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { href: '#', label: 'Privacidad' },
          { href: '#', label: 'Términos' },
          { href: '#', label: 'Cookies' },
        ],
      },
    ]}
    leftLinks={[
      { href: '#casos',    label: 'Casos de Éxito' },
      { href: '#proceso',  label: 'Proceso' },
      { href: '#contacto', label: 'Contacto' },
    ]}
    rightLinks={[
      { href: '#', label: 'Privacidad' },
      { href: '#', label: 'Términos' },
      { href: '#', label: 'Cookies' },
    ]}
    copyrightText={`SOM SYNGULAR ${new Date().getFullYear()}. Todos los derechos reservados.`}
    barCount={23}
  />
);

export default Footer;
