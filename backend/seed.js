import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Restaurant from './src/models/Restaurant.js';
import Food from './src/models/Food.js';
import Coupon from './src/models/Coupon.js';

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not set in .env — please configure your database first.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Restaurant.deleteMany(),
      Food.deleteMany(),
      Coupon.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // ---- USERS ----
    const adminUser = await User.create({
      name: 'BiteGo Admin',
      email: 'admin@bitego.com',
      phone: '9000000001',
      password: 'admin123',
      role: 'admin',
    });

    const owner1 = await User.create({
      name: 'Rajan Patel',
      email: 'owner1@bitego.com',
      phone: '9000000002',
      password: 'owner123',
      role: 'restaurantOwner',
    });

    const owner2 = await User.create({
      name: 'Priya Sharma',
      email: 'owner2@bitego.com',
      phone: '9000000003',
      password: 'owner123',
      role: 'restaurantOwner',
    });

    const hashedUserPassword = await bcrypt.hash('user123', 12);
    const users = await User.insertMany([
      { name: 'John Doe', email: 'john@example.com', phone: '9111111111', password: hashedUserPassword, role: 'user' },
      { name: 'Ananya Singh', email: 'ananya@example.com', phone: '9222222222', password: hashedUserPassword, role: 'user' },
      { name: 'Rahul Gupta', email: 'rahul@example.com', phone: '9333333333', password: hashedUserPassword, role: 'user' },
      { name: 'Sneha Verma', email: 'sneha@example.com', phone: '9444444444', password: hashedUserPassword, role: 'user' },
      { name: 'Dev Mehta', email: 'dev@example.com', phone: '9555555555', password: hashedUserPassword, role: 'user' },
    ]);

    console.log('👤 Users created:', 2 + users.length + 1, '(including admin + 2 owners)');

    // ---- RESTAURANTS ----
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Spice Garden',
        description: 'Authentic North Indian cuisine with a modern twist. From buttery dal makhani to crispy tandoori platters.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100',
        address: { street: '12 MG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
        cuisine: ['North Indian', 'Mughlai', 'Tandoor'],
        rating: 4.3,
        totalRatings: 284,
        deliveryTime: 35,
        priceForTwo: 500,
        owner: owner1._id,
        isOpen: true,
        deliveryFee: 30,
        offers: [{ title: '20% OFF', description: 'Use SPICE20 for 20% off on orders above ₹399' }],
        categories: ['Recommended', 'Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages'],
      },
      {
        name: 'Pizza Palace',
        description: 'Wood-fired pizzas, loaded pastas and gourmet burgers. Italian flavours meet Indian spices.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100',
        address: { street: '45 CG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380006' },
        cuisine: ['Italian', 'Pizza', 'Pasta', 'Burgers'],
        rating: 4.5,
        totalRatings: 512,
        deliveryTime: 30,
        priceForTwo: 600,
        owner: owner2._id,
        isOpen: true,
        deliveryFee: 25,
        offers: [
          { title: 'Buy 1 Get 1', description: 'Buy any large pizza and get a medium free on weekends' },
        ],
        categories: ['Recommended', 'Pizza', 'Pasta', 'Burgers', 'Sides', 'Beverages'],
      },
      {
        name: 'Biryani House',
        description: 'Slow-cooked dum biryani in the finest Hyderabadi tradition. Every grain tells a story.',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d45a?w=800',
        logo: 'https://images.unsplash.com/photo-1563379091339-03246963d45a?w=100',
        address: { street: '78 Satellite Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
        cuisine: ['Hyderabadi', 'Biryani', 'Mughlai'],
        rating: 4.6,
        totalRatings: 723,
        deliveryTime: 40,
        priceForTwo: 450,
        owner: owner1._id,
        isOpen: true,
        deliveryFee: 35,
        offers: [{ title: '15% OFF', description: 'First order discount — use FIRST15' }],
        categories: ['Recommended', 'Biryani', 'Curries', 'Kebabs', 'Raita & Sides', 'Beverages'],
      },
      {
        name: 'South Spice',
        description: 'Authentic South Indian fare — crispy dosas, fluffy idlis, piping hot sambhar and filter coffee.',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
        logo: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=100',
        address: { street: '23 Navrangpura', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009' },
        cuisine: ['South Indian', 'Dosa', 'Kerala'],
        rating: 4.2,
        totalRatings: 198,
        deliveryTime: 25,
        priceForTwo: 300,
        owner: owner2._id,
        isOpen: true,
        deliveryFee: 20,
        offers: [{ title: 'Free Dessert', description: 'Free gulab jamun on orders above ₹300' }],
        categories: ['Recommended', 'Dosa', 'Idli & Vada', 'Rice Dishes', 'Beverages'],
      },
      {
        name: 'Dragon Wok',
        description: 'Pan-Asian flavours — authentic Chinese, Thai, and Japanese dishes prepared by expert chefs.',
        image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800',
        logo: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=100',
        address: { street: '9 Ashram Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380013' },
        cuisine: ['Chinese', 'Thai', 'Pan-Asian'],
        rating: 4.1,
        totalRatings: 341,
        deliveryTime: 30,
        priceForTwo: 550,
        owner: owner1._id,
        isOpen: true,
        deliveryFee: 30,
        offers: [{ title: '₹60 OFF', description: 'Get ₹60 off on orders above ₹499 — use DRAGON60' }],
        categories: ['Recommended', 'Starters', 'Noodles & Rice', 'Soups', 'Main Course', 'Desserts'],
      },
      {
        name: 'Gujarati Thali House',
        description: 'Unlimited traditional Gujarati thali with rotis, dal, sabzi, kadhi, rice, farsan and meetha.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
        logo: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=100',
        address: { street: '5 Maninagar Circle', city: 'Ahmedabad', state: 'Gujarat', pincode: '380008' },
        cuisine: ['Gujarati', 'Thali', 'Vegetarian'],
        rating: 4.7,
        totalRatings: 456,
        deliveryTime: 35,
        priceForTwo: 350,
        owner: owner2._id,
        isOpen: true,
        deliveryFee: 25,
        offers: [{ title: '10% OFF', description: 'Loyalty discount — use LOYAL10' }],
        categories: ['Thali', 'Farsan', 'Sweets', 'Beverages'],
      },
      {
        name: 'Burger Junction',
        description: 'Gourmet burgers with custom sauces, crispy fries, and milkshakes. The ultimate comfort food.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
        logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100',
        address: { street: '67 SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054' },
        cuisine: ['Burgers', 'Fast Food', 'American'],
        rating: 4.0,
        totalRatings: 287,
        deliveryTime: 25,
        priceForTwo: 400,
        owner: owner1._id,
        isOpen: true,
        deliveryFee: 25,
        offers: [{ title: 'Combo Deal', description: 'Burger + Fries + Drink for just ₹299' }],
        categories: ['Recommended', 'Burgers', 'Sides', 'Drinks', 'Desserts'],
      },
      {
        name: 'Dessert Paradise',
        description: 'The finest desserts — from Belgian waffles and gelato to traditional Indian mithais and halwa.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
        logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100',
        address: { street: '34 Prahlad Nagar', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
        cuisine: ['Desserts', 'Sweets', 'Bakery'],
        rating: 4.4,
        totalRatings: 189,
        deliveryTime: 20,
        priceForTwo: 300,
        owner: owner2._id,
        isOpen: true,
        deliveryFee: 20,
        offers: [{ title: 'Sweet Deal', description: 'Buy 2 desserts, get 1 free!' }],
        categories: ['Waffles & Crepes', 'Ice Cream', 'Indian Sweets', 'Cakes', 'Beverages'],
      },
      {
        name: 'The Sandwich Co.',
        description: 'Freshly made sandwiches, wraps and rolls using artisan bread and the finest ingredients.',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
        logo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100',
        address: { street: '12 Bopal', city: 'Ahmedabad', state: 'Gujarat', pincode: '380058' },
        cuisine: ['Sandwiches', 'Wraps', 'Healthy'],
        rating: 3.9,
        totalRatings: 134,
        deliveryTime: 20,
        priceForTwo: 350,
        owner: owner1._id,
        isOpen: true,
        deliveryFee: 20,
        offers: [{ title: 'Healthy Combo', description: 'Sandwich + Salad + Juice for ₹249' }],
        categories: ['Sandwiches', 'Wraps & Rolls', 'Salads', 'Juices'],
      },
      {
        name: 'Café Bombay',
        description: 'Mumbai street food vibes — pav bhaji, vada pav, pani puri, bhel and more iconic street eats.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        logo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100',
        address: { street: '89 Law Garden', city: 'Ahmedabad', state: 'Gujarat', pincode: '380006' },
        cuisine: ['Street Food', 'Mumbai', 'Chaat'],
        rating: 4.3,
        totalRatings: 367,
        deliveryTime: 25,
        priceForTwo: 250,
        owner: owner2._id,
        isOpen: true,
        deliveryFee: 15,
        offers: [{ title: 'Street Special', description: '₹30 off on orders above ₹200 — use STREET30' }],
        categories: ['Chaat', 'Pav Dishes', 'Snacks', 'Beverages'],
      },
    ]);

    console.log(`🏪 Created ${restaurants.length} restaurants`);

    // ---- FOOD ITEMS ----
    const foodItems = [
      // Spice Garden (North Indian)
      { restaurant: restaurants[0]._id, name: 'Dal Makhani', description: 'Slow-cooked black lentils with butter and cream, served with warm naan.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', price: 220, category: 'Main Course', isVeg: true, rating: 4.5, tags: ['popular', 'bestseller'] },
      { restaurant: restaurants[0]._id, name: 'Butter Chicken', description: 'Tender chicken in a rich, creamy tomato-based gravy. The Indian classic.', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', price: 280, category: 'Main Course', isVeg: false, rating: 4.7, tags: ['popular', 'non-veg'] },
      { restaurant: restaurants[0]._id, name: 'Paneer Tikka', description: 'Chargrilled cottage cheese marinated in spiced yogurt with bell peppers.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', price: 240, category: 'Starters', isVeg: true, rating: 4.3 },
      { restaurant: restaurants[0]._id, name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken, saffron and fried onions.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d45a?w=400', price: 320, category: 'Main Course', isVeg: false, rating: 4.6, tags: ['bestseller'] },
      { restaurant: restaurants[0]._id, name: 'Garlic Naan', description: 'Soft, fluffy naan slathered with garlic butter, baked in a tandoor oven.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', price: 60, category: 'Breads', isVeg: true, rating: 4.2 },
      { restaurant: restaurants[0]._id, name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-saffron sugar syrup. Served warm.', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', price: 80, category: 'Desserts', isVeg: true, rating: 4.4 },

      // Pizza Palace
      { restaurant: restaurants[1]._id, name: 'Margherita Pizza', description: 'Classic thin-crust pizza with San Marzano tomatoes, fresh mozzarella and basil.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', price: 320, category: 'Pizza', isVeg: true, rating: 4.5, tags: ['bestseller'] },
      { restaurant: restaurants[1]._id, name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, pulled chicken, red onions and mozzarella on a crispy base.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', price: 420, category: 'Pizza', isVeg: false, rating: 4.6, tags: ['popular'] },
      { restaurant: restaurants[1]._id, name: 'Penne Arrabbiata', description: 'Penne pasta in a spicy tomato sauce with garlic and fresh herbs.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d45a?w=400', price: 280, category: 'Pasta', isVeg: true, rating: 4.2 },
      { restaurant: restaurants[1]._id, name: 'Classic Cheeseburger', description: 'Juicy beef patty, cheddar cheese, lettuce, tomato and house sauce in a brioche bun.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', price: 250, category: 'Burgers', isVeg: false, rating: 4.4 },
      { restaurant: restaurants[1]._id, name: 'Garlic Bread', description: 'Toasted baguette with garlic butter and herbs. Perfect starter.', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', price: 120, category: 'Sides', isVeg: true, rating: 4.1 },
      { restaurant: restaurants[1]._id, name: 'Tiramisu', description: 'Classic Italian coffee dessert with mascarpone cream and cocoa.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', price: 180, category: 'Desserts', isVeg: true, rating: 4.5 },

      // Biryani House
      { restaurant: restaurants[2]._id, name: 'Hyderabadi Chicken Biryani', description: 'The OG dum biryani — layered and slow-cooked to perfection. Served with raita.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d45a?w=400', price: 350, category: 'Biryani', isVeg: false, rating: 4.8, tags: ['bestseller', 'must-try'] },
      { restaurant: restaurants[2]._id, name: 'Mutton Biryani', description: 'Tender mutton pieces cooked in aromatic spices with long-grain basmati rice.', image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400', price: 420, category: 'Biryani', isVeg: false, rating: 4.7, tags: ['popular'] },
      { restaurant: restaurants[2]._id, name: 'Veg Biryani', description: 'Mixed vegetables and paneer cooked in saffron-infused basmati. Equally delicious.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', price: 280, category: 'Biryani', isVeg: true, rating: 4.3 },
      { restaurant: restaurants[2]._id, name: 'Chicken Seekh Kebab', description: 'Minced chicken kebabs with aromatic spices, grilled over charcoal.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', price: 260, category: 'Kebabs', isVeg: false, rating: 4.5 },
      { restaurant: restaurants[2]._id, name: 'Raita', description: 'Fresh yogurt mixed with cucumber, tomato and cumin. The perfect biryani companion.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', price: 60, category: 'Raita & Sides', isVeg: true, rating: 4.0 },

      // South Spice
      { restaurant: restaurants[3]._id, name: 'Masala Dosa', description: 'Crispy rice-lentil crepe filled with spiced potato masala. Served with chutneys and sambhar.', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', price: 120, category: 'Dosa', isVeg: true, rating: 4.6, tags: ['bestseller'] },
      { restaurant: restaurants[3]._id, name: 'Idli Sambar', description: 'Steamed rice cakes with piping hot sambhar and coconut chutney.', image: 'https://images.unsplash.com/photo-1630409351217-bc4fa6422d2b?w=400', price: 90, category: 'Idli & Vada', isVeg: true, rating: 4.3 },
      { restaurant: restaurants[3]._id, name: 'Medu Vada', description: 'Crispy doughnut-shaped lentil fritters served with sambhar and chutney.', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', price: 80, category: 'Idli & Vada', isVeg: true, rating: 4.2 },
      { restaurant: restaurants[3]._id, name: 'Curd Rice', description: 'Comforting seasoned yogurt rice with mustard seeds and curry leaves.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', price: 100, category: 'Rice Dishes', isVeg: true, rating: 4.0 },
      { restaurant: restaurants[3]._id, name: 'Filter Coffee', description: 'Traditional South Indian filter coffee — strong, aromatic and frothy.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', price: 50, category: 'Beverages', isVeg: true, rating: 4.7, tags: ['must-try'] },

      // Dragon Wok
      { restaurant: restaurants[4]._id, name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and Indo-Chinese sauces. A comfort classic.', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400', price: 180, category: 'Noodles & Rice', isVeg: true, rating: 4.2, tags: ['popular'] },
      { restaurant: restaurants[4]._id, name: 'Chicken Manchurian', description: 'Crispy chicken balls in a tangy, spicy manchurian sauce. Best with fried rice.', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', price: 240, category: 'Main Course', isVeg: false, rating: 4.4, tags: ['bestseller'] },
      { restaurant: restaurants[4]._id, name: 'Spring Rolls', description: 'Crispy rolls filled with vegetables and noodles. Served with sweet chilli sauce.', image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400', price: 160, category: 'Starters', isVeg: true, rating: 4.1 },
      { restaurant: restaurants[4]._id, name: 'Hot & Sour Soup', description: 'A tangy, spicy soup with vegetables and tofu. Warms you up instantly.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', price: 120, category: 'Soups', isVeg: true, rating: 4.0 },
      { restaurant: restaurants[4]._id, name: 'Fried Rice', description: 'Wok-tossed basmati rice with eggs, vegetables and soy sauce.', image: 'https://images.unsplash.com/photo-1563379091339-03246963d45a?w=400', price: 160, category: 'Noodles & Rice', isVeg: false, rating: 4.3 },

      // Gujarati Thali
      { restaurant: restaurants[5]._id, name: 'Gujarati Thali (Full)', description: 'Unlimited thali with dal, kadhi, 3 sabzis, rice, roti, puri, salad, pickle and meetha.', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', price: 180, category: 'Thali', isVeg: true, rating: 4.8, tags: ['bestseller', 'must-try', 'unlimited'] },
      { restaurant: restaurants[5]._id, name: 'Dhokla', description: 'Soft, spongy steamed gram flour cakes tempered with mustard and sesame.', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', price: 80, category: 'Farsan', isVeg: true, rating: 4.5 },
      { restaurant: restaurants[5]._id, name: 'Khandvi', description: 'Rolled gram flour tubes flavoured with coconut and coriander. A Gujarati gem.', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', price: 90, category: 'Farsan', isVeg: true, rating: 4.3 },
      { restaurant: restaurants[5]._id, name: 'Shrikhand', description: 'Strained yogurt sweetened with sugar and saffron. Chilled dessert delight.', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', price: 70, category: 'Sweets', isVeg: true, rating: 4.4 },

      // Burger Junction
      { restaurant: restaurants[6]._id, name: 'Double Smash Burger', description: 'Two smashed beef patties, American cheese, special sauce and pickles.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', price: 320, category: 'Burgers', isVeg: false, rating: 4.5, tags: ['bestseller'] },
      { restaurant: restaurants[6]._id, name: 'Crispy Veg Burger', description: 'A crispy vegetable patty with lettuce, tomato, cheese and mayo.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', price: 220, category: 'Burgers', isVeg: true, rating: 4.1 },
      { restaurant: restaurants[6]._id, name: 'Loaded Cheese Fries', description: 'Crispy fries smothered in cheddar sauce, jalapeños and caramelized onions.', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', price: 180, category: 'Sides', isVeg: true, rating: 4.3, tags: ['popular'] },
      { restaurant: restaurants[6]._id, name: 'Chocolate Milkshake', description: 'Thick, creamy chocolate milkshake topped with whipped cream. Pure joy.', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', price: 150, category: 'Drinks', isVeg: true, rating: 4.4 },

      // Dessert Paradise
      { restaurant: restaurants[7]._id, name: 'Belgian Waffle', description: 'Golden crispy waffle with strawberries, Nutella and whipped cream.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', price: 220, category: 'Waffles & Crepes', isVeg: true, rating: 4.6, tags: ['bestseller'] },
      { restaurant: restaurants[7]._id, name: 'Gelato (2 Scoops)', description: 'Italian artisan gelato. Choose from 15+ flavours including pistachio and mango.', image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400', price: 160, category: 'Ice Cream', isVeg: true, rating: 4.5 },
      { restaurant: restaurants[7]._id, name: 'Chocolate Brownie', description: 'Warm fudgy brownie with vanilla ice cream and chocolate sauce.', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', price: 180, category: 'Cakes', isVeg: true, rating: 4.7, tags: ['must-try'] },
      { restaurant: restaurants[7]._id, name: 'Jalebi with Rabdi', description: 'Crispy spirals of deep-fried batter soaked in sugar syrup, served with thickened milk.', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', price: 130, category: 'Indian Sweets', isVeg: true, rating: 4.4 },

      // The Sandwich Co.
      { restaurant: restaurants[8]._id, name: 'Club Sandwich', description: 'Triple-decker with chicken, bacon, egg, lettuce, tomato and mayo. A classic.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', price: 220, category: 'Sandwiches', isVeg: false, rating: 4.2, tags: ['popular'] },
      { restaurant: restaurants[8]._id, name: 'Grilled Paneer Wrap', description: 'Chargrilled paneer with mint chutney, onion and peppers in a whole wheat wrap.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', price: 180, category: 'Wraps & Rolls', isVeg: true, rating: 4.0 },
      { restaurant: restaurants[8]._id, name: 'Avocado Toast', description: 'Sourdough toast with smashed avocado, cherry tomatoes and everything bagel seasoning.', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400', price: 160, category: 'Sandwiches', isVeg: true, rating: 3.9 },
      { restaurant: restaurants[8]._id, name: 'Fresh Lime Soda', description: 'Freshly squeezed lime with soda — sweet, salty or masala. Your choice!', image: 'https://images.unsplash.com/photo-1534353473418-4cfa0c1e9a2f?w=400', price: 60, category: 'Juices', isVeg: true, rating: 4.3 },

      // Café Bombay
      { restaurant: restaurants[9]._id, name: 'Pav Bhaji', description: 'Spicy mashed vegetable curry with soft buttered pavs. Mumbai\'s favourite.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', price: 120, category: 'Pav Dishes', isVeg: true, rating: 4.6, tags: ['bestseller', 'must-try'] },
      { restaurant: restaurants[9]._id, name: 'Vada Pav', description: 'The Mumbai burger — spiced potato fritter in a soft bun with chutneys.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', price: 50, category: 'Pav Dishes', isVeg: true, rating: 4.5, tags: ['popular'] },
      { restaurant: restaurants[9]._id, name: 'Pani Puri', description: '6 crispy puris filled with tangy tamarind water, chickpeas and potato.', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', price: 80, category: 'Chaat', isVeg: true, rating: 4.7, tags: ['must-try'] },
      { restaurant: restaurants[9]._id, name: 'Bhel Puri', description: 'Puffed rice tossed with vegetables, tamarind chutney and sev. A light snack.', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', price: 70, category: 'Chaat', isVeg: true, rating: 4.3 },
      { restaurant: restaurants[9]._id, name: 'Sugarcane Juice', description: 'Fresh sugarcane juice with ginger and lemon. Cold and refreshing.', image: 'https://images.unsplash.com/photo-1534353473418-4cfa0c1e9a2f?w=400', price: 50, category: 'Beverages', isVeg: true, rating: 4.4 },
    ];

    await Food.insertMany(foodItems);
    console.log(`🍕 Created ${foodItems.length} food items`);

    // ---- COUPONS ----
    await Coupon.insertMany([
      {
        code: 'WELCOME50',
        description: '₹50 off on your first order',
        discountType: 'flat',
        discountValue: 50,
        minimumOrder: 200,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'SPICE20',
        description: '20% off on Spice Garden orders',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrder: 399,
        maximumDiscount: 100,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'FIRST15',
        description: '15% off on first order',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrder: 300,
        maximumDiscount: 80,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'DRAGON60',
        description: '₹60 off on orders from Dragon Wok',
        discountType: 'flat',
        discountValue: 60,
        minimumOrder: 499,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'LOYAL10',
        description: '10% off for loyal customers',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrder: 150,
        maximumDiscount: 50,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);

    console.log('🎫 Created 5 coupons');
    console.log('\n✅ Database seeded successfully!\n');
    console.log('🔑 Test Credentials:');
    console.log('   Admin:   admin@bitego.com   / admin123');
    console.log('   Owner 1: owner1@bitego.com  / owner123');
    console.log('   Owner 2: owner2@bitego.com  / owner123');
    console.log('   User:    john@example.com   / user123');
    console.log('\n🎫 Test Coupons: WELCOME50 | SPICE20 | FIRST15 | DRAGON60 | LOYAL10\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
