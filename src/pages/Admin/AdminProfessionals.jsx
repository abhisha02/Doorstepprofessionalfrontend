import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import avatar from './avatar.jpeg'; // Default fallback image

function AdminProfessionals() {
  const baseURL = 'https://doorsteppro.shop';
  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch professionals data
  const fetchProfessionals = (url) => {
    axios
      .get(url)
      .then((response) => {
        console.log("Fetched professionals data:", response.data);
        setProfessionals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching professionals:", error);
        setProfessionals([]);
      });
  };

  // Fetch categories data
  const fetchCategories = () => {
    axios
      .get(`${baseURL}/services/categories/`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Get category name by ID
  const getCategoryNameById = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "N/A";
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchProfessionals(`${baseURL}/aadmin/professionals/?search=${query}`);
  };

  useEffect(() => {
    fetchProfessionals(`${baseURL}/aadmin/professionals/`);
    fetchCategories(); // Fetch categories data
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchProfessionals(`${baseURL}/aadmin/professionals/?search=${searchQuery}`);
    }
  }, [searchQuery]);

  return (
    <div className="container-fluid" style={{ padding: '0 100px', minHeight: '100vh' }}>
      <h4 className="my-4 mx-2">Professional List</h4>
      <input
        type="text"
        placeholder="Search professionals..."
        value={searchQuery}
        className="form-control mb-3"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Link className="btn text-white bg-dark border-0 mb-3" to="user/create">
        Create Professional
      </Link>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Profession</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {professionals.length === 0 ? (
              <tr>
                <td colSpan="6">No Professionals Found</td>
              </tr>
            ) : (
              professionals.map((professional) => {
                const profilePicUrl = professional.profile
                  ? `${baseURL}${professional.profile}`
                  : avatar;

                return (
                  <tr key={professional.id}>
                    <td>
                      <img
                        src={professional.profile ? professional.profile : avatar}
                        className="rounded-circle"
                        alt="Profile"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                        }}
                      />
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <p className="fw-bold mb-1">
                          {professional.first_name} {professional.last_name}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span>{professional.email}</span>
                    </td>
                    <td>
                      <span>{professional.phone_number}</span>
                    </td>
                    <td>
                      <span>{getCategoryNameById(professional.job_profile?.profession)}</span>
                    </td>
                    <td>
                      <Link
                        type="button"
                        className="btn btn-link btn-sm fw-bold"
                        to={`update/${professional.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-5">
        {/* Your footer content */}
      </footer>
    </div>
  );
}

export default AdminProfessionals;
