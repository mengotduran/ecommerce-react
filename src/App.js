import React, { useState } from 'react';
import { Products, Navbar, Cart, Checkout, ProductDetail } from './components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const sampleProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: '<p>Premium noise-cancelling wireless headphones with 30-hour battery life.</p>',
    details: [
      '30-hour battery life with fast charge (10 min = 3 hours)',
      'Active noise cancellation with ambient sound mode',
      'Bluetooth 5.0 with 10m range',
      'Foldable design with carry case included',
      'Built-in microphone for crystal-clear calls',
      'Compatible with iOS, Android, and PC',
    ],
    price: { raw: 99.99, formatted_with_symbol: '$99.99' },
    image: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', label: 'Front view' },
      { url: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=600', label: 'Side view' },
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', label: 'Ear cup detail' },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', label: 'Lifestyle' },
    ],
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: '<p>Lightweight and breathable running shoes built for all terrains.</p>',
    details: [
      'Ultra-lightweight mesh upper for breathability',
      'Responsive foam midsole for energy return',
      'Durable rubber outsole with multi-terrain grip',
      'Reflective details for low-light visibility',
      'Available in men\'s and women\'s sizing',
      'Machine washable',
    ],
    price: { raw: 79.99, formatted_with_symbol: '$79.99' },
    image: { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', label: 'Front' },
      { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600', label: 'Side' },
      { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600', label: 'Sole detail' },
      { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', label: 'Lifestyle' },
    ],
  },
  {
    id: '3',
    name: 'Leather Backpack',
    description: '<p>Stylish full-grain leather backpack with a dedicated laptop compartment.</p>',
    details: [
      'Full-grain genuine leather construction',
      'Padded 15" laptop compartment',
      'Multiple internal organiser pockets',
      'Brass-finished zippers and hardware',
      'Padded adjustable shoulder straps',
      'Fits carry-on size requirements',
    ],
    price: { raw: 129.99, formatted_with_symbol: '$129.99' },
    image: { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600' },
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', label: 'Front' },
      { url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600', label: 'Open view' },
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', label: 'Detail' },
      { url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600', label: 'Lifestyle' },
    ],
  },
  {
    id: '4',
    name: 'Smart Watch',
    description: '<p>Feature-packed smartwatch with health tracking, GPS, and a 5-day battery.</p>',
    details: [
      'Heart rate & SpO2 monitoring 24/7',
      'Built-in GPS for outdoor tracking',
      '5-day battery life, 2-hour charge',
      'Water resistant up to 50 metres',
      '100+ workout modes',
      'Sleep tracking and stress monitoring',
    ],
    price: { raw: 199.99, formatted_with_symbol: '$199.99' },
    image: { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', label: 'Front' },
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600', label: 'Side' },
      { url: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600', label: 'On wrist' },
      { url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600', label: 'Detail' },
    ],
  },
  {
    id: '5',
    name: 'Sunglasses',
    description: '<p>UV400 polarised sunglasses with a lightweight titanium frame.</p>',
    details: [
      'UV400 polarised lenses block 100% UVA/UVB',
      'Lightweight titanium alloy frame',
      'Anti-scratch and anti-reflective coating',
      'Spring hinges for a flexible fit',
      'Includes hard case and microfibre cloth',
      'Unisex design suitable for all face shapes',
    ],
    price: { raw: 49.99, formatted_with_symbol: '$49.99' },
    image: { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' },
    images: [
      { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', label: 'Front' },
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', label: 'Side' },
      { url: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600', label: 'Lifestyle' },
      { url: 'https://images.unsplash.com/photo-1625591342274-013f4f830a66?w=600', label: 'Detail' },
    ],
  },
  {
    id: '6',
    name: 'Coffee Maker',
    description: '<p>Programmable 12-cup coffee maker with a built-in precision grinder.</p>',
    details: [
      '12-cup thermal carafe keeps coffee hot for hours',
      'Built-in burr grinder with 5 coarseness settings',
      'Programmable 24-hour delay brew timer',
      'Adjustable brew strength (mild / medium / bold)',
      'Pause & Pour feature mid-brew',
      'Easy-clean removable parts',
    ],
    price: { raw: 89.99, formatted_with_symbol: '$89.99' },
    image: { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600' },
    images: [
      { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', label: 'Front' },
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600', label: 'Side' },
      { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600', label: 'In use' },
      { url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600', label: 'Detail' },
    ],
  },
];

const emptyCart = { total_items: 0, line_items: [], subtotal: { formatted_with_symbol: '$0.00' } };

const computeCart = (line_items) => {
  const total_items = line_items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalRaw = line_items.reduce((sum, i) => sum + i.price.raw * i.quantity, 0);
  return {
    line_items,
    total_items,
    subtotal: { formatted_with_symbol: `$${subtotalRaw.toFixed(2)}` },
  };
};

const App = () => {
  const [products] = useState(sampleProducts);
  const [cart, setCart] = useState(emptyCart);
  const [order, setOrder] = useState({});
  const [errorMessage] = useState('');
  const [likedItems, setLikedItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('likedItems')) || []; }
    catch { return []; }
  });

  const handleToggleLike = (productId) => {
    setLikedItems(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('likedItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddToCart = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    setCart(prev => {
      const existing = prev.line_items.find(i => i.product_id === productId);
      const line_items = existing
        ? prev.line_items.map(i =>
            i.product_id === productId ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [
            ...prev.line_items,
            {
              id: productId,
              product_id: productId,
              name: product.name,
              quantity,
              price: product.price,
              line_total: product.price,
              image: product.image,
            },
          ];
      return computeCart(line_items);
    });
  };

  const handleUpdateCartQty = (productId, quantity) => {
    if (quantity < 1) return handleRemoveFromCart(productId);
    setCart(prev => computeCart(prev.line_items.map(i =>
      i.product_id === productId ? { ...i, quantity } : i
    )));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => computeCart(prev.line_items.filter(i => i.product_id !== productId)));
  };

  const handleEmptyCart = () => setCart(emptyCart);

  const handleCaptureCheckout = (checkoutTokenId, newOrder) => {
    setOrder(newOrder);
    setCart(emptyCart);
  };

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Routes>
          <Route
            path="/"
            element={
              <Products
                products={products}
                onAddToCart={handleAddToCart}
                likedItems={likedItems}
                onToggleLike={handleToggleLike}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                products={products}
                onAddToCart={handleAddToCart}
                likedItems={likedItems}
                onToggleLike={handleToggleLike}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                handleUpdateCartQty={handleUpdateCartQty}
                handleRemoveFromCart={handleRemoveFromCart}
                handleEmptyCart={handleEmptyCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                order={order}
                onCaptureCheckout={handleCaptureCheckout}
                error={errorMessage}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
