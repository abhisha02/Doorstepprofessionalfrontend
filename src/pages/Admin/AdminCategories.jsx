import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for Edit and Delete
import { BsCheckCircle, BsCircle } from 'react-icons/bs'; // Import icons for Listed and Unlisted

function AdminCategories() {
  const baseURL = 'https://doorsteppro.shop';
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = (url) => {
    axios
      .get(url)
      .then((response) => {
        // Sort categories by date created in descending order
        const sortedCategories = response.data.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        setCategories(sortedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchCategories(`${baseURL}/services/categories/?search=${query}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`${baseURL}/services/categories/delete/${id}/`)
        .then((response) => {
          console.log("Category deleted:", response.data);
          fetchCategories(`${baseURL}/services/categories/?search=${searchQuery}`);
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
        });
    }
  };

  const toggleListing = (id, isListed) => {
    const action = isListed ? "unlist" : "list";
    if (window.confirm(`Are you sure you want to ${action} this category?`)) {
      axios
        .post(`${baseURL}/services/categories/toggle-listing/${id}/`)
        .then((response) => {
          console.log("Category listing status toggled successfully.");
          fetchCategories(`${baseURL}/services/categories/?search=${searchQuery}`);
        })
        .catch((error) => {
          console.error("Error toggling category listing:", error);
        });
    }
  };

  useEffect(() => {
    fetchCategories(baseURL + "/services/categories/");
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchCategories(`${baseURL}/services/categories/?search=${searchQuery}`);
    } else {
      fetchCategories(baseURL + "/services/categories/");
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
      <h4 className="my-4 mx-2">Category List</h4>
      <input
        type="text"
        placeholder="Search categories..."
        value={searchQuery}
        className="form-control mb-3"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Link className="btn btn-dark mb-3 btn-lg" to="create">
        Create Category
      </Link>
      <div className="table-responsive">
        <table className="table align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Picture</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No Categories Found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <p className="fw-bold mb-1">{category.name}</p>
                  </td>
                  <td>
                    <img
                      src={category.picture || "default-category.png"}
                      alt={category.name}
                      className="img-fluid"
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  </td>
                  <td>
                    <span>{truncateDescription(category.description, 5)}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn ${category.is_listed ? 'btn-success' : 'btn-danger'} btn-sm`}
                      onClick={() => toggleListing(category.id, category.is_listed)}
                    >
                      {category.is_listed ? (
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
                      to={`update/${category.id}`}
                      className="btn btn-dark btn-sm fw-bold me-2"
                    >
                      <FaEdit color="white" />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-dark btn-sm fw-bold"
                      onClick={() => handleDelete(category.id)}
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

export default AdminCategories;
