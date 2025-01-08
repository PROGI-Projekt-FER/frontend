import React from "react";
import { Box, Badge, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";

const TicketCard = ({ ticket, getCategoryColor, formatEventDate }) => {
  return (
    <Box
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
        <Box mb="9" />
      )}
      {ticket.event.eventEntity.name ? (
        <Text fontWeight="bold" mb="1">
          {ticket.event.eventEntity.name}
        </Text>
      ) : (
        <Box mb="9" />
      )}
      <Flex alignItems="center" mb="2">
        <MdCalendarToday size="20px" style={{ marginRight: "8px" }} />
        <Text>{formatEventDate(ticket.event.eventDate)}</Text>
      </Flex>
      <Flex alignItems="center" mb="2">
        <MdLocationOn size="20px" style={{ marginRight: "8px" }} />
        <Text>
          {ticket.event.venue.location.address},{" "}
          {ticket.event.venue.location.city}
        </Text>
      </Flex>
      <Flex justifyContent="flex-end" mb="4">
        <Badge
          bgColor="white"
          color="black"
          border="1px solid"
          borderColor="black"
          px="2"
          py="1"
          borderRadius="md"
        >
          {ticket.price ? `${ticket.price}€` : "TicketSwap"}
        </Badge>
      </Flex>
      <Button colorScheme="blue" width="full">
        View Details
      </Button>
    </Box>
  );
};

export default TicketCard;
