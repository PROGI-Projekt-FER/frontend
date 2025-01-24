import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  Image,
  Text,
  Link,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";

import google_icon from "../Assets/google.png";

const API_BASE_URL = "https://ticketswap-backend.onrender.com/api/config";

const LoginSignup = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/info",
          { credentials: "include" }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("loggedInUser", JSON.stringify(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, []);

  async function handleRoleChange(endpoint) {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/config/${endpoint}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toaster.create({
          title:
            "Changed user role successfully! User now has a role: " +
            updatedUser.userRole,
          type: "success",
        });
      } else {
        console.error("Failed to update role:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }

  async function logout() {
    try {
      const response = await fetch(
        "https://ticketswap-backend.onrender.com/api/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("loggedInUser");
        setUser(null);
        window.location.href = "/";
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  if (loading) {
    return (
      <Center h="88vh">
        <VStack>
          <Spinner size="xl" />
          <Text>Loading...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <>
      <Toaster />
      <Flex alignItems="center" justifyContent="center" height="100vh" p="4">
        <Box
          width={["90%", "400px"]}
          p="6"
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
        >
          {user ? (
            <VStack spacing={4}>
              <Heading size="md">
                Logged in as {user.username || "Unknown User"}
              </Heading>
              <Text>Email: {user.email || "Unknown Email"}</Text>
              <Button colorScheme="red" width="full" onClick={logout}>
                Logout
              </Button>
              <Text>Note: Buttons below are for Dev purposes only</Text>
              <Button
                colorScheme="green"
                width="full"
                onClick={() => handleRoleChange("make-me-admin")}
              >
                Make Me Admin
              </Button>
              <Button
                colorScheme="blue"
                width="full"
                onClick={() => handleRoleChange("make-me-regular-user")}
              >
                Make Me Regular User
              </Button>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Heading size="lg">Login</Heading>
              <Link
                href="https://ticketswap-backend.onrender.com/oauth2/authorization/google"
                _hover={{ textDecoration: "none" }}
                width="full"
              >
                <Button
                  colorScheme="blue"
                  variant="solid"
                  width="full"
                  py="6"
                  borderRadius="md"
                >
                  <Image
                    src={google_icon}
                    alt="Google Icon"
                    boxSize="24px"
                    mr="2"
                    display="inline-block"
                  />
                  Continue with Google
                </Button>
              </Link>
            </VStack>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default LoginSignup;
