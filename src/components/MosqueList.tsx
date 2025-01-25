import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import '../styles/MosqueList.css';

interface MosqueTimings {
  fajar: string;
  zohr: string;
  asar: string;
  magrib: string;
  isha: string;
}

interface Mosque {
  id: string;
  name: string;
  location: string;
  city: string;
  timings: MosqueTimings;
}

const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const MosqueList = () => {
  const navigate = useNavigate();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'mosques'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mosquesData: Mosque[] = [];
      const cities = new Set<string>();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Mosque, 'id'>;
        const mosque = {
          id: doc.id,
          ...data
        };
        mosquesData.push(mosque);
        cities.add(mosque.city);
      });
      
      setMosques(mosquesData);
      setAvailableCities(Array.from(cities).sort());
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMosques = mosques.filter((mosque) => {
    const matchesSearch = 
      mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = !selectedCity || mosque.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  return (
    <div className="mosque-list-container">
      <div className="mosque-list-header">
        <h1>Mosques</h1>
        <button className="add-mosque-button" onClick={() => navigate('/add-mosque')}>
          Add New Mosque
        </button>
      </div>

      <div className="filters-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search mosques, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="city-filter">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="city-select"
          >
            <option value="">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-count">
        Showing {filteredMosques.length} of {mosques.length} mosques
        {selectedCity && <span className="filter-tag">in {selectedCity}</span>}
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading mosques...</p>
        </div>
      ) : (
        <div className="mosque-grid">
          {filteredMosques.map((mosque) => (
            <Link 
              to={`/mosque/${mosque.id}`} 
              key={mosque.id} 
              className="mosque-card"
            >
              <div className="mosque-header">
                <h3>{mosque.name}</h3>
                <p className="mosque-location">
                  {mosque.location}, {mosque.city}
                </p>
              </div>
              <div className="prayer-times">
                <div className="prayer-time">
                  <span className="prayer-label">Fajr</span>
                  <span className="prayer-value">{convertTo12Hour(mosque.timings.fajar)}</span>
                </div>
                <div className="prayer-time">
                  <span className="prayer-label">Zuhr</span>
                  <span className="prayer-value">{convertTo12Hour(mosque.timings.zohr)}</span>
                </div>
                <div className="prayer-time">
                  <span className="prayer-label">Asr</span>
                  <span className="prayer-value">{convertTo12Hour(mosque.timings.asar)}</span>
                </div>
                <div className="prayer-time">
                  <span className="prayer-label">Maghrib</span>
                  <span className="prayer-value">{convertTo12Hour(mosque.timings.magrib)}</span>
                </div>
                <div className="prayer-time">
                  <span className="prayer-label">Isha</span>
                  <span className="prayer-value">{convertTo12Hour(mosque.timings.isha)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MosqueList;
