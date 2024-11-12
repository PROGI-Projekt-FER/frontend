import React, { useEffect, useState } from "react";
import {
  SimpleGrid,
  Box,
  Text,
  Heading,
  Center,
  Spinner,
  Button,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";

const BrowseTickets = () => {
  // Initialize state for tickets, loading status, and error
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets from the API
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

  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case 1:
        return "blue.500";
      case 4:
        return "green.500";
      case 5:
        return "purple.500";
      case 6:
        return "orange.500";
      case 7:
        return "red.500";
      default:
        return "gray.500";
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Toaster />
      <Center p="4">
        {tickets.length === 0 ? (
          <Text>No tickets available</Text>
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
            {tickets.map((ticket) => (
              <Box
                key={ticket.id}
                width="350px"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p="6"
                boxShadow="md"
                bg="white"
                _hover={{ boxShadow: "xl" }}
              >
                <Badge
                  bgColor={getCategoryColor(ticket.categories[0]?.id)}
                  color="white"
                  px="2"
                  py="1"
                  borderRadius="md"
                  fontSize="sm"
                >
                  {ticket.categories[0]?.name}
                </Badge>{" "}
                <Heading size="xl" mb="2">
                  {ticket.event.title}
                </Heading>
                {ticket.event.description ? (
    <Text fontWeight="light" mb="1">
      {ticket.event.description}
    </Text>
  ) : (
    <Box mb="6" />
  )}
                <Text mb="2">
                  <strong>Artist:</strong>{" "}
                  {ticket.event.eventEntity.name || "N/A"}
                </Text>
                <Flex alignItems="center" mb="2">
                  <MdCalendarToday size="20px" style={{ marginRight: "8px" }} />
                  <Text>
                    {new Date(ticket.event.eventDate).toLocaleString()}
                  </Text>
                </Flex>
                <Flex alignItems="center" mb="2">
                  <MdLocationOn size="20px" style={{ marginRight: "8px" }} />
                  <Text>
                    {ticket.event.venue.location.address},{" "}
                    {ticket.event.venue.location.city}
                  </Text>
                </Flex>
                <Text mb="4">
                  <strong>Price:</strong>{" "}
                  {ticket.price ? `$${ticket.price}` : "Free"}
                </Text>
                <Button colorScheme="blue" width="full">
                  View Details
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Center>
    </>
  );
};

export default BrowseTickets;
