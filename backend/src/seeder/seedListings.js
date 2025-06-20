const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('../models/listingSchema');
const User = require('../models/userSchema');
const dbConnection = require('../config/dbConnection');

dotenv.config();

// Connect to MongoDB
dbConnection()

const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 
    'Townhouse', 'Condo', 'Bungalow', 'Loft', 'Farm'
];

const amenities = [
    'WiFi', 'Air conditioning', 'Kitchen', 'Heating', 'Washer',
    'Dryer', 'Free parking', 'Pool', 'Hot tub', 'TV',
    'Indoor fireplace', 'Gym', 'BBQ grill', 'Breakfast included',
    'Pets allowed', 'Smoking allowed', 'Beachfront', 'Waterfront',
    'Ski-in/Ski-out', 'EV charger'
];

// Sample cities with coordinates
const locations = [
    {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        coordinates: [72.8777, 19.0760]
    },
    {
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        coordinates: [77.1025, 28.7041]
    },
    {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        coordinates: [77.5946, 12.9716]
    },
    {
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        coordinates: [78.4867, 17.3850]
    },
    {
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        coordinates: [80.2707, 13.0827]
    },
    {
        city: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        coordinates: [88.3639, 22.5726]
    },
    {
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        coordinates: [73.8567, 18.5204]
    },
    {
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        coordinates: [75.7873, 26.9124]
    },
    {
        city: 'Goa',
        state: 'Goa',
        country: 'India',
        coordinates: [74.1240, 15.2993]
    },
    {
        city: 'Kochi',
        state: 'Kerala',
        country: 'India',
        coordinates: [76.2673, 9.9312]
    }
];

// Sample image URLs
const sampleImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'https://images.unsplash.com/photo-1574643156929-51fa098b0394',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
];

// Function to get random items from an array
const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to get a random number between min and max
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to seed listings
const seedListings = async () => {
  try {
    // First, find a host user (or create one if needed)
    let hostUser = await User.findOne({ role: 'host' });
    
    if (!hostUser) {
      console.log('No host user found, creating one...');
      hostUser = new User({
        name: 'Sample Host',
        email: 'host@example.com',
        password: '$2a$10$X/gV2P1wUHHVfwLHlEspY.S5hW0TyPXpxG2uYJhQMmMGAwtXWWSHy', // 'password123'
        role: 'host',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await hostUser.save();
      console.log('Created sample host user');
    }
    
    // Delete existing listings to avoid duplicates
    await Listing.deleteMany({});
    console.log('Cleared existing listings');

    // Create 20 listings
    const listingsToInsert = [];
    
    for (let i = 0; i < 20; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const numImages = getRandomNumber(3, 5);
      const numAmenities = getRandomNumber(4, 8);
      
      listingsToInsert.push({
        hostId: hostUser._id,
        title: `${propertyTypes[i % propertyTypes.length]} in ${location.city}`,
        description: `Beautiful ${propertyTypes[i % propertyTypes.length].toLowerCase()} in the heart of ${location.city}. Perfect for your next vacation! Enjoy the local attractions and comfortable accommodations.`,
        location: {
          address: `${100 + i} Main Street`,
          city: location.city,
          state: location.state || '',
          country: location.country,
          coordinates: location.coordinates
        },
        price: getRandomNumber(500, 2000),
        images: getRandomItems(sampleImages, numImages),
        amenities: getRandomItems(amenities, numAmenities),
        maxGuests: getRandomNumber(2, 10),
        bedrooms: getRandomNumber(1, 5),
        bathrooms: getRandomNumber(1, 4),
        propertyType: propertyTypes[i % propertyTypes.length],
        availability: Math.random() > 0.2, // 80% chance of being available
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await Listing.insertMany(listingsToInsert);
    console.log(`Successfully seeded ${listingsToInsert.length} listings`);
    
    // Close the connection
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error seeding listings:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeding
seedListings();