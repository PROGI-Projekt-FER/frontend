import React, { useEffect, useState } from "react";
import { SimpleGrid, Center, Spinner, Text, Box, Flex } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import TicketCard from "../Shared/TicketCard.jsx";
import FilterComponent from "./FilterComponent.jsx";
import { createListCollection } from "@chakra-ui/react";

const BrowseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilteredTickets = async (filters) => {
    setLoadingTickets(true);

    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/tickets?${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
      toaster.create({
        title: "Error fetching tickets",
        description: err.message,
        type: "error",
      });
    } finally {
      setLoadingTickets(false);
    }
  };

  // Fetch tickets initially
  useEffect(() => {
    fetchFilteredTickets({});
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
      } finally {
        setLoadingCategories(false);
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
          {categories ? (
            <FilterComponent
              categories={categories}
              onFilterChange={fetchFilteredTickets}
            />
          ) : (
            <Center>
              <Spinner size="md" />
            </Center>
          )}
        </Box>

        <Box width="70%">
          {loadingTickets ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : tickets.length === 0 ? (
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
