import React, { useEffect, useState } from "react";
import { Box, Spinner, Text, Table } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import SmallTicketCard from "../Shared/SmallTicketCard";

const AdminTransactionHistory = () => {
  const { userId } = useParams(); // Extract userId from the route
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `https://ticketswap-backend.onrender.com/api/users/${userId}/trade-history`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (isLoading) {
    return <Spinner size="lg" color="blue.500" />;
  }

  if (error) {
    return (
      <Text color="red.500">Failed to load transaction history: {error}</Text>
    );
  }

  return (
    <>
      <Text fontSize="lg" mb={6} fontWeight="bold">
        Transaction History
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
              <Table.ColumnHeader width="30%">Ticket</Table.ColumnHeader>
              <Table.ColumnHeader width="30%">Traded For</Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Sold For</Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Traded At</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {transactions.map((transaction) => (
              <Table.Row key={transaction.ticket.id}>
                <Table.Cell width="30%">
                  <SmallTicketCard ticket={transaction.ticket} />
                </Table.Cell>
                <Table.Cell width="30%">
                  {transaction.swappedForTicket ? (
                    <SmallTicketCard ticket={transaction.swappedForTicket} />
                  ) : (
                    <Text>-</Text>
                  )}
                </Table.Cell>
                <Table.Cell width="20%">
                  {transaction.soldForPrice > 0
                    ? `€${transaction.soldForPrice}`
                    : "-"}
                </Table.Cell>
                <Table.Cell width="20%">
                  {new Date(transaction.tradedAt).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </>
  );
};

export default AdminTransactionHistory;
