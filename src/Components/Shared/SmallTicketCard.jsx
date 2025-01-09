import React from "react";
import { Box, Badge, Heading, Text, Flex } from "@chakra-ui/react";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <Flex
      cursor={"pointer"}
      onClick={() => handleCardClick()}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      boxShadow="md"
      bg="white"
      _hover={{ boxShadow: "xl" }}
      direction="column"
      width="100%"
      alignItems="flex-start"
    >
      <Box flex="1" width="100%">
        {/* Categories and Price */}
        <Flex justifyContent="space-between" mb="4">
          <Badge
            bgColor={ticket.categories[0]?.colorHexCode || "gray.500"}
            color="white"
            px="2"
            py="1"
            borderRadius="md"
            fontSize="sm"
          >
            {ticket.categories[0]?.name || "Uncategorized"}
          </Badge>
          <Badge
            bgColor="white"
            color="black"
            border="1px solid black"
            px="2"
            py="1"
            borderRadius="md"
            fontSize="sm"
          >
            {ticket.price ? `${ticket.price}€` : "TicketSwap"}
          </Badge>
        </Flex>

        {/* Event Title */}
        <Heading size="sm" mb="2" isTruncated>
          {ticket.event.title}
        </Heading>

        {/* Event Date */}
        <Flex alignItems="center" mb="2">
          <MdCalendarToday size="16px" style={{ marginRight: "8px" }} />
          <Text fontSize="sm" lineHeight="1.5">
            {formatEventDate(ticket.event.eventDate)}
          </Text>
        </Flex>

        {/* Event Location */}
        <Flex alignItems="center">
          <MdLocationOn size="16px" style={{ marginRight: "8px" }} />
          <Text fontSize="sm" lineHeight="1.5" isTruncated>
            {ticket.event.venue.location.address},{" "}
            {ticket.event.venue.location.city}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SmallTicketCard;
