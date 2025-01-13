import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Table,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
        console.log(data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleGenerateIzv = async (userId) => {
  };

  const handleAddAdmin = async (userId) => {
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={2}>Loading users...</Text>
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
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>First Name</Table.ColumnHeader>
            <Table.ColumnHeader>Last Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Preferred Category</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user, index) => (
            <Table.Row key={index}>
              <Table.Cell>{user.firstName}</Table.Cell>
              <Table.Cell>{user.lastName}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>
                {user.preferredCategory ? (
                  <Box>
                    <Text fontWeight="bold">{user.preferredCategory.name}</Text>
                    <Text color="gray.500" fontSize="sm">
                      {user.preferredCategory.parentCategory}
                    </Text>
                  </Box>
                ) : (
                  <Text color="gray.500">N/A</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <Button 
                  colorScheme="red" 
                  size="sm" 
                  onClick={() => handleDeactivate(user.id)}
                >
                  Deactivate
                </Button>
                <Button 
                  colorScheme="red" 
                  size="sm" 
                  onClick={() => handleGenerateIzv(user.id)}
                >
                  Generiraj izvješće
                </Button>
                <Button 
                  colorScheme="red" 
                  size="sm" 
                  onClick={() => handleAddAdmin(user.id)}
                >
                  Daj administratorske ovlasti
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={6}>
              <Text fontSize="sm" textAlign="center" color="gray.500">
                {users.length} users found.
              </Text>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Box>
  );
};

export default Admin;
