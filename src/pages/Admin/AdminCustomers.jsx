import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import avatar from './avatar.jpeg'; // Default fallback image

function AdminCustomers() {
  const baseURL = 'https://doorsteppro.shop';
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users data
  const fetchUsers = (url) => {
    axios
      .get(url)
      .then((response) => {
        console.log("Fetched data:", response.data);
        setUsers(response.data); // Use response.data directly if it's an array
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]); // Handle error by resetting users state
      });
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchUsers(`${baseURL}/aadmin/users/?search=${query}`);
  };

  useEffect(() => {
    fetchUsers(`${baseURL}/aadmin/users/`);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchUsers(`${baseURL}/aadmin/users/?search=${searchQuery}`);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="container">
        <h4 className="my-4 mx-2">User List</h4>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            className="form-control"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Link className="btn text-white bg-dark border-0 my-3" to="user/create">
          Create User
        </Link>
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4">No Users Found</td>
                </tr>
              ) : (
                users.map((user) => {
                  const profilePicUrl = user.profile_pic || avatar; // Use the profile_pic URL or fallback to default image

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex flex-column align-items-start">
                          <img
                            src={profilePicUrl}
                            className="rounded-circle mb-2"
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
                          <p className="fw-bold mb-1">
                            {user.first_name} {user.last_name}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span>{user.email}</span>
                      </td>
                      <td>
                        <span>{user.phone_number}</span>
                      </td>
                      <td>
                        <Link
                          type="button"
                          className="btn btn-link btn-rounded btn-sm fw-bold"
                          to={`update/${user.id}`}
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
      </div>
    </>
  );
}

export default AdminCustomers;
