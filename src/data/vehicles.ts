import { Vehicle } from '../types';

export const vehicles: Vehicle[] = [
  {
    id: 1,
    name: 'Adder',
    price: 1000000,
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Truffade',
    category: 'Super',
    specs: {
      topSpeed: 220,
      acceleration: 2.8,
      braking: 9,
      handling: 8
    },
    description: 'The Truffade Adder is a luxury hypercar featured in GTA V, based on the Bugatti Veyron Super Sport. Known for its incredible top speed and sleek design.'
  },
  {
    id: 2,
    name: 'Zentorno',
    price: 725000,
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Pegassi',
    category: 'Super',
    specs: {
      topSpeed: 210,
      acceleration: 2.5,
      braking: 8,
      handling: 9
    },
    description: 'The Pegassi Zentorno is a high-performance supercar featuring an aggressive, angular design inspired by the Lamborghini Sesto Elemento and Veneno.'
  },
  {
    id: 3,
    name: 'Sultan RS',
    price: 350000,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Karin',
    category: 'Sports',
    specs: {
      topSpeed: 185,
      acceleration: 3.2,
      braking: 7,
      handling: 8
    },
    description: 'The Karin Sultan RS is a highly customizable sports car with rally racing heritage, offering excellent handling and a strong community following.'
  },
  {
    id: 4,
    name: 'Insurgent',
    price: 650000,
    image: 'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'HVY',
    category: 'Off-road',
    specs: {
      topSpeed: 150,
      acceleration: 4.5,
      braking: 6,
      handling: 5
    },
    description: 'The HVY Insurgent is a heavily armored SUV designed for off-road pursuits and urban warfare, featuring exceptional durability and intimidating presence.'
  },
  {
    id: 5,
    name: 'Comet',
    price: 550000,
    image: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Pfister',
    category: 'Sports',
    specs: {
      topSpeed: 190,
      acceleration: 3.0,
      braking: 7,
      handling: 8
    },
    description: 'The Pfister Comet is a high-performance sports car based on the Porsche 911, known for its balanced handling and iconic silhouette.'
  },
  {
    id: 6,
    name: 'Banshee',
    price: 565000,
    image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Bravado',
    category: 'Sports',
    specs: {
      topSpeed: 195,
      acceleration: 2.9,
      braking: 8,
      handling: 7
    },
    description: 'The Bravado Banshee is a classic American sports car inspired by the Dodge Viper, featuring aggressive styling and powerful rear-wheel drive performance.'
  },
  {
    id: 7,
    name: 'Dominator',
    price: 350000,
    image: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Vapid',
    category: 'Muscle',
    specs: {
      topSpeed: 175,
      acceleration: 3.5,
      braking: 6,
      handling: 6
    },
    description: 'The Vapid Dominator is a modern American muscle car based on the Ford Mustang, delivering raw power and a distinctive engine note.'
  },
  {
    id: 8,
    name: 'Oracle',
    price: 250000,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    brand: 'Übermacht',
    category: 'Sedan',
    specs: {
      topSpeed: 160,
      acceleration: 4.2,
      braking: 5,
      handling: 7
    },
    description: 'The Übermacht Oracle is a luxury sedan inspired by BMW designs, offering a comfortable ride with respectable performance and understated elegance.'
  }
];