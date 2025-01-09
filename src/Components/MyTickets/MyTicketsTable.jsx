import React from "react";
import { Box, Table, IconButton, Text, Flex } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import SmallTicketCard from "../Shared/SmallTicketCard";

const MyTicketsTable = ({ tickets }) => {
  return (
    <>
      <Text fontSize="lg" mb={6}>
        My Current Tickets
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
                Ticket Details
              </Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Status</Table.ColumnHeader>
              <Table.ColumnHeader width="30%"></Table.ColumnHeader>
              <Table.ColumnHeader width="20%">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map((ticket) => (
              <Table.Row key={ticket.id}>
                <Table.Cell width="30%">
                  <SmallTicketCard ticket={ticket} />
                </Table.Cell>
                <Table.Cell width="20%">
                  <Text>{ticket.status || "No status available"}</Text>
                </Table.Cell>
                <Table.Cell width="30%"></Table.Cell>
                <Table.Cell width="20%">
                  <Flex justifyContent="flex-start" gap={2}>
                    <IconButton
                      aria-label="Edit Ticket"
                      size="sm"
                      colorScheme="blue"
                    >
                      <MdEdit />
                    </IconButton>
                    <IconButton
                      aria-label="Delete Ticket"
                      size="sm"
                      colorScheme="red"
                    >
                      <MdDelete />
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

export default MyTicketsTable;
