import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Local images live in /public/products/<slug>/<file>
const p = (slug: string, ...files: string[]) => files.map((f) => `/products/${slug}/${f}`);

const featured = [
  {
    name: 'Bugatti Brouillard',
    price: 20000000,
    category: 'Supercars',
    description: 'A one-of-one bespoke hypercar built under Bugatti\'s Solitaire coachbuilding programme. The Brouillard is the swan song for the legendary quad-turbo W16, wrapped in a hand-formed body unlike any other Bugatti on the road.',
    features: [
      '1,578 hp quad-turbo W16 engine',
      'One-of-one bespoke coachbuilt body',
      'Carbon fibre monocoque chassis',
      'Hand-finished bespoke interior',
    ],
    images: p('bugatti-brouillard', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
  {
    name: 'Lamborghini Revuelto',
    price: 608358,
    category: 'Supercars',
    description: 'Lamborghini\'s V12 hybrid flagship. The Revuelto combines a screaming naturally aspirated V12 with three electric motors for a combined 1,015 hp, an 8-speed dual-clutch transmission, and active aerodynamics that adapt to every corner.',
    features: [
      '1,015 hp hybrid V12 powertrain',
      '0-100 km/h in 2.5 seconds',
      '8-speed dual-clutch transmission',
      'Active aerodynamics and torque vectoring',
    ],
    images: p('lamborghini-revuelto', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
  {
    name: 'Tesla Cybertruck',
    price: 79990,
    category: 'Adventure',
    description: 'An all-electric pickup built on an ultra-hard 30X cold-rolled stainless steel exoskeleton. With up to 600 hp from a dual-motor all-wheel-drive setup, adaptive air suspension, and a 325-mile range, the Cybertruck redefines what a truck can be.',
    features: [
      '600 hp dual-motor all-wheel drive',
      '325-mile range',
      '30X cold-rolled stainless steel exoskeleton',
      'Adaptive air suspension',
    ],
    images: p('tesla-cybertruck', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'),
  },
  {
    name: 'Kawasaki Ninja H2R',
    price: 62000,
    category: 'Sport Bikes',
    description: 'The most extreme production motorcycle on earth. 310 hp from a supercharged inline-four, a carbon-fibre airframe, and aerodynamic wings designed in a wind tunnel.',
    features: [
      '310 hp supercharged inline-four',
      'Wind-tunnel aerodynamic wings',
      'Carbon fibre trellis frame',
      'Brembo Stylema brake calipers',
    ],
    images: p('kawasaki-ninja-h2r', '1.avif', '2.avif', '3.jpg', '4.png'),
  },
  {
    name: 'Lamborghini Huracan Evo',
    price: 261000,
    category: 'Supercars',
    description: 'A 631 hp naturally aspirated V10, rear-wheel steering, and a fully reworked aerodynamic package make the Huracan Evo one of the sharpest-handling supercars on sale.',
    features: [
      '631 hp naturally aspirated V10',
      'Rear-wheel steering',
      'Lamborghini Dynamic Steering',
      '0-100 km/h in 2.9 seconds',
    ],
    images: p('lamborghini-huracan-evo', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
];

const catalogue = [
  {
    name: 'Lamborghini Reventon Roadster',
    price: 2000000,
    category: 'Supercars',
    badge: 'sale',
    description: 'One of only 15 ever built. The Reventon Roadster pairs a 6.5L V12 with a jet-fighter-inspired body, making it one of the rarest and most collectible Lamborghinis in existence.',
    images: p('lamborghini-reventon-roadster', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'),
  },
  {
    name: 'Chevrolet Corvette E-Ray Convertible',
    price: 112000,
    category: 'Muscle Cars',
    badge: 'new',
    description: 'The first all-wheel-drive, hybrid Corvette. A 6.2L V8 and an electric front motor combine for 655 hp, launching the E-Ray to 60 mph in under 2.5 seconds.',
    images: p('chevrolet-corvette-e-ray', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
  {
    name: 'Mitsubishi XRT Concept',
    price: 48000,
    category: 'Adventure',
    badge: null,
    description: 'A rugged off-road concept previewing Mitsubishi\'s next-generation SUV design language, with reinforced bodywork, raised suspension, and a bold, expedition-ready stance.',
    images: p('mitsubishi-xrt-concept', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
  {
    name: 'Lamborghini Centenario',
    price: 1900000,
    category: 'Supercars',
    badge: null,
    description: 'Built to celebrate Ferruccio Lamborghini\'s 100th birthday, only 40 units exist. The Centenario packs a 770 hp naturally aspirated V12 in a razor-sharp carbon fibre body.',
    images: p('lamborghini-centenario', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
  {
    name: 'Toyota GR GT Concept',
    price: 220000,
    category: 'Sports Cars',
    badge: 'new',
    description: 'Toyota\'s vision for a future GR halo supercar, built around a lightweight chassis and a high-output hybrid powertrain developed from Toyota\'s endurance racing programme.',
    images: p('toyota-gr-gt-concept', '1.jpg', '2.jpg', '3.jpg', '4.jpg'),
  },
  {
    name: 'Lamborghini Aventador',
    price: 507000,
    category: 'Supercars',
    badge: null,
    description: 'The naturally aspirated V12 flagship that defined a generation of Lamborghinis. 770 hp, scissor doors, and a carbon fibre monocoque built for pure drama.',
    images: p('lamborghini-aventador', '1.jpg', '2.jpg', '3.jpg'),
  },
  {
    name: 'Lamborghini Huracan STO',
    price: 344778,
    category: 'Supercars',
    badge: null,
    description: 'Born on the racetrack and built for the road. The Huracan STO packs 640 hp, rear-wheel drive, and a naturally aspirated V10 that screams to 8,000 rpm.',
    images: p('lamborghini-huracan-sto', '1.avif', '2.avif', '3.avif'),
  },
  {
    name: 'Audi Nuvolari',
    price: 200000,
    category: 'Sports Cars',
    badge: 'new',
    description: 'Audi\'s grand touring concept for the next decade, blending an electric performance powertrain with a sweeping, aerodynamic silhouette inspired by Audi\'s racing heritage.',
    images: p('audi-nuvolari', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'),
  },
  {
    name: 'Dacia Manifesto Concept',
    price: 35000,
    category: 'Adventure',
    badge: null,
    description: 'A rugged, modular adventure vehicle concept from Dacia, built around durable materials, removable accessories, and a go-anywhere attitude at an accessible price.',
    images: p('dacia-manifesto-concept', '1.jpg', '2.jpg', '3.jpg'),
  },
  {
    name: 'Yamaha MT-09 Y-AMT',
    price: 10800,
    category: 'Sport Bikes',
    badge: 'new',
    description: 'The MT-09 gets Yamaha\'s new Y-AMT automated manual transmission, pairing the punchy 890cc CP3 triple with clutchless shifting for the best of both worlds.',
    images: p('yamaha-mt09', '1.webp', '2.jpg'),
  },
  {
    name: 'BMW S 1000 R',
    price: 19560,
    category: 'Sport Bikes',
    badge: null,
    description: 'A naked sportbike built around the S 1000 RR\'s 165 hp inline-four, with an upright riding position, full electronics suite, and razor-sharp handling.',
    images: p('bmw-s1000r', '1.jpeg', '2.webp', '3.jpg', '4.jpg'),
  },
  {
    name: 'Harley-Davidson Nightster',
    price: 9999,
    category: 'Cruisers',
    badge: 'hot',
    description: 'A lighter, more agile take on the classic Harley cruiser. The Nightster\'s liquid-cooled Revolution Max 975T engine delivers a sharp, modern ride without losing that V-twin soul.',
    images: p('harley-davidson-nightster', '1.avif', '2.jpg', '3.avif', '4.jpg'),
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of featured) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.images[0],
        images: p.images,
        features: p.features,
        stock: 5,
        featured: true,
        badge: null,
      },
    });
  }

  for (const p of catalogue) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.images[0],
        images: p.images,
        stock: 5,
        featured: false,
        badge: p.badge,
      },
    });
  }

  console.log(`Seeded ${featured.length + catalogue.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
