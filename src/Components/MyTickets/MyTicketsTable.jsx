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
                  <Flex justifyContent="flex-start" gap={2}>
                    <IconButton
                      aria-label="Edit Ticket"
                      size="md"
                      bg="goldenrod"
                      onClick={() => navigate(`/edit-ticket/${ticket.id}`)}
                    >
                      <MdEdit />
                    </IconButton>
                    <IconButton aria-label="Delete Ticket" size="md" bg="red">
                      <MdDelete />
                    </IconButton>
                  </Flex>
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
