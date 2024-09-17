import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar from './avatar.jpeg';

function AdminProApproval() {
  const baseURL = 'https://doorsteppro.shop';
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProfessionals = (url) => {
    axios
      .get(url)
      .then((response) => {
        console.log("Fetched data:", response.data);
        setProfessionals(response.data);  // Set all professionals data
        // Filter data here
        filterProfessionals(response.data, searchQuery);
      })
      .catch((error) => {
        console.error("Error fetching professionals:", error);
        setProfessionals([]);  // Set professionals to an empty array on error
        setFilteredProfessionals([]);  // Clear filtered professionals
      });
  };

  const filterProfessionals = (data, query) => {
    const filtered = data.filter(professional => 
      !professional.job_profile?.is_approved && 
      !professional.job_profile?.is_rejected && // Filter based on is_rejected
      (professional.first_name.toLowerCase().includes(query.toLowerCase()) || 
       professional.last_name.toLowerCase().includes(query.toLowerCase()) ||
       professional.email.toLowerCase().includes(query.toLowerCase()) ||
       professional.phone_number.includes(query))
    );
    setFilteredProfessionals(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProfessionals(professionals, query);  // Filter with the current data
  };

  useEffect(() => {
    fetchProfessionals(baseURL + "/aadmin/professionals/");
  }, []);

  useEffect(() => {
    if (searchQuery) {
      filterProfessionals(professionals, searchQuery);  // Filter with search query
    }
  }, [searchQuery, professionals]);

  return (
    <>
      <div className="container my-4">
        <h4 className="my-4">Unapproved Professionals List</h4>
        <input
          type="text"
          placeholder="Search professionals..."
          value={searchQuery}
          className="form-control mb-3"
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        <div className="table-responsive">
          <table className="table align-middle mb-0 bg-white">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan="4">No Professionals Found</td>
                </tr>
              ) : (
                filteredProfessionals.map((professional) => (
                  <tr key={professional.id}>
                    <td>
                      <div className="d-flex flex-column align-items-start">
                        <img
                          src={professional.User_Profile?.profile_pic || avatar}
                          className="rounded-circle mb-2"
                          alt="Profile"
                          style={{ width: "45px", height: "45px" }}
                        />
                        <p className="fw-bold mb-1">{professional.first_name} {professional.last_name}</p>
                      </div>
                    </td>
                    <td>
                      <span>{professional.email}</span>
                    </td>
                    <td>
                      <span>{professional.phone_number}</span>
                    </td>
                    <td>
                      <Link
                        type="button"
                        className="btn btn-link btn-rounded btn-sm fw-bold"
                        to={`${professional.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminProApproval;
