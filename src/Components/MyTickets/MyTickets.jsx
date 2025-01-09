import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import MyTicketsTable from "./MyTicketsTable";
import MySwapRequests from "./MySwapRequests";
import { Separator } from "@chakra-ui/react";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/tickets"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner size="xl" />
        <Text>Loading tickets...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        My Tickets
      </Heading>
      <MyTicketsTable tickets={tickets} />
      <Separator my={4} />
      <MySwapRequests tickets={tickets} />
      <Separator my={4} />
    </Box>
  );
};

export default MyTickets;
