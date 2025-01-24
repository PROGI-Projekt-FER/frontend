import React, { useEffect, useState } from "react";
import { Box, Table, IconButton, Text, Flex, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import SmallTicketCard from "../Shared/SmallTicketCard";

const MyTicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/tickets",
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) {
    return <Spinner size="lg" color="blue.500" />;
  }

  if (error) {
    return <Text color="red.500">Failed to load tickets: {error}</Text>;
  }

  const handleStatusChange = async (ticket) => {
    try {
      let newStatus;

      if (ticket.status === "SELL" || ticket.status === "SWAP") {
        newStatus = "DEACTIVATED";
      } else if (ticket.status === "DEACTIVATED") {
        if (ticket.price !== 0) {
          newStatus = "SELL";
        } else if (ticket.interestedInCategories.length > 0) {
          newStatus = "SWAP";
        } else {
          throw new Error("Cannot determine new status.");
        }
      } else {
        throw new Error("Invalid ticket status.");
      }

      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/tickets/${ticket.id}/change-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId: ticket.id,
            ticketStatus: newStatus,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const updatedTicket = await response.json();
      setTickets((prevTickets) =>
        prevTickets.map((t) => (t.id === ticket.id ? updatedTicket : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Text fontSize="lg" mb={6}>
        My Current Tickets
      </Text>
      <Box>
        <Table.Root
          tableLayout="fixed"
          width="100%"
          borderWidth="1px"
          borderRadius="md"
          overflow="hidden"
        >
          <Table.Header bg="gray.100">
            <Table.Row>
              <Table.ColumnHeader width="30%">
                Ticket Details
              </Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Status</Table.ColumnHeader>
              <Table.ColumnHeader width="30%"></Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map((ticket) => (
              <Table.Row key={ticket.id}>
                <Table.Cell width="30%">
                  <SmallTicketCard ticket={ticket} />
                </Table.Cell>
                <Table.Cell width="20%">
                  <Text>{ticket.status || "No status available"}</Text>
                </Table.Cell>
                <Table.Cell width="30%"></Table.Cell>
                <Table.Cell width="20%">
                  {ticket.status !== "EXCHANGED" && (
                    <Flex justifyContent="flex-start" gap={2}>
                      <IconButton
                        aria-label="Edit Ticket"
                        size="md"
                        bg="goldenrod"
                        onClick={() => navigate(`/edit-ticket/${ticket.id}`)}
                      >
                        <MdEdit />
                      </IconButton>
                      <IconButton
                        aria-label="Delete Ticket"
                        size="md"
                        bg="red"
                        onClick={() => handleStatusChange(ticket)}
                      >
                        <MdDelete />
                      </IconButton>
                    </Flex>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </>
  );
};

export default MyTicketsTable;
