import React from "react";
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Profile = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle click event for the "Edit" button
  const handleEditClick = () => {
    navigate("/profile/edit"); // Navigate to the /profile/edit page
  };

  return (
    <Box p="6" maxW="400px" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
      <VStack>
        <Avatar size="lg" name="Sage" src="https://bit.ly/sage-adebayo" />

        <Heading size="md">First Name + Last Name</Heading>
        <Text color="gray.500">Username</Text>
        <Text color="gray.500">Email</Text>
        <Button colorScheme="blue" size="sm" onClick={handleEditClick}>Edit</Button>
      </VStack>
    </Box>
  );
};

export default Profile;