/**
 * tests/seo.test.js
 * 
 * Tests de validación para la landing de Conecta Horizontal.
 * Verifica que los cambios en el HTML nunca rompan elementos críticos
 * de SEO, accesibilidad y estructura.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Cargar el HTML
const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const $ = cheerio.load(html);

// ─────────────────────────────────────────────
// 1. ESTRUCTURA BÁSICA DEL HTML
// ─────────────────────────────────────────────
describe('🏗️  Estructura básica del HTML', () => {
  test('El archivo index.html existe y no está vacío', () => {
    expect(html.length).toBeGreaterThan(0);
  });

  test('Tiene declaración DOCTYPE', () => {
    expect(html.trim().toLowerCase()).toMatch(/^<!doctype html>/);
  });

  test('El tag <html> tiene atributo lang', () => {
    const lang = $('html').attr('lang');
    expect(lang).toBeDefined();
    expect(lang.length).toBeGreaterThan(0);
  });

  test('Tiene meta charset UTF-8', () => {
    const charset = $('meta[charset]').attr('charset');
    expect(charset.toLowerCase()).toBe('utf-8');
  });

  test('Tiene meta viewport', () => {
    const viewport = $('meta[name="viewport"]').attr('content');
    expect(viewport).toBeDefined();
    expect(viewport).toContain('width=device-width');
  });
});

// ─────────────────────────────────────────────
// 2. SEO ESENCIAL
// ─────────────────────────────────────────────
describe('🔍 SEO Esencial', () => {
  test('<title> existe y no está vacío', () => {
    const title = $('title').text().trim();
    expect(title.length).toBeGreaterThan(0);
  });

  test('<title> tiene más de 10 caracteres (no es un placeholder)', () => {
    const title = $('title').text().trim();
    expect(title.length).toBeGreaterThan(10);
  });

  test('<title> tiene menos de 70 caracteres (no será cortado en Google)', () => {
    const title = $('title').text().trim();
    expect(title.length).toBeLessThanOrEqual(70);
  });

  test('Meta description existe', () => {
    const desc = $('meta[name="description"]').attr('content');
    expect(desc).toBeDefined();
    expect(desc.trim().length).toBeGreaterThan(0);
  });

  test('Meta description tiene entre 50 y 160 caracteres', () => {
    const desc = $('meta[name="description"]').attr('content');
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  test('Existe link canonical', () => {
    const canonical = $('link[rel="canonical"]').attr('href');
    expect(canonical).toBeDefined();
    expect(canonical.startsWith('http')).toBe(true);
  });

  test('Meta robots permite indexación', () => {
    const robots = $('meta[name="robots"]').attr('content');
    expect(robots).toBeDefined();
    expect(robots).toMatch(/index/i);
  });
});

// ─────────────────────────────────────────────
// 3. OPEN GRAPH Y REDES SOCIALES
// ─────────────────────────────────────────────
describe('📢 Open Graph / Redes Sociales', () => {
  test('og:title está definido', () => {
    const og = $('meta[property="og:title"]').attr('content');
    expect(og).toBeDefined();
    expect(og.trim().length).toBeGreaterThan(0);
  });

  test('og:description está definido', () => {
    const og = $('meta[property="og:description"]').attr('content');
    expect(og).toBeDefined();
    expect(og.trim().length).toBeGreaterThan(0);
  });

  test('og:image está definido', () => {
    const og = $('meta[property="og:image"]').attr('content');
    expect(og).toBeDefined();
    expect(og.startsWith('http')).toBe(true);
  });

  test('og:url está definido', () => {
    const og = $('meta[property="og:url"]').attr('content');
    expect(og).toBeDefined();
    expect(og.startsWith('http')).toBe(true);
  });

  test('twitter:card está definido', () => {
    const tw = $('meta[name="twitter:card"]').attr('content');
    expect(tw).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// 4. JERARQUÍA DE ENCABEZADOS
// ─────────────────────────────────────────────
describe('📝 Jerarquía de encabezados', () => {
  test('Existe exactamente UN <h1>', () => {
    expect($('h1').length).toBe(1);
  });

  test('El <h1> no está vacío', () => {
    const h1Text = $('h1').text().trim();
    expect(h1Text.length).toBeGreaterThan(0);
  });

  test('Existen encabezados <h2> en las secciones', () => {
    expect($('h2').length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// 5. IMÁGENES Y ACCESIBILIDAD
// ─────────────────────────────────────────────
describe('🖼️  Imágenes y Accesibilidad', () => {
  test('Todas las imágenes <img> tienen atributo alt', () => {
    const imgsSinAlt = [];
    $('img').each((i, el) => {
      const alt = $(el).attr('alt');
      if (alt === undefined) {
        imgsSinAlt.push($(el).attr('src') || `img #${i + 1}`);
      }
    });
    expect(imgsSinAlt).toEqual([]);
  });

  test('El logo tiene dimensiones declaradas (width y height)', () => {
    const logo = $('nav img').first();
    expect(logo.attr('width')).toBeDefined();
    expect(logo.attr('height')).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// 6. SEGURIDAD Y BUENAS PRÁCTICAS
// ─────────────────────────────────────────────
describe('🔒 Seguridad y buenas prácticas', () => {
  test('Los links con target="_blank" tienen rel="noopener noreferrer"', () => {
    const linksInseguros = [];
    $('a[target="_blank"]').each((i, el) => {
      const rel = $(el).attr('rel') || '';
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
        linksInseguros.push($(el).attr('href') || `link #${i + 1}`);
      }
    });
    expect(linksInseguros).toEqual([]);
  });

  test('Existe favicon declarado', () => {
    const favicon = $('link[rel="icon"]').attr('href');
    expect(favicon).toBeDefined();
    expect(favicon.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// 7. SECCIONES CLAVE DE CONTENIDO
// ─────────────────────────────────────────────
describe('📄 Secciones clave del contenido', () => {
  test('Existe sección de Productos (#productos)', () => {
    expect($('#productos').length).toBe(1);
  });

  test('Existe sección de Garantía (#garantia)', () => {
    expect($('#garantia').length).toBe(1);
  });

  test('Existe footer con sección de contacto (#contacto)', () => {
    expect($('#contacto').length).toBe(1);
  });

  test('Existe al menos un botón de CTA (llamada a la acción)', () => {
    expect($('.btn-main').length).toBeGreaterThan(0);
  });

  test('El footer contiene el nombre de la empresa', () => {
    const footerText = $('footer').text();
    expect(footerText.toLowerCase()).toContain('conecta horizontal');
  });

  test('Existe el año de copyright en el footer', () => {
    const footerText = $('footer').text();
    expect(footerText).toMatch(/202[0-9]/);
  });
});

// ─────────────────────────────────────────────
// 8. SCHEMA.ORG / JSON-LD
// ─────────────────────────────────────────────
describe('🧩 Schema.org JSON-LD', () => {
  test('Existe un script de tipo application/ld+json', () => {
    const ldScript = $('script[type="application/ld+json"]');
    expect(ldScript.length).toBeGreaterThan(0);
  });

  test('El JSON-LD es válido y parseable', () => {
    const ldScript = $('script[type="application/ld+json"]').first().html();
    expect(() => JSON.parse(ldScript)).not.toThrow();
  });

  test('El JSON-LD define @type Organization', () => {
    const ldScript = $('script[type="application/ld+json"]').first().html();
    const data = JSON.parse(ldScript);
    expect(data['@type']).toBe('Organization');
  });

  test('El JSON-LD tiene un nombre de organización', () => {
    const ldScript = $('script[type="application/ld+json"]').first().html();
    const data = JSON.parse(ldScript);
    expect(data.name).toBeDefined();
    expect(data.name.trim().length).toBeGreaterThan(0);
  });
});
