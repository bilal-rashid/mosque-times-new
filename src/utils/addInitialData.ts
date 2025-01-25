import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface MosqueTimings {
  fajar: string;
  zohr: string;
  asar: string;
  magrib: string;
  isha: string;
}

interface Mosque {
  name: string;
  location: string;
  city: string;
  timings: MosqueTimings;
}

const initialMosques: Mosque[] = [
  {
    name: "Masjid Al-Noor",
    location: "123 Islamic Ave",
    city: "Islamabad",
    timings: {
      fajar: "5:30 AM",
      zohr: "1:30 PM",
      asar: "4:45 PM",
      magrib: "6:15 PM",
      isha: "7:45 PM"
    }
  },
  {
    name: "Central Mosque",
    location: "456 Main Street",
    city: "Rawalpindi",
    timings: {
      fajar: "5:15 AM",
      zohr: "1:15 PM",
      asar: "4:30 PM",
      magrib: "6:00 PM",
      isha: "7:30 PM"
    }
  },
  {
    name: "Islamic Center Mosque",
    location: "789 Community Road",
    city: "Lahore",
    timings: {
      fajar: "5:45 AM",
      zohr: "1:45 PM",
      asar: "5:00 PM",
      magrib: "6:30 PM",
      isha: "8:00 PM"
    }
  },
  {
    name: "Masjid Al-Rahman",
    location: "321 Peace Street",
    city: "Karachi",
    timings: {
      fajar: "5:00 AM",
      zohr: "1:00 PM",
      asar: "4:15 PM",
      magrib: "5:45 PM",
      isha: "7:15 PM"
    }
  },
  {
    name: "Al-Falah Mosque",
    location: "159 Guidance Lane",
    city: "Peshawar",
    timings: {
      fajar: "5:20 AM",
      zohr: "1:20 PM",
      asar: "4:35 PM",
      magrib: "6:05 PM",
      isha: "7:35 PM"
    }
  },
  {
    name: "Masjid Al-Quba",
    location: "753 Blessing Road",
    city: "Multan",
    timings: {
      fajar: "5:10 AM",
      zohr: "1:25 PM",
      asar: "4:40 PM",
      magrib: "6:10 PM",
      isha: "7:40 PM"
    }
  },
  {
    name: "Al-Huda Mosque",
    location: "852 Faith Avenue",
    city: "Faisalabad",
    timings: {
      fajar: "5:25 AM",
      zohr: "1:35 PM",
      asar: "4:50 PM",
      magrib: "6:20 PM",
      isha: "7:50 PM"
    }
  },
  {
    name: "Masjid Al-Aqsa",
    location: "951 Harmony Street",
    city: "Quetta",
    timings: {
      fajar: "5:35 AM",
      zohr: "1:40 PM",
      asar: "4:55 PM",
      magrib: "6:25 PM",
      isha: "7:55 PM"
    }
  },
  {
    name: "Al-Barakah Mosque",
    location: "357 Serenity Road",
    city: "Sialkot",
    timings: {
      fajar: "5:05 AM",
      zohr: "1:10 PM",
      asar: "4:25 PM",
      magrib: "5:55 PM",
      isha: "7:25 PM"
    }
  },
  {
    name: "Masjid Al-Furqan",
    location: "486 Wisdom Lane",
    city: "Gujranwala",
    timings: {
      fajar: "5:40 AM",
      zohr: "1:50 PM",
      asar: "5:05 PM",
      magrib: "6:35 PM",
      isha: "8:05 PM"
    }
  },
  {
    name: "Al-Hidayah Mosque",
    location: "264 Light Street",
    city: "Sargodha",
    timings: {
      fajar: "5:15 AM",
      zohr: "1:20 PM",
      asar: "4:35 PM",
      magrib: "6:05 PM",
      isha: "7:35 PM"
    }
  },
  {
    name: "Masjid Al-Taqwa",
    location: "375 Peace Road",
    city: "Bahawalpur",
    timings: {
      fajar: "5:30 AM",
      zohr: "1:35 PM",
      asar: "4:50 PM",
      magrib: "6:20 PM",
      isha: "7:50 PM"
    }
  },
  {
    name: "Al-Raheem Mosque",
    location: "159 Mercy Avenue",
    city: "Hyderabad",
    timings: {
      fajar: "5:20 AM",
      zohr: "1:25 PM",
      asar: "4:40 PM",
      magrib: "6:10 PM",
      isha: "7:40 PM"
    }
  },
  {
    name: "Masjid Al-Salam",
    location: "753 Tranquility Road",
    city: "Abbottabad",
    timings: {
      fajar: "5:25 AM",
      zohr: "1:30 PM",
      asar: "4:45 PM",
      magrib: "6:15 PM",
      isha: "7:45 PM"
    }
  },
  {
    name: "Al-Jannah Mosque",
    location: "951 Paradise Lane",
    city: "Mirpur",
    timings: {
      fajar: "5:35 AM",
      zohr: "1:40 PM",
      asar: "4:55 PM",
      magrib: "6:25 PM",
      isha: "7:55 PM"
    }
  },
  {
    name: "Masjid Al-Ihsan",
    location: "357 Kindness Street",
    city: "Sukkur",
    timings: {
      fajar: "5:10 AM",
      zohr: "1:15 PM",
      asar: "4:30 PM",
      magrib: "6:00 PM",
      isha: "7:30 PM"
    }
  },
  {
    name: "Al-Kareem Mosque",
    location: "486 Generosity Road",
    city: "Mardan",
    timings: {
      fajar: "5:40 AM",
      zohr: "1:45 PM",
      asar: "5:00 PM",
      magrib: "6:30 PM",
      isha: "8:00 PM"
    }
  },
  {
    name: "Masjid Al-Muhajirin",
    location: "264 Unity Avenue",
    city: "Larkana",
    timings: {
      fajar: "5:15 AM",
      zohr: "1:20 PM",
      asar: "4:35 PM",
      magrib: "6:05 PM",
      isha: "7:35 PM"
    }
  },
  {
    name: "Al-Mustafa Mosque",
    location: "375 Guidance Street",
    city: "Gujrat",
    timings: {
      fajar: "5:30 AM",
      zohr: "1:35 PM",
      asar: "4:50 PM",
      magrib: "6:20 PM",
      isha: "7:50 PM"
    }
  },
  {
    name: "Masjid Al-Tawheed",
    location: "159 Faith Road",
    city: "Sahiwal",
    timings: {
      fajar: "5:20",
      zohr: "1:25",
      asar: "4:40",
      magrib: "6:10",
      isha: "19:40"
    }
  }
];

export const addInitialMosques = async () => {
  try {
    const mosqueCollection = collection(db, 'mosques');
    
    for (const mosque of initialMosques) {
      await addDoc(mosqueCollection, mosque);
      console.log(`Added mosque: ${mosque.name} in ${mosque.city}`);
    }
    
    console.log('Successfully added all initial mosques');
  } catch (error) {
    console.error('Error adding initial mosques:', error);
  }
};
