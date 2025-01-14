import React, { useEffect, useState } from "react";
import { Box, Table, IconButton, Text, Flex, Spinner } from "@chakra-ui/react";
import { MdInfo } from "react-icons/md";

const MyTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/trade-history",
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
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
  }, []);

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
        My Transaction History
      </Text>
      <Box>
        <Table variant="simple" size="md" borderWidth="1px" borderRadius="md">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Traded For</th>
              <th>Sold For</th>
              <th>Traded At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>
                  <Text>
                    {transaction.ticket.event.title} -{" "}
                    {transaction.ticket.description}
                  </Text>
                </td>
                <td>
                  {transaction.swappedForTicket ? (
                    <Text>
                      {transaction.swappedForTicket.event.title} -{" "}
                      {transaction.swappedForTicket.description}
                    </Text>
                  ) : (
                    <Text>Not applicable</Text>
                  )}
                </td>
                <td>
                  {transaction.soldForPrice > 0
                    ? `€${transaction.soldForPrice}`
                    : "Not applicable"}
                </td>
                <td>{new Date(transaction.tradedAt).toLocaleString()}</td>
                <td>
                  <Flex justifyContent="flex-start" gap={2}>
                    <IconButton
                      aria-label="View Details"
                      icon={<MdInfo />}
                      size="sm"
                      bg="blue.400"
                      color="white"
                    />
                  </Flex>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </>
  );
};

export default MyTransactionHistory;
