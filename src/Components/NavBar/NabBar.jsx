import React from "react";
import { Flex, Box, Heading, Button, Link, } from "@chakra-ui/react";
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
      bg="pink.600"
      color="white"
      boxShadow="md"
    >
      <Heading size="md" cursor="pointer" onClick={() => navigate("/")}>
        TicketSwap
      </Heading>

      <Flex alignItems="center" gap="4">
        <Link onClick={() => navigate("/browse-tickets")} fontWeight="bold">
          Browse Tickets
        </Link>

        {user && (
          <Link onClick={() => navigate("/create-tickets")} fontWeight="bold">
            Create Tickets
          </Link>
        )}

        {user ? (
          <Button variant="outline" colorScheme="whiteAlpha" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="outline" colorScheme="whiteAlpha" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
