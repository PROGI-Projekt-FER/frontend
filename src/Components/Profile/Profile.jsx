import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Center,
  Badge,
} from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { Field } from "../ui/field";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const apiCall = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/info",
          { credentials: "include" }
        );
        const responseText = await response.text();
        const data = JSON.parse(responseText);
        setUserInfo(data);
        console.log(responseText);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setError(error.message);
      }
    };
    apiCall();
  }, []);

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  return (
    <Center h="88vh">
      <Box
        p="6"
        width="400px"
        mx="auto"
        bg="gray.50"
        borderRadius="md"
        boxShadow="md"
      >
        <VStack>
          <Avatar
            size="lg"
            name={`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
            src={userInfo?.profilePicUrl}
          />

          <Heading size="md">{`${userInfo?.firstName || ""} ${
            userInfo?.lastName || ""
          }`}</Heading>
          <Field label="Username">
            <Text color="gray.500">{userInfo?.username || "-"}</Text>{" "}
          </Field>

          <Field label="Email">
            <Text color="gray.500">{userInfo?.email || "-"}</Text>
          </Field>
          <Field label="Preferred Category">
            <Badge
              bgColor={userInfo?.preferredCategory?.colorHexCode}
              color="white"
              px="2"
              py="1"
              borderRadius="md"
              fontSize="sm"
            >
              {userInfo?.preferredCategory?.name}
            </Badge>
          </Field>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleEditClick}
            marginTop={"10px"}
          >
            Edit
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Profile;
