import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const img  = (id: string) => `https://images.unsplash.com/${id}?w=1400&q=90&auto=format&fit=crop`;
const cimg = (id: string) => `https://images.unsplash.com/${id}?w=800&q=85&auto=format&fit=crop`;

// All IDs verified 200 OK with confirmed descriptions from unsplash.com
const featured = [
  {
    name: 'Ferrari SF90 Stradale',
    price: 507000,
    category: 'Supercars',
    description: 'The most powerful Ferrari road car ever built. 1,000 hp hybrid V8, 0-100 km/h in 2.5 s, and an all-wheel-drive system that plants every watt of power.',
    features: [
      '986 hp hybrid V8 engine',
      '0-100 km/h in 2.5 seconds',
      'All-wheel drive with e-Diff',
      'Top speed 340 km/h',
    ],
    images: [
      img('photo-1751467928515-14a3515b99a8'),
      img('photo-1600510424051-30d592a75353'),
      img('photo-1543071671-d678538d6618'),
      img('photo-1621953459196-2bab8e28331a'),
    ],
  },
  {
    name: 'Lamborghini Huracan STO',
    price: 329000,
    category: 'Supercars',
    description: 'Born on the racetrack and built for the road. The Huracan STO packs 640 hp, rear-wheel drive, and a naturally aspirated V10 that screams to 8,000 rpm.',
    features: [
      '640 hp naturally aspirated V10',
      'Rear-wheel drive only',
      'Carbon fibre body panels',
      '0-100 km/h in 3.0 seconds',
    ],
    images: [
      img('photo-1617650728468-8581e439c864'),
      img('photo-1689589079779-d442bba9ef97'),
      img('photo-1767907571229-01cf4ba03590'),
      img('photo-1724391114112-c83ad59f1d5f'),
    ],
  },
  {
    name: 'Porsche 911 GT3 RS',
    price: 228000,
    category: 'Sports Cars',
    description: 'Precision engineering at its peak. The GT3 RS uses aerodynamic downforce, a 525 hp flat-six, and a PDK gearbox tuned to the millisecond.',
    features: [
      '525 hp 4.0L flat-six',
      'Active aerodynamics system',
      '7-speed PDK dual-clutch',
      'Weissach package available',
    ],
    images: [
      img('photo-1756990637536-714b76296a30'),
      img('photo-1622398703904-7ae5d55f8e1a'),
      img('photo-1704476944918-c1258561ebb9'),
      img('photo-1722385640799-4ee84eb90038'),
    ],
  },
  {
    name: 'Harley-Davidson Fat Boy',
    price: 21499,
    category: 'Cruisers',
    description: 'An icon reborn. The Fat Boy pairs a Milwaukee-Eight 114 engine with solid-disc wheels and a stance that turns every street into a runway.',
    features: [
      'Milwaukee-Eight 114 V-twin',
      'Solid aluminium disc wheels',
      'Keyless ignition and security',
      'Reflex defensive rider systems',
    ],
    images: [
      img('photo-1656420731892-a4ece094df5a'),
      img('photo-1558981396-5fcf84bdf14d'),
      img('photo-1473147437169-91ac8cebc017'),
      img('photo-1645021081538-15ecfc18269c'),
    ],
  },
  {
    name: 'Kawasaki Ninja H2R',
    price: 57000,
    category: 'Sport Bikes',
    description: 'The most extreme production motorcycle on earth. 310 hp from a supercharged inline-four, a carbon-fibre airframe, and aerodynamic wings designed in a wind tunnel.',
    features: [
      '310 hp supercharged inline-four',
      'Wind-tunnel aerodynamic wings',
      'Carbon fibre trellis frame',
      'Brembo Stylema brake calipers',
    ],
    images: [
      img('photo-1763244737839-220b4cd0259e'),
      img('photo-1692317785388-a7d076077d9d'),
      img('photo-1683455425959-8f5bf1e8fbfb'),
      img('photo-1610708946112-a7db73966c46'),
    ],
  },
];

const catalogue = [
  {
    name: 'McLaren 720S',
    price: 299000,
    category: 'Supercars',
    badge: 'new',
    description: '720 hp twin-turbo V8, dihedral doors, and a carbon fibre monocoque that weighs just 1,283 kg. Pure McLaren DNA.',
    images: [
      cimg('photo-1709221387689-715c3fcac442'), // b&w dark supercar
      cimg('photo-1761554619924-627006522506'), // black McLaren P1 indoors
      cimg('photo-1577975396515-a6a5271697f3'), // black supercar studio
    ],
  },
  {
    name: 'Shelby GT500',
    price: 74995,
    category: 'Muscle Cars',
    badge: 'hot',
    description: '760 hp supercharged V8, Tremec 7-speed dual-clutch, and magnetic ride control. The most powerful street-legal Mustang ever.',
    images: [
      cimg('photo-1724391114153-aab0c652371c'), // dark muscle car
      cimg('photo-1571290130194-08c1cf854980'), // brown Shelby coupe
      cimg('photo-1587750113469-d2ba02441e8f'), // black muscle car sunset
    ],
  },
  {
    name: 'Porsche Cayman GT4',
    price: 102000,
    category: 'Sports Cars',
    badge: null,
    description: 'Mid-engine perfection. The GT4 RS borrows the 911 GT3 flat-six and puts it directly behind your head.',
    images: [
      cimg('photo-1622398703904-7ae5d55f8e1a'), // silver Porsche on black asphalt
      cimg('photo-1756990637536-714b76296a30'), // dark Porsche rear view
      cimg('photo-1704476944918-c1258561ebb9'), // car on black background
    ],
  },
  {
    name: 'Ducati Panigale V4',
    price: 28395,
    category: 'Sport Bikes',
    badge: 'hot',
    description: '214 hp Desmosedici Stradale V4 engine, aerodynamic winglets, and Ducati Cornering ABS. A MotoGP machine for the street.',
    images: [
      cimg('photo-1568772585407-9361f9bf3a87'), // red/black sports bike
      cimg('photo-1559051992-824a1d4353fb'), // black/red Ducati
      cimg('photo-1754719049888-29f34b506b85'), // red Ducati front detail
    ],
  },
  {
    name: 'Triumph Scrambler 1200',
    price: 16500,
    category: 'Adventure',
    badge: 'new',
    description: 'An adventure-ready twin with 89 hp, 10 inches of ground clearance, and long-travel suspension ready for any terrain you throw at it.',
    images: [
      cimg('photo-1610708946112-a7db73966c46'), // white/black motorcycle dark room
      cimg('photo-1683455425978-c40c16590b0b'), // motorcycle front close-up
      cimg('photo-1449426468159-d96dbf08f19f'), // motorcycle on road
    ],
  },
  {
    name: 'BMW M4 Competition',
    price: 84500,
    category: 'Sports Cars',
    badge: null,
    description: '503 hp twin-turbo inline-six, M xDrive all-wheel drive, and the most aggressive M4 styling since the E30. Track-ready from the factory.',
    images: [
      cimg('photo-1724391114112-c83ad59f1d5f'), // black sports car front dark
      cimg('photo-1637088500061-32cc39d33a7b'), // black sports car doors open
      cimg('photo-1722385640799-4ee84eb90038'), // black car in dark
    ],
  },
  {
    name: 'Indian Scout',
    price: 12299,
    category: 'Cruisers',
    badge: 'sale',
    description: '100 hp liquid-cooled V-twin in a low-slung frame with genuine leather seat, wide handlebars, and genuine American soul.',
    images: [
      cimg('photo-1683455425959-8f5bf1e8fbfb'), // motorcycle close-up dark
      cimg('photo-1656420731892-a4ece094df5a'), // black motorcycle black background
      cimg('photo-1473147437169-91ac8cebc017'), // black bone motorcycle on black bg
    ],
  },
  {
    name: 'Honda CBR1000RR-R',
    price: 28500,
    category: 'Sport Bikes',
    badge: null,
    description: 'Engineered with lessons from HRC MotoGP programme. 217 hp, Ohlins Smart EC 2.0 suspension, and Brembo Stylema brakes.',
    images: [
      cimg('photo-1692317785388-a7d076077d9d'), // motorcycle lit up in dark
      cimg('photo-1615172282427-9a57ef2d142e'), // red/black sports bike
      cimg('photo-1622189287746-9aebc28946e3'), // yellow/black motorcycle close-up
    ],
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
