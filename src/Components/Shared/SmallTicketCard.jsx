import React from "react";
import { Box, Badge, Heading, Text, Flex } from "@chakra-ui/react";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";

const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}. ${month}. ${year}. ${hours}:${minutes}`;
};

const SmallTicketCard = ({ ticket }) => {
  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      boxShadow="md"
      bg="white"
      _hover={{ boxShadow: "xl" }}
      align="flex-start"
      width="100%"
    >
      <Box flex="1">
        <Badge
          bgColor={ticket.categories[0]?.colorHexCode || "gray.500"}
          color="white"
          px="2"
          py="1"
          borderRadius="md"
          fontSize="sm"
          mb="2"
        >
          {ticket.categories[0]?.name || "Uncategorized"}
        </Badge>
        <Heading size="sm" mb="2">
          {ticket.event.title}
        </Heading>
        <Flex alignItems="center" mb="1">
          <MdCalendarToday size="16px" style={{ marginRight: "8px" }} />
          <Text fontSize="sm">{formatEventDate(ticket.event.eventDate)}</Text>
        </Flex>
        <Flex alignItems="center">
          <MdLocationOn size="16px" style={{ marginRight: "8px" }} />
          <Text fontSize="sm">
            {ticket.event.venue.location.address},{" "}
            {ticket.event.venue.location.city}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SmallTicketCard;
