import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ServiceSelect = ({ selectedServices, onServiceChange }) => {
    const [services, setServices] = useState([]);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        axios.get("https://mrbikedoctors.com/api/bikedoctor/service/servicelist", {
            headers: { 'token': adminToken }
        })
        
        .then(response => {
            if (response.data.status === 200) {
                setServices(response.data.data);
            }
        })
        .catch(error => console.error("Error fetching services:", error));
    }, []);

    const handleServiceChange = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            onServiceChange(selectedServices.filter(id => id !== serviceId));
        } else {
            onServiceChange([...selectedServices, serviceId]);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ marginRight: '5px', display: 'flex', alignItems: 'center'}}>Services:</label>
                <button 
    onClick={(e) => {
        e.preventDefault(); // Prevent scrolling to top
        setIsOpen(!isOpen);
    }} 
    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center',marginTop:"-5px"  }}
>
    {isOpen ? <FaChevronUp style={{ marginLeft: '5px' }} /> : <FaChevronDown style={{ marginLeft: '5px' }} />}
</button>

            </div>
            {isOpen && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
               {services.map(service => (
                   <div key={service._id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                       <input
                           type="checkbox"
                           id={service._id}
                           checked={selectedServices.includes(service._id)}
                           onChange={() => handleServiceChange(service._id)}
                           style={{ width: '16px', cursor: 'pointer' }}
                       />
                       <label htmlFor={service._id} style={{ cursor: 'pointer',margin:"2px 0 4px 0" }} >{service.name}</label>
                   </div>
               ))}
           </div>
           
            )}
        </div>
    );
};

export default ServiceSelect;
