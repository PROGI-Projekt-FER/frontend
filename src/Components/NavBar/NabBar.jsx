import React from "react";
import { Flex, Box, Heading, Button, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("loggedInUser");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="space-between"
      p="4"
      bg="blue.800"
      color="white"
      boxShadow="md"
    >
      <Heading size="md" cursor="pointer" onClick={() => navigate("/")}>
        TicketSwapper
      </Heading>

      <Flex alignItems="center" gap="4">
        <Link
          onClick={() => navigate("/browse-tickets")}
          fontWeight="bold"
          color="white"
        >
          Browse Tickets
        </Link>

        {user && (
          <Link
            onClick={() => navigate("/create-ticket")}
            fontWeight="bold"
            color="white"
          >
            Create Tickets
          </Link>
        )}

        {user && (
          <Link
            onClick={() => navigate("/profile")}
            fontWeight="bold"
            color="white"
          >
            Profile{" "}
          </Link>
        )}

        {user ? (
          <Button
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={handleLogout}
            color="white"
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={handleLogin}
            color="white"
          >
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
