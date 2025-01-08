import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Spinner, Table, Button } from "@chakra-ui/react";
import SmallTicketCard from "../Shared/SmallTicketCard";

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
      <Text fontSize="lg" mb={6}>
        My Current Tickets
      </Text>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader colSpan={2}>Ticket Details</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Venue</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tickets.map((ticket) => (
            <Table.Row key={ticket.id}>
              <Table.Cell colSpan={2}>
                <SmallTicketCard ticket={ticket} />
              </Table.Cell>
              <Table.Cell>
                {new Date(ticket.event.eventDate).toLocaleString()}
              </Table.Cell>
              <Table.Cell>
                {ticket.event.venue.location.address},{" "}
                {ticket.event.venue.location.city}
              </Table.Cell>
              <Table.Cell>{ticket.status || "Unknown"}</Table.Cell>
              <Table.Cell>
                <Button size="sm" colorScheme="blue" mr={2}>
                  Edit
                </Button>
                <Button size="sm" colorScheme="red">
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default MyTickets;
