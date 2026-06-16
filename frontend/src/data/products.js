import assets from '../assets'
export const categories = [
  {
    id: 'medico',
    title: 'Medico',
    subtitle: 'Ambo elastizado, batas y prendas pensadas para largas jornadas.',
    image: assets.Medico,
  },
  {
    id: 'colegial',
    title: 'Colegial',
    subtitle: 'Uniformes institucionales con identidad y resistencia diaria.',
    image: assets.Escolar,
  },
  {
    id: 'profesional',
    title: 'Profesional',
    subtitle: 'Sastrería y prendas de presencia impecable para equipos.',
    image: assets.sastreria,
  },
]

export const products = [
  {
    id: 'ambo-elastizado',
    name: 'Ambo Elastizado Al Bies',
    category: 'medico',
    categoryLabel: 'Medico',
    price: 104000,
    description:
      'Conjunto medico de calce comodo, confeccionado con tela elastizada para acompañar el movimiento durante toda la jornada.',
    details: 'Tela soft stretch, bolsillos funcionales, cuello en V y terminaciones reforzadas.',
    care: 'Lavar con agua fria, no usar lavandina y secar a la sombra.',
    image:assets.Medico,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'buzo-capucha-cst',
    name: 'Buzo con Capucha CST',
    category: 'colegial',
    categoryLabel: 'Escolar',
    price: 72500,
    description:
      'Buzo escolar de uso diario confeccionado con algodon frizado premium. Combina abrigo, comodidad y una presencia institucional prolija para acompañar la rutina de estudiantes y equipos.',
    details: 'Capucha forrada, puños elastizados, bordado frontal CST y costuras de alta resistencia.',
    care: 'Lavar del reves con agua fria. Planchar a baja temperatura evitando el bordado.',
    image:assets.buzoCapucha,
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: 'saco-sastre-elite',
    name: 'Saco Sastre Elite',
    category: 'profesional',
    categoryLabel: 'Profesional',
    price: 128000,
    description:
      'Saco profesional de corte moderno para equipos administrativos, recepcion y atencion corporativa.',
    details: 'Forreria interna, dos botones, bolsillos frontales y calce estructurado.',
    care: 'Limpieza en seco recomendada. Guardar colgado para conservar la forma.',
    image: assets.sastreria,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'bata-laboratorio',
    name: 'Bata de Laboratorio',
    category: 'medico',
    categoryLabel: 'Medico',
    price: 59000,
    description:
      'Bata blanca para laboratorio, consultorio y espacios academicos con terminacion prolija.',
    details: 'Tela gabardina liviana, botones frontales y bolsillos amplios.',
    care: 'Lavar con prendas claras. Permite planchado medio.',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
  },
]

export const formatPrice = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)

export const cartProduct = products.find((product) => product.id === 'buzo-capucha-cst')

export const cartSummary = {
  quantity: 1,
  shipping: 0,
  tax: 15225,
  discountRate: 0.1,
  coupon: 'COYOTE10',
}
