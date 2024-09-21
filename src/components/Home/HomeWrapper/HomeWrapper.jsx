import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HeaderBar from '../HomeHeader/HomeHeader';
import FooterBar from '../Homefooter/Homefooter';

// Import your images
import applianceImage from './images/appliance.png';
import cleaning from './images/cleaning.jpg';
import installation from './images/installation.webp';
import laptop from './images/laptop.jpg';
import quickrepair from './images/quick repair.webp';
import salon from './images/salon.jpg';
import frontpic from './images/frontpic.png';

function HomeWrapper() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://doorsteppro.shop/services/latest-categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const response = await axios.get('https://doorsteppro.shop/services/all-categories/');
        setAllCategories(response.data);
      } catch (error) {
        console.error('Error fetching all categories:', error);
      }
    };

    fetchCategories();
    fetchAllCategories();
  }, []);

  const handleDropdownClick = (categoryId) => {
    if (categoryId) {
      navigate(`/customer/category/${categoryId}`);
    }
  };

  return (
    <div className="home-wrapper">
      <HeaderBar />

      <section className="home-delivered-services">
        <h2>Home Delivered Services</h2>
      </section>

      <div className="main-content">
        <div className="services-grid">
          <IconWithTitle icon={applianceImage} title="Home Appliance Repair" />
          <IconWithTitle icon={cleaning} title="Home Shine-Up" />
          <IconWithTitle icon={installation} title="Appliance Installation" />
          <IconWithTitle icon={laptop} title="Laptop Service" />
          <IconWithTitle icon={quickrepair} title="Quick Repair" />
          <IconWithTitle icon={salon} title="Salon at Home" />
        </div>

        <div className="front-image">
          <img src={frontpic} alt="Front Image" />
        </div>
      </div>

      <div className="categories-container">
        {categories.length > 0 ? categories.map((category) => (
          category.id && category.latest_services ? (
            <div key={category.id} className="category-box">
              <h4>{category.name}</h4>
              <div className="services-container">
                {category.latest_services.length > 0 ? category.latest_services.slice(0, 5).map(service => (
                  service.id && (
                    <div key={service.id} className="service-box">
                      {service.image && (
                        <Link to={`/customer/services/${service.id}`}>
                          <img src={service.image} alt={service.name} />
                        </Link>
                      )}
                      <h5>{service.name}</h5>
                    </div>
                  )
                )) : <p>No services available</p>}
              </div>
            </div>
          ) : null
        )) : <p>No categories available</p>}
      </div>

      <button onClick={() => setShowDropdown(!showDropdown)} className="explore-button">
        {showDropdown ? 'Show Less' : 'Explore More Services'}
      </button>

      {showDropdown && (
        <div className="all-categories">
          <h4>All Categories</h4>
          <ul>
            {allCategories.map(category => (
              category.id && (
                <li key={category.id}>
                  <button onClick={() => handleDropdownClick(category.id)}>
                    {category.name}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      <FooterBar />

      <style jsx>{`
        .home-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .home-delivered-services {
          background-color: #f0f0f0;
          padding: 20px;
          text-align: center;
        }

        .main-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
          gap: 20px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          background-color: lightgray;
          padding: 20px;
          border-radius: 10px;
          max-width: 500px;
          width: 100%;
        }

        .front-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .front-image img {
          width: 100%;
          max-width: 600px;
          height: auto;
          border-radius: 10px;
        }

        .categories-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        .category-box {
          width: 100%;
          max-width: 1100px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f2f2f2;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          margin: 20px 0;
        }

        .services-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .service-box {
          width: 200px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff;
          text-align: center;
        }

        .service-box img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 8px;
        }

        .explore-button {
          margin: 20px 0;
          padding: 5px 10px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid #007BFF;
          border-radius: 4px;
          background-color: #fff;
          color: #007BFF;
        }

        .all-categories {
          width: 100%;
          max-width: 1000px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f2f2f2;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          margin: 0 auto;
        }

        .all-categories ul {
          list-style: none;
          padding: 0;
        }

        .all-categories li {
          margin: 10px 0;
        }

        .all-categories button {
          background: none;
          border: none;
          color: #007BFF;
          font-size: 16px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .main-content {
            flex-direction: column;
          }

          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 100%;
          }

          .front-image {
            width: 100%;
          }

          .category-box {
            max-width: 100%;
          }

          .service-box {
            width: calc(50% - 10px);
          }
        }

        @media (max-width: 480px) {
          .services-grid {
            grid-template-columns: repeat(1, 1fr);
          }

          .service-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// Component for rendering an icon with title
const IconWithTitle = ({ icon, title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <img src={icon} alt={title} style={{ width: '60px', height: '60px', marginBottom: '10px', objectFit: 'contain' }} />
    <span style={{ fontSize: '14px' }}>{title}</span>
  </div>
);

export default HomeWrapper;