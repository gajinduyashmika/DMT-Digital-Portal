const express = require('express');
const router = express.Router();
const VehicleMake = require('../models/VehicleMake');

// Get all makes
router.get('/makes', async (req, res) => {
  try {
    const makes = await VehicleMake.find({}, 'make').sort({ make: 1 });
    res.json(makes.map(m => m.make));
  } catch (error) {
    console.error('Error fetching makes:', error);
    res.status(500).json({ message: 'Error fetching vehicle makes' });
  }
});

// Get models for a specific make
router.get('/models/:make', async (req, res) => {
  try {
    const { make } = req.params;
    const vehicleMake = await VehicleMake.findOne({ make });
    if (!vehicleMake) {
      return res.status(404).json({ message: 'Make not found' });
    }
    res.json(vehicleMake.models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: 'Error fetching vehicle models' });
  }
});

// Seed data with Sri Lankan vehicle makes and models
router.post('/seed', async (req, res) => {
  try {
    // Check if already seeded
    const count = await VehicleMake.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Database already seeded' });
    }

    const sriLankanVehicles = [
      {
        make: 'Toyota',
        models: ['Corolla', 'Vitz', 'Aqua', 'Allion', 'Fielder', 'Mark X', 'Prius', 'Hiace', 'Land Cruiser', 'Fortuner', 'Innova', 'Yaris', 'Camry', 'Alphard', 'Sienna']
      },
      {
        make: 'Honda',
        models: ['City', 'Civic', 'CR-V', 'Accord', 'Odyssey', 'Jazz', 'Fit', 'BR-V', 'Pilot', 'HR-V', 'Freed']
      },
      {
        make: 'Suzuki',
        models: ['Swift', 'Alto', 'WagonR', 'Vitara', 'Jimny', 'Celerio', 'Dzire', 'Ertiga', 'SX4', 'Baleno', 'Margalla']
      },
      {
        make: 'Hyundai',
        models: ['i10', 'i20', 'Accent', 'Elantra', 'Santa Fe', 'Tucson', 'Creta', 'Grand i10', 'Xcent', 'Venue', 'Kona']
      },
      {
        make: 'Daihatsu',
        models: ['Mira', 'Boon', 'Terios', 'Ceria', 'Hijet', 'Charade', 'Custodian', 'Esse']
      },
      {
        make: 'Nissan',
        models: ['March', 'Sunny', 'Almera', 'Teana', 'X-Trail', 'Qashqai', 'Serena', 'Patrol']
      },
      {
        make: 'Mitsubishi',
        models: ['Lancer', 'Cedia', 'Outlander', 'Pajero', 'Triton', 'Mirage', 'Attrage', 'ASX']
      },
      {
        make: 'Ford',
        models: ['Fiesta', 'Focus', 'Fusion', 'Endeavour', 'Ranger', 'Escape', 'EcoSport', 'Aspire']
      },
      {
        make: 'Chevrolet',
        models: ['Spark', 'Beat', 'Enjoy', 'Cruze', 'Optra', 'Captiva', 'Tavera']
      },
      {
        make: 'Maruti',
        models: ['Alto', 'Swift', 'WagonR', 'Vitara Brezza', 'Ertiga', 'Dzire', 'Ciaz', 'S-Cross', 'Baleno']
      },
      {
        make: 'Mahindra',
        models: ['XUV500', 'Bolero', 'Scorpio', 'Xylo', 'TUV300', 'KUV100', 'Thar']
      },
      {
        make: 'Skoda',
        models: ['Octavia', 'Fabia', 'Superb', 'Yeti', 'Rapid', 'Kodiaq', 'Kamiq']
      },
      {
        make: 'Volkswagen',
        models: ['Polo', 'Vento', 'Jetta', 'Passat', 'Touareg', 'Tiguan', 'Golf']
      },
      {
        make: 'BMW',
        models: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', '1 Series', 'M Series']
      },
      {
        make: 'Mercedes',
        models: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS']
      },
      {
        make: 'Audi',
        models: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'TT']
      },
      {
        make: 'Lexus',
        models: ['LX', 'RX', 'NX', 'ES', 'IS', 'GS', 'LS']
      },
      {
        make: 'Tata',
        models: ['Nexon', 'Harrier', 'Safari', 'Altroz', 'Tigor', 'Hexa', 'Nano', 'Indica']
      },
      {
        make: 'Kia',
        models: ['Seltos', 'Sonet', 'Carens', 'Sportage', 'EV6', 'Niro', 'Optima']
      },
      {
        make: 'MG',
        models: ['Hector', 'ZS EV', 'ZS', 'Gloster', 'Astor', 'Comet']
      },
      {
        make: 'Renault',
        models: ['Kwid', 'Duster', 'Lodgy', 'Captur', 'Fluence']
      },
      {
        make: 'Jeep',
        models: ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee', 'Liberty']
      },
      {
        make: 'Bajaj',
        models: ['Pulsar', 'Avenger', 'Dominar', 'Ninja', 'RE60', 'CT100']
      },
      {
        make: 'Hero',
        models: ['Splendor', 'Passion', 'HF Deluxe', 'Glamour', 'Super Splendor', 'Xtreme', 'Karizma']
      },
      {
        make: 'TVS',
        models: ['Apache', 'Star City', 'Scooty', 'Jupiter', 'Wego', 'Raider']
      },
      {
        make: 'Royal Enfield',
        models: ['Classic', 'Bullet', 'Electra', 'Thunderbird', 'Continental GT', 'Himalayan']
      },
      {
        make: 'Harley-Davidson',
        models: ['Street 750', 'Street 500', 'Iron 1200', 'Sportster', 'Softail', 'Road King']
      },
      {
        make: 'Yamaha',
        models: ['YZF-R15', 'FZ', 'MT-15', 'Ray Z', 'Alpha', 'Fascino', 'SZ-RR']
      },
      {
        make: 'Piaggio',
        models: ['Vespa', 'Aprilia', 'Derbi']
      },
      {
        make: 'Isuzu',
        models: ['MU-X', 'D-Max', 'Trooper', 'FRR', 'NPR']
      }
    ];

    await VehicleMake.insertMany(sriLankanVehicles);
    res.json({ message: 'Database seeded with Sri Lankan vehicle makes and models', count: sriLankanVehicles.length });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});

module.exports = router;
