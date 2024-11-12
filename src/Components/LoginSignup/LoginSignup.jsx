import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  Image,
  Text,
  Link,
  Card,
} from "@chakra-ui/react";

import google_icon from "../Assets/google.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");

  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const email = urlParams.get("email");

  if (username && email) {
    createSession(username, email);
  }

  function createSession(username, email) {
    localStorage.setItem("loggedInUser", JSON.stringify({ username, email }));
    window.location.href = "/";
  }

  function isUserLoggedIn() {
    const user = localStorage.getItem("loggedInUser");
    return user !== null;
  }

  function getLoggedInUser() {
    const user = localStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  const user = getLoggedInUser();
  const isLoggedIn = isUserLoggedIn();

  return (
    <Flex alignItems="center" justifyContent="center" height="100vh" p="4">
      <Card.Root
        width={["90%", "400px"]}
        p="6"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Card.Body>
          {isLoggedIn ? (
            <>
              <Heading size="md" mb="4">
                Logged in as {user.username}
              </Heading>
              <Text mb="4">Email: {user.email}</Text>
            </>
          ) : (
            <>
              <Box textAlign="center" mb="4">
                <Heading size="lg">{action}</Heading>
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
        </Card.Body>
        {isLoggedIn && (
          <Card.Footer>
            <Button colorScheme="red" width="full" onClick={logout}>
              Logout
            </Button>
          </Card.Footer>
        )}
      </Card.Root>
    </Flex>
  );
};

export default LoginSignup;
