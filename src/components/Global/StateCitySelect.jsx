
// const STATE_CITY_DATA = {
//     "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
//     "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
//     "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
//     "Bihar": ["Patna", "Gaya", "Bhagalpur"],
//     "Chhattisgarh": ["Raipur", "Bilaspur", "Durg"],
//     "Goa": ["Panaji", "Margao", "Mapusa"],
//     "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//     "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
//     "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
//     "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
//     "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
//     "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
//     "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
//     "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
//     "Manipur": ["Imphal"],
//     "Meghalaya": ["Shillong"],
//     "Mizoram": ["Aizawl"],
//     "Nagaland": ["Kohima", "Dimapur"],
//     "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
//     "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
//     "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
//     "Sikkim": ["Gangtok"],
//     "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
//     "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
//     "Tripura": ["Agartala"],
//     "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
//     "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
//     "West Bengal": ["Kolkata", "Asansol", "Siliguri"],
//     "Andaman and Nicobar Islands": ["Port Blair"],
//     "Chandigarh": ["Chandigarh"],
//     "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
//     "Delhi": ["New Delhi", "Dwarka", "Rohini"],
//     "Jammu and Kashmir": ["Srinagar", "Jammu"],
//     "Ladakh": ["Leh", "Kargil"],
//     "Lakshadweep": ["Kavaratti"],
//     "Puducherry": ["Puducherry", "Karaikal"]
// };

import React, { useState, useEffect } from "react";

const STATE_CITY_DATA = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
        "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Durg"],
    "Goa": ["Panaji", "Margao", "Mapusa"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Manipur": ["Imphal"],
    "Meghalaya": ["Shillong"],
    "Mizoram": ["Aizawl"],
    "Nagaland": ["Kohima", "Dimapur"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
    "Sikkim": ["Gangtok"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Tripura": ["Agartala"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
    "West Bengal": ["Kolkata", "Asansol", "Siliguri"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini"],
    "Jammu and Kashmir": ["Srinagar", "Jammu"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Puducherry", "Karaikal"]
};

const StateCitySelect = ({
  value,
  onChange,
  stateName,
  cityName,
  errors = {},
  disabled = false
}) => {
  const selectedState = value?.[stateName] || "";
  const selectedCity = value?.[cityName] || "";
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (selectedState) {
      setCities(STATE_CITY_DATA[selectedState] || []);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleStateChange = (e) => {
    onChange({
      target: {
        name: stateName,
        value: e.target.value
      }
    });
    
    onChange({
      target: {
        name: cityName,
        value: ""
      }
    });
  };

  const handleCityChange = (e) => {
    onChange({
      target: {
        name: cityName,
        value: e.target.value
      }
    });
  };

  return (
    <div className="d-flex justify-content-around">
      {/* State Dropdown */}
      <div className="input-block col-md-6 mb-3 flex-fill">
        <label className="form-control-label" htmlFor={`${stateName}_select`}>
          {stateName.includes('permanent') ? 'Permanent State' : 'Present State'}
        </label>
        <select
          className={`form-control ${errors[stateName] ? 'is-invalid' : ''}`}
          name={stateName}
          value={selectedState}
          onChange={handleStateChange}
          required
          disabled={disabled}
        >
          <option value="">Select State</option>
          {Object.keys(STATE_CITY_DATA).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors[stateName] && <div className="invalid-feedback">{errors[stateName]}</div>}
      </div>

      {/* City Dropdown */}
      <div className="input-block col-md-6 mb-3 flex-fill">
        <label className="form-control-label ml-3" htmlFor={`${cityName}_select`}>
          {cityName.includes('permanent') ? 'Permanent City' : 'Present City'}
        </label>
        <select
          className={`form-control ${errors[cityName] ? 'is-invalid' : ''}`}
          name={cityName}
          value={selectedCity}
          onChange={handleCityChange}
          required
          disabled={!selectedState || disabled}
        >
          <option value="" disabled>
            {selectedState ? "Select City" : "Select a State First"}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors[cityName] && <div className="invalid-feedback">{errors[cityName]}</div>}
      </div>
    </div>
  );
};

export default StateCitySelect;