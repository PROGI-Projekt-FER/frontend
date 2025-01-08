import React, { useEffect, useState } from "react";
import { SimpleGrid, Center, Spinner, Text, Box, Flex } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import TicketCard from "../Shared/TicketCard.jsx";
import FilterComponent from "./FilterComponent.jsx";

const BrowseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [categories, setCategories] = useState([]);
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
        setFilteredTickets(data);
      } catch (err) {
        setError(err.message);
        toaster.create({
          title: "Error fetching tickets",
          description: err.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/categories"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data); // Set categories from API response
      } catch (err) {
        toaster.create({
          title: "Error fetching categories",
          description: err.message,
          type: "error",
        });
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = (filteredData) => {
    setFilteredTickets(filteredData);
  };

  if (loading) {
    return (
      <>
        <Toaster />
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Flex p="4" overflow="auto">
        <Box width="30%" pr="4">
          <FilterComponent
            tickets={tickets}
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </Box>
        <Box width="70%">
          {filteredTickets.length === 0 ? (
            <Center>
              <Text>No tickets available</Text>
            </Center>
          ) : (
            <SimpleGrid
              minChildWidth="350px"
              spacing="6"
              gap="6"
              width="full"
              maxWidth="1200px"
              justifyContent="center"
              alignItems="center"
            >
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default BrowseTickets;
