import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Heading,
  Separator,
  Center,
  Flex,
  Button,
  Stack,
  HStack,
} from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputLabel,
  NumberInputRoot,
} from "../ui/number-input";
import { useNavigate } from "react-router-dom";
import AdminUsersTable from "./AdminUsersTable";
import AdminCategoriesTable from "./AdminCategoriesTable";
import { Toaster, toaster } from "../ui/toaster";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [daysToDelete, setDaysToDelete] = useState(30);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const user = localStorage.getItem("loggedInUser");
      const parsedUser = JSON.parse(user);
      if (user) {
        if (parsedUser.userRole === "ADMIN") {
          setLoading(false);
        } else {
          toaster.create({
            title: "Regular users can't access this page",
            type: "error",
            duration: 6000,
          });
          navigate("/", { replace: true });
        }
      } else {
        toaster.create({
          title: "You must be logged in to create tickets",
          type: "error",
          duration: 6000,
        });
        navigate("/", { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

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

  const [loadingCleanup, setLoadingCleanup] = useState(true);

  useEffect(() => {
    const fetchCleanupPeriod = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/config/ticket-cleanup-period",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const cleanupDays = Math.round(
            data.cleanupPeriodInSeconds / (24 * 60 * 60)
          );
          setDaysToDelete(cleanupDays);
        } else {
          console.error("Failed to fetch cleanup period.");
        }
      } catch (err) {
        console.error("Error fetching cleanup period:", err);
      } finally {
        setLoadingCleanup(false);
      }
    };

    fetchCleanupPeriod();
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
    navigate(`/report/${userId}`);
  };

  const handleChangeRole = async (user) => {
    try {
      const endpoint =
        user.userRole === "ADMIN"
          ? `https://ticketswap-backend.onrender.com/api/config/make-regular-user/${user.id}`
          : `https://ticketswap-backend.onrender.com/api/config/make-user-admin/${user.id}`;

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toaster.create({
          title: "Changed user role successfully!",
          type: "error",
          duration: 6000,
        });
        setUsers((prevUsers) =>
          prevUsers.map((parseUser) =>
            parseUser.id === user.id
              ? {
                  ...parseUser,
                  userRole: user.userRole === "ADMIN" ? "REGULAR" : "ADMIN",
                }
              : parseUser
          )
        );
      } else {
        console.error(`Failed to update role for user ${user.id}.`);
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
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

  const handleSaveCleanupPeriod = async () => {
    try {
      const payload = { cleanupPeriodInSeconds: daysToDelete * 24 * 60 * 60 };

      const response = await fetch(
        "https://ticketswap-backend.onrender.com/api/config/ticket-cleanup-period",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toaster.create({
          title: "Cleanup period updated successfully!",
          type: "success",
          duration: 5000,
        });
      } else {
        console.error("Failed to update cleanup period.");
      }
    } catch (err) {
      console.error("Error updating cleanup period:", err);
    }
  };

  if (loading || loadingCategories) {
    return (
      <>
        <Toaster />
        <Center h="88vh">
          <Flex direction={"column"} align={"center"} gap={"20px"}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </Flex>
        </Center>
      </>
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
        handleChangeRole={handleChangeRole}
      />
      <Separator marginTop={"20px"} marginBottom={"20px"} />
      <AdminCategoriesTable
        marginTop={"10px"}
        categories={categories}
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleAddCategory={handleAddCategory}
      />
      <Separator marginTop={"20px"} marginBottom={"20px"} />
      <Heading as="h1" size="xl" mb={4}>
        Number of days it will take for a ticket to go from deactivated to
        deleted:
      </Heading>
      <Stack>
        <HStack>
          {loadingCleanup ? (
            <Spinner size="md" />
          ) : (
            <NumberInputRoot
              size="lg"
              value={daysToDelete}
              onValueChange={(e) => setDaysToDelete(Number(e.value) || 0)}
            >
              <NumberInputField />
            </NumberInputRoot>
          )}
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSaveCleanupPeriod}
          >
            Save
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Admin;
