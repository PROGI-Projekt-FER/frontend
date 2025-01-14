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
} from "@chakra-ui/react";

import google_icon from "../Assets/google.png";

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

  async function logout() {
    try {
      const response = await fetch(
        "https://ticketswap-backend.onrender.com/api/logout",
        {
          method: "POST",
          credentials: "include", // Ensures cookies or session tokens are sent
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
      <Flex alignItems="center" justifyContent="center" height="100vh" p="4">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" justifyContent="center" height="100vh" p="4">
      <Box
        width={["90%", "400px"]}
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        {user ? (
          <>
            <Heading size="md" mb="4">
              Logged in as {user.username || "Unknown User"}
            </Heading>
            <Text mb="4">Email: {user.email || "Unknown Email"}</Text>
            <Button colorScheme="red" width="full" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Box textAlign="center" mb="4">
              <Heading size="lg">Login</Heading>
            </Box>
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
          </>
        )}
      </Box>
    </Flex>
  );
};

export default LoginSignup;
