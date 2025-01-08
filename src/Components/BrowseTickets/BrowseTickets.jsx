import React, { useEffect, useState } from "react";
import { SimpleGrid, Center, Spinner, Text, Box, Flex } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import TicketCard from "../Shared/TicketCard.jsx";
import FilterComponent from "./FilterComponent.jsx";
import { createListCollection } from "@chakra-ui/react";

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
        const data = await response.json();
        const categoryList = data.map((category) => ({
          label: category.name,
          value: category.id.toString(),
        }));
        setCategories(createListCollection({ items: categoryList }));
      } catch (error) {
        toaster.create({
          title: "Failed to fetch categories",
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
