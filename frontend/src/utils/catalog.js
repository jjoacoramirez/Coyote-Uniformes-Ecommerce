import assets from '../assets'

const categoryImages = {
  medico: assets.Medico,
  medicos: assets.Medico,
  colegial: assets.Escolar,
  escolar: assets.Escolar,
  escolares: assets.Escolar,
  'uniformes-escolares': assets.Escolar,
  'genericos-escolares': assets.buzoCapucha,
  'underware-medias': assets.Medico,
  'underwear-medias': assets.Medico,
  'tu-uniforme-en-casa': assets.banner,
  profesional: assets.sastreria,
  profesionales: assets.sastreria,
}

export function normalizeCategoryName(name) {
  return String(name ?? 'General')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function getCategoriaNombre(entity) {
  return entity?.categoria?.nombre ?? entity?.Categoria?.nombre ?? entity?.categoriaNombre ?? 'General'
}

export function toProductShape(producto, variantes = []) {
  const categoriaNombre = getCategoriaNombre(producto)
  const variantesActivas = variantes.filter((variante) => variante.activo !== false)

  return {
    id: producto.idProducto,
    name: producto.nombre,
    image: producto.imagenUrl || 'https://placehold.co/400x300?text=Sin+imagen',
    price: Number(producto.precioBase ?? 0),
    category: normalizeCategoryName(categoriaNombre),
    categoryLabel: categoriaNombre,
    description: producto.descripcion ?? '',
    sizes: variantesActivas.map((variante) => variante.talle),
    variantes: variantesActivas,
    featured: Boolean(producto.destacado ?? producto.featured),
  }
}

export function toCategoryShape(categoria) {
  const title = categoria.nombre ?? 'General'
  const id = normalizeCategoryName(title)

  return {
    id,
    title,
    subtitle: categoria.descripcion || `Uniformes y prendas de la linea ${title}.`,
    image: categoria.imagenUrl || categoryImages[id] || assets.banner,
  }
}

export function toCartProductShape(item) {
  return {
    id: item.idProducto,
    name: item.productoNombre,
    image: item.productoImagenUrl || 'https://placehold.co/400x300?text=Sin+imagen',
    price: Number(item.precioUnitario ?? 0),
    category: normalizeCategoryName(item.categoriaNombre),
    categoryLabel: item.categoriaNombre ?? 'General',
  }
}
