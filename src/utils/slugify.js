// utils/slugify.js
export function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Reemplaza espacios por -
      .replace(/[^\w\-]+/g, '') // Elimina caracteres especiales
      .replace(/\-\-+/g, '-') // Reemplaza múltiples - por uno solo
      .replace(/^-+/, '') // Elimina - del inicio
      .replace(/-+$/, ''); // Elimina - del final
  }
  