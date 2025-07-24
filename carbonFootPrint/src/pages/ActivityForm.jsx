import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ActivityForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem('email') || '',
    activityType: '',
    transportType: '',
    fuelType: '',
    value: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [instantCalculation, setInstantCalculation] = useState(null);

  // Activity icons
  const activityIcons = {
    electricity: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png',
    transport: 'https://cdn-icons-png.flaticon.com/512/3079/3079165.png',
    food: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
    water: 'https://cdn-icons-png.flaticon.com/512/3437/3437733.png',
    gas: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
    petrol: 'https://cdn-icons-png.flaticon.com/512/3174/3174828.png',
    diesel: 'https://cdn-icons-png.flaticon.com/512/3174/3174828.png',
    kerosene: 'https://cdn-icons-png.flaticon.com/512/3174/3174828.png',
    cng: 'https://cdn-icons-png.flaticon.com/512/3174/3174828.png',
    lng: 'https://cdn-icons-png.flaticon.com/512/3174/3174828.png'
  };

  // Transport types with emission factors (kg CO2 per km)
  const transportTypes = {
    car: { 
      name: 'Car',
      icon: 'https://cdn-icons-png.flaticon.com/512/2253/2253065.png',
      emissionFactor: 0.2
    },
    bus: {
      name: 'Bus',
      icon: 'https://cdn-icons-png.flaticon.com/512/2900/2900652.png',
      emissionFactor: 0.1
    },
    train: {
      name: 'Train',
      icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png',
      emissionFactor: 0.05
    },
    plane: {
      name: 'Plane',
      icon: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png',
      emissionFactor: 0.25
    },
    motorcycle: {
      name: 'Motorcycle',
      icon: 'https://cdn-icons-png.flaticon.com/512/2747/2747261.png',
      emissionFactor: 0.15
    },
    bicycle: {
      name: 'Bicycle',
      icon: 'https://cdn-icons-png.flaticon.com/512/2907/2907639.png',
      emissionFactor: 0
    },
    walking: {
      name: 'Walking',
      icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png',
      emissionFactor: 0
    }
  };

  // Fuel types with emission rates (kg CO2 per unit)
  const fuelEmissionRates = {
    petrol: 2.31,   // kg CO2 per liter
    diesel: 2.68,   // kg CO2 per liter
    kerosene: 2.53, // kg CO2 per liter
    cng: 2.75,      // kg CO2 per kg
    lng: 2.75       // kg CO2 per kg
  };

  const electricityEmissionFactor = 0.5; // kg CO2 per kWh
  const waterEmissionFactor = 0.0003;   // kg CO2 per liter
  const gasEmissionFactor = 1.89;       // kg CO2 per m³

  const activityUnits = {
    electricity: 'kWh',
    transport: 'km',
    food: 'kg',
    water: 'liters',
    gas: 'm³',
    petrol: 'liters',
    diesel: 'liters',
    kerosene: 'liters',
    cng: 'kg',
    lng: 'kg'
  };

  // Calculate carbon footprint in real-time
  useEffect(() => {
    if (formData.value && formData.activityType) {
      calculateFootprint();
    } else {
      setInstantCalculation(null);
    }
  }, [formData.value, formData.activityType, formData.transportType, formData.fuelType]);

  const calculateFootprint = () => {
    let carbonFootprint = 0;
    let unit = activityUnits[formData.activityType];

    switch(formData.activityType) {
      case 'electricity':
        carbonFootprint = parseFloat(formData.value) * electricityEmissionFactor;
        break;
      case 'transport':
        const transportInfo = transportTypes[formData.transportType];
        carbonFootprint = parseFloat(formData.value) * (transportInfo?.emissionFactor || 0);
        break;
      case 'water':
        carbonFootprint = parseFloat(formData.value) * waterEmissionFactor;
        break;
      case 'gas':
        carbonFootprint = parseFloat(formData.value) * gasEmissionFactor;
        break;
      case 'petrol':
      case 'diesel':
      case 'kerosene':
      case 'cng':
      case 'lng':
        carbonFootprint = parseFloat(formData.value) * fuelEmissionRates[formData.activityType];
        break;
      default:
        carbonFootprint = parseFloat(formData.value) * 0.5;
    }

    setInstantCalculation({
      value: formData.value,
      unit: unit,
      carbonFootprint: carbonFootprint.toFixed(2)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'transportType' && { fuelType: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setResult(null);

    try {
      // Validate form data
      if (!formData.email || !formData.activityType || !formData.value) {
        throw new Error('Please fill in all required fields');
      }

      // Special validation for transport
      if (formData.activityType === 'transport' && !formData.transportType) {
        throw new Error('Please select a transport type');
      }

      // Prepare the payload to match CarbonLogDTO
      const payload = {
        email: formData.email,
        activityType: formData.activityType,
        value: parseFloat(formData.value)
      };

      const response = await axios.post('https://carbonfootprinttrackerbackendasd.onrender.com/api/carbon/log', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage('Activity logged successfully!');
      setFormData(prev => ({ 
        ...prev,
        activityType: '', 
        transportType: '',
        fuelType: '',
        value: '' 
      }));
      
      setResult({
        activityType: formData.activityType,
        transportType: formData.transportType,
        fuelType: formData.fuelType,
        value: formData.value,
        carbonFootprint: instantCalculation?.carbonFootprint || '0',
        unit: instantCalculation?.unit || ''
      });
    } catch (error) {
      console.error('Error submitting activity:', error);
      setMessage(error.response?.data?.message || error.message || 'Failed to log activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActivityName = (type) => {
    const names = {
      electricity: 'Electricity Usage',
      transport: 'Transport',
      food: 'Food Consumption',
      water: 'Water Usage',
      gas: 'Gas Consumption',
      petrol: 'Petrol Consumption',
      diesel: 'Diesel Consumption',
      kerosene: 'Kerosene Consumption',
      cng: 'CNG Consumption',
      lng: 'LNG Consumption'
    };
    return names[type] || type;
  };

  const navigateToHistory = () => {
    navigate('/dashboard');
  };

  const showFuelType = formData.activityType === 'transport' && 
                      ['car', 'motorcycle'].includes(formData.transportType);

  return (
    <div style={{
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            color: '#2e7d32', 
            margin: '0',
            fontSize: '1.8rem',
            fontWeight: '600'
          }}>
            Track Your Carbon Footprint
          </h2>
          <p style={{ color: '#616161', marginTop: '0.5rem' }}>
            Help the environment by monitoring your activities
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#424242',
              fontSize: '1rem'
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png" 
                alt="Email" 
                style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
              />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdbdbd',
                backgroundColor: '#f5f5f5',
                fontSize: '1rem'
              }}
              placeholder="Your email address"
            />
          </div>

          {/* Activity Type Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#424242',
              fontSize: '1rem'
            }}>
              <img 
                src={activityIcons[formData.activityType] || 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png'} 
                alt="Activity" 
                style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
              />
              Activity Type
            </label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdbdbd',
                backgroundColor: '#f5f5f5',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/60/60995.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px'
              }}
            >
              <option value="">-- Select Activity --</option>
              <option value="electricity">Electricity Usage (kWh)</option>
              <option value="transport">Transport (km)</option>
              <option value="food">Food Consumption (kg)</option>
              <option value="water">Water Usage (liters)</option>
              <option value="gas">Gas Consumption (m³)</option>
              <option value="petrol">Petrol (liters)</option>
              <option value="diesel">Diesel (liters)</option>
              <option value="kerosene">Kerosene (liters)</option>
              <option value="cng">CNG (kg)</option>
              <option value="lng">LNG (kg)</option>
            </select>
          </div>

          {/* Transport Type Selection - Only shown when activityType is transport */}
          {formData.activityType === 'transport' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#424242',
                fontSize: '1rem'
              }}>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2853/2853307.png" 
                  alt="Transport Type" 
                  style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                />
                Transport Type
              </label>
              <select
                name="transportType"
                value={formData.transportType}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #bdbdbd',
                  backgroundColor: '#f5f5f5',
                  fontSize: '1rem',
                  appearance: 'none',
                  backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/60/60995.png")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="">-- Select Transport Type --</option>
                {Object.entries(transportTypes).map(([key, transport]) => (
                  <option key={key} value={key}>
                    {transport.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fuel Type Selection - Only shown for car and motorcycle */}
          {showFuelType && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#424242',
                fontSize: '1rem'
              }}>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3174/3174828.png" 
                  alt="Fuel Type" 
                  style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                />
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #bdbdbd',
                  backgroundColor: '#f5f5f5',
                  fontSize: '1rem',
                  appearance: 'none',
                  backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/60/60995.png")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="">-- Select Fuel Type --</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="kerosene">Kerosene</option>
                <option value="cng">CNG</option>
                <option value="lng">LNG</option>
              </select>
            </div>
          )}

          {/* Value Input */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#424242',
              fontSize: '1rem'
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3142/3142745.png" 
                alt="Value" 
                style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
              />
              {formData.activityType === 'transport' ? 'Distance Traveled' : 'Consumption Value'}
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              min="0"
              step="any"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #bdbdbd',
                backgroundColor: '#f5f5f5',
                fontSize: '1rem'
              }}
              placeholder={
                formData.activityType === 'transport' ? 'Enter kilometers' : 
                formData.activityType === 'water' ? 'Enter liters' : 
                formData.activityType === 'food' ? 'Enter kilograms' : 
                formData.activityType === 'petrol' ? 'Enter liters' :
                formData.activityType === 'diesel' ? 'Enter liters' :
                formData.activityType === 'kerosene' ? 'Enter liters' :
                formData.activityType === 'cng' ? 'Enter kg' :
                formData.activityType === 'lng' ? 'Enter kg' :
                'Enter value'
              }
            />
          </div>

          {/* Real-time calculation display */}
          {instantCalculation && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '0.75rem',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3094/3094834.png" alt="CO2" style={{ width: '20px', height: '20px' }} />
              <span>Estimated Carbon Footprint: {instantCalculation.carbonFootprint} kg CO₂</span>
            </div>
          )}

          {/* Submit and View History Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2e7d32',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                ':hover': {
                  backgroundColor: '#1b5e20',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? (
                <>
                  <img src="https://cdn-icons-png.flaticon.com/512/1791/1791951.png" alt="Loading" style={{ width: '20px', height: '20px' }} />
                  Submitting...
                </>
              ) : (
                <>
                  <img src="https://cdn-icons-png.flaticon.com/512/411/411712.png" alt="Submit" style={{ width: '20px', height: '20px' }} />
                  Submit Activity
                </>
              )}
            </button>

            <button 
              onClick={navigateToHistory}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1565c0',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                ':hover': {
                  backgroundColor: '#0d47a1',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1570/1570887.png" 
                alt="History" 
                style={{ width: '20px', height: '20px' }} 
              />
              View Full History
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: message.includes('success') ? '#e8f5e9' : '#ffebee',
              borderRadius: '8px',
              borderLeft: `4px solid ${message.includes('success') ? '#2e7d32' : '#c62828'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img 
                src={message.includes('success') ? 
                  'https://cdn-icons-png.flaticon.com/512/7518/7518748.png' : 
                  'https://cdn-icons-png.flaticon.com/512/753/753345.png'} 
                alt={message.includes('success') ? 'Success' : 'Error'} 
                style={{ width: '24px', height: '24px' }}
              />
              <span style={{ 
                color: message.includes('success') ? '#2e7d32' : '#c62828',
                fontWeight: '500'
              }}>
                {message}
              </span>
            </div>
          )}
        </form>

        {/* Result Display */}
        {result && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f1f8e9',
            borderRadius: '10px',
            borderLeft: '5px solid #7cb342',
            animation: 'fadeIn 0.5s ease-in-out'
          }}>
            <h3 style={{
              color: '#33691e',
              marginTop: '0',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img src="https://cdn-icons-png.flaticon.com/512/992/992700.png" alt="Result" style={{ width: '24px', height: '24px' }} />
              Carbon Footprint Result
            </h3>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500', color: '#424242' }}>Activity: </span>
              <span>{getActivityName(result.activityType)}</span>
            </div>
            
            {result.activityType === 'transport' && (
              <>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#424242' }}>Transport Type: </span>
                  <span>{transportTypes[result.transportType]?.name || result.transportType}</span>
                </div>
                {result.fuelType && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500', color: '#424242' }}>Fuel Type: </span>
                    <span>{result.fuelType}</span>
                  </div>
                )}
              </>
            )}
            
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500', color: '#424242' }}>Amount: </span>
              <span>{result.value} {result.unit}</span>
            </div>
            
            <div style={{ 
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3094/3094834.png" alt="CO2" style={{ width: '24px', height: '24px' }} />
              <span>Carbon Footprint: {result.carbonFootprint} kg CO₂</span>
            </div>
            
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fff8e1',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#5d4037',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3524/3524636.png" alt="Tip" style={{ width: '20px', height: '20px' }} />
              <span>
                <strong>Tip:</strong> {getRandomTip(result.activityType)}
              </span>
            </div>
          </div>
        )}

        {/* Eco Icons Footer */}
        <div style={{ 
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <img src="https://cdn-icons-png.flaticon.com/512/484/484613.png" alt="Eco Tips" style={{ width: '40px', height: '40px', opacity: 0.7 }} />
          <img src="https://cdn-icons-png.flaticon.com/512/1598/1598148.png" alt="Leaf" style={{ width: '40px', height: '40px', opacity: 0.7 }} />
          <img src="https://cdn-icons-png.flaticon.com/512/3099/3099492.png" alt="Recycle" style={{ width: '40px', height: '40px', opacity: 0.7 }} />
          <img src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" alt="Earth" style={{ width: '40px', height: '40px', opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
};

// Helper function to provide eco tips based on activity type
const getRandomTip = (activityType) => {
  const tips = {
    electricity: [
      "Switch to LED bulbs to reduce electricity consumption by up to 80%.",
      "Unplug devices when not in use to prevent phantom energy drain.",
      "Use natural light during the day to reduce lighting needs."
    ],
    transport: [
      "Consider carpooling or public transportation to reduce emissions.",
      "Walking or cycling for short trips can significantly lower your carbon footprint.",
      "Regular vehicle maintenance improves fuel efficiency."
    ],
    food: [
      "Reducing meat consumption can significantly lower your carbon footprint.",
      "Buy local and seasonal produce to reduce transportation emissions.",
      "Plan meals to avoid food waste which contributes to methane emissions."
    ],
    water: [
      "Fix leaks promptly - a dripping tap can waste 15 liters of water a day.",
      "Take shorter showers to reduce both water and energy use.",
      "Install water-efficient fixtures to reduce consumption."
    ],
    gas: [  
      "Lower your thermostat by 1°C to reduce gas consumption by up to 10%.",
      "Insulate your home to reduce heating needs.",
      "Use a programmable thermostat to optimize heating schedules."
    ],
    petrol: [
      "Consider switching to more fuel-efficient vehicles or electric alternatives.",
      "Proper tire inflation can improve fuel efficiency by up to 3%.",
      "Avoid aggressive driving to reduce fuel consumption."
    ],
    diesel: [
      "Modern diesel engines are more efficient - consider upgrading if using older models.",
      "Use premium diesel for better engine performance and efficiency.",
      "Regular filter changes maintain optimal fuel efficiency."
    ],
    kerosene: [
      "Consider switching to cleaner heating alternatives if using kerosene for heating.",
      "Ensure proper ventilation when using kerosene appliances.",
      "Regular maintenance of kerosene heaters improves efficiency."
    ],
    cng: [
      "CNG produces fewer emissions than petrol or diesel.",
      "Ensure proper maintenance of CNG conversion kits for safety.",
      "CNG vehicles typically have lower maintenance costs."
    ],
    lng: [
      "LNG is cleaner than traditional marine fuels for shipping.",
      "Proper storage is essential for LNG safety.",
      "LNG infrastructure is expanding globally for cleaner transport."
    ],
    default: [
      "Small changes in daily habits can make a big difference over time.",
      "Consider investing in energy-efficient appliances when replacements are needed.",
      "Educate others about reducing their carbon footprint."
    ]
  };

  const applicableTips = tips[activityType] || tips.default;
  return applicableTips[Math.floor(Math.random() * applicableTips.length)];
};

export default ActivityForm;
