import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for Edit and Delete
import { BsCheckCircle, BsCircle } from 'react-icons/bs'; // Import icons for Listed and Unlisted

function AdminServices() {
  const baseURL = 'https://doorsteppro.shop';
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = (url) => {
    axios
      .get(url)
      .then((response) => {
        console.log("Fetched data:", response.data);
        setServices(response.data); // Use response.data directly if it's an array
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setServices([]); // Set services to an empty array on error
      });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchServices(`${baseURL}/services/services/?search=${query}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      axios
        .delete(`${baseURL}/services/services/delete/${id}/`)
        .then((response) => {
          console.log("Service deleted:", response.data);
          // Refresh the service list after deletion
          fetchServices(`${baseURL}/services/services/?search=${searchQuery}`);
        })
        .catch((error) => {
          console.error("Error deleting service:", error);
        });
    }
  };

  const toggleListing = (id, isListed) => {
    const action = isListed ? "unlist" : "list";
    if (window.confirm(`Are you sure you want to ${action} this service?`)) {
      axios
        .post(`${baseURL}/services/services/toggle-listing/${id}/`)
        .then((response) => {
          console.log("Service listing status toggled successfully.");
          fetchServices(`${baseURL}/services/services/?search=${searchQuery}`);
        })
        .catch((error) => {
          console.error("Error toggling service listing:", error);
        });
    }
  };

  useEffect(() => {
    fetchServices(baseURL + "/services/services/");
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchServices(`${baseURL}/services/services/?search=${searchQuery}`);
    } else {
      fetchServices(baseURL + "/services/services/");
    }
  }, [searchQuery]);

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length <= wordLimit) {
      return description;
    }
    return `${words.slice(0, wordLimit).join(" ")}...`;
  };

  return (
    <div className="container py-4">
      <h4 className="my-4 mx-2">Service List</h4>
      <input
        type="text"
        placeholder="Search services..."
        value={searchQuery}
        className="form-control mb-3"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Link className="btn btn-dark mb-3" to="create">
        Create Service
      </Link>
      <div className="table-responsive">
        <table className="table align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No Services Found
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <p className="fw-bold mb-1">{service.name}</p>
                  </td>
                  <td>
                    <img
                      src={service.image || "default-service.png"}
                      alt={service.name}
                      className="img-fluid"
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  </td>
                  <td>
                    <span>Rs.{service.price}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn ${service.is_listed ? 'btn-success' : 'btn-danger'} btn-sm`}
                      onClick={() => toggleListing(service.id, service.is_listed)}
                    >
                      {service.is_listed ? (
                        <>
                          <BsCheckCircle color="white" className="me-2" /> Listed
                        </>
                      ) : (
                        <>
                          <BsCircle color="white" className="me-2" /> Unlisted
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`update/${service.id}`}
                      className="btn btn-dark btn-sm fw-bold me-2"
                    >
                      <FaEdit color="white" />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-dark btn-sm fw-bold"
                      onClick={() => handleDelete(service.id)}
                    >
                      <FaTrash color="red" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServices;
