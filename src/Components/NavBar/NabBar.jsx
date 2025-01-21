import React, { useState, useEffect } from "react";
import { Flex, Box, Heading, Button, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("loggedInUser")) || null;
  });

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("loggedInUser")) || null);
    };

    const storageListener = () => {
      updateUser();
    };

    window.addEventListener("storage", storageListener);

    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, []);

  async function handleLogout() {
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
    navigate("/");
  }

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
        TicketSwapper1
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
          <>
            <Link
              onClick={() => navigate("/my-tickets")}
              fontWeight="bold"
              color="white"
            >
              My Tickets{" "}
            </Link>

            <Link
              onClick={() => navigate("/create-ticket")}
              fontWeight="bold"
              color="white"
            >
              Create Tickets
            </Link>
          </>
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

        {user && (
          <Link
            onClick={() => navigate("/admin")}
            fontWeight="bold"
            color="white"
          >
            Admin{" "}
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
