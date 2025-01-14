import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, Heading, Separator } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AdminUsersTable from "./AdminUsersTable";
import AdminCategoriesTable from "./AdminCategoriesTable";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users",
          { credentials: "include" }
        );
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchUsers();
    fetchCategories();
  }, []);

  const handleDeactivate = async (userId) => {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleGenerateIzv = (userId) => {
    console.log("Generate report for user", userId);
  };

  const handleAddAdmin = (userId) => {
    console.log("Make user admin", userId);
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch(
        "https://ticketswap-backend.onrender.com/api/categories",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory),
        }
      );
      if (response.ok) {
        const addedCategory = await response.json();
        setCategories((prevCategories) => [...prevCategories, addedCategory]);
      } else {
        console.error("Failed to add category");
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/categories/${updatedCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: updatedCategory.name,
            colorHexCode: updatedCategory.colorHexCode,
          }),
        }
      );

      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
      } else {
        console.error("Failed to update category");
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/categories/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  if (loading || loadingCategories) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={2}>Loading data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={4}>
        All Users
      </Heading>
      <AdminUsersTable
        users={users}
        handleDeactivate={handleDeactivate}
        handleGenerateIzv={handleGenerateIzv}
        handleAddAdmin={handleAddAdmin}
      />
      <Separator marginTop={"20px"} marginBottom={"20px"} />
      <AdminCategoriesTable
        marginTop={"10px"}
        categories={categories}
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleAddCategory={handleAddCategory}
      />
    </Box>
  );
};

export default Admin;
