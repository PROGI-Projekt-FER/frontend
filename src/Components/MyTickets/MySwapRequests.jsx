import React, { useEffect, useState } from "react";
import { Box, Table, IconButton, Text, Flex, Spinner } from "@chakra-ui/react";
import {
  MdEdit,
  MdDelete,
  MdSwapHoriz,
  MdCheck,
  MdClose,
} from "react-icons/md";
import SmallTicketCard from "../Shared/SmallTicketCard";
import { useNavigate } from "react-router-dom";

const MySwapRequests = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/pending-requests",
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        const filteredTickets = data.filter(
          (request) => request.sendingTicket.status !== "EXCHANGED"
        );

        setTickets(filteredTickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleResponse = async (requestId, accepting) => {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/request/${requestId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accepting }),
          credentials: "include",
        }
      );

      window.location.reload();

      if (!response.ok) {
        throw new Error(`Failed to respond to request: ${response.statusText}`);
      }

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.sendingTicket.id !== requestId)
      );
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  if (isLoading) {
    return <Spinner size="lg" color="blue.500" />;
  }

  if (error) {
    return <Text color="red.500">Failed to load requests: {error}</Text>;
  }

  return (
    <>
      <Text fontSize="lg" mb={6}>
        My Swap Requests
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
                Sending Ticket
              </Table.ColumnHeader>
              <Table.ColumnHeader width="20%"></Table.ColumnHeader>
              <Table.ColumnHeader width="30%">
                Receiving Ticket
              </Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map((request) => (
              <Table.Row key={request.sendingTicket.id}>
                <Table.Cell width="30%">
                  <SmallTicketCard ticket={request.receivingTicket} />
                </Table.Cell>
                <Table.Cell width="20%">
                  <Text>
                    <MdSwapHoriz size={"xs"} />
                  </Text>
                </Table.Cell>
                <Table.Cell width="30%">
                  <SmallTicketCard ticket={request.sendingTicket} />
                </Table.Cell>
                <Table.Cell width="20%">
                  <Flex justifyContent="flex-start" gap={2}>
                    <IconButton
                      aria-label="Accept Request"
                      size="md"
                      bg="green"
                      onClick={() => handleResponse(request.requestId, true)}
                    >
                      <MdCheck />
                    </IconButton>
                    <IconButton
                      aria-label="Reject Request"
                      size="md"
                      bg="red"
                      onClick={() => handleResponse(request.requestId, false)}
                    >
                      <MdClose />
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

export default MySwapRequests;
