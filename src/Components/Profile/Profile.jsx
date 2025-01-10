import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const [error, setError] = useState(null); // State to track errors
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const apiCall = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/info",
          { credentials: "include" }
        );
        const responseText = await response.text();
        const data = JSON.parse(responseText); // Parse the text response to JSON
        setUserInfo(data); // Set the user info
        console.log(responseText);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setError(error.message); // Set the error state
      }
    };
    apiCall();
  }, []);

  // Handle click event for the "Edit" button
  const handleEditClick = () => {
    navigate("/profile/edit"); // Navigate to the /profile/edit page
  };

  return (
    <Box p="6" maxW="400px" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
      <VStack>
        <Avatar
          size="lg"
          name={`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
          src={userInfo?.profilePicUrl}
        />

        <Heading size="md">{`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}</Heading>
        <Text color="gray.500">{"Username: " + userInfo?.username || ""}</Text>
        <Text color="gray.500">{"email: " + userInfo?.email || ""}</Text>
        <Button colorScheme="blue" size="sm" onClick={handleEditClick}>
          Edit
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
