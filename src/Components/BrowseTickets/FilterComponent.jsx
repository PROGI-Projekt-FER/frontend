import React, { useState } from "react";
import { Box, Stack, Button, Input, Card } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { Field } from "../ui/field";
import { createListCollection } from "@chakra-ui/react";

const FilterComponent = ({ tickets, categories, onFilterChange }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [offerType, setOfferType] = useState("");

  const handleFilter = () => {
    let filteredTickets = tickets;

    // Filter by category if selected
    if (selectedCategoryId) {
      filteredTickets = filteredTickets.filter((ticket) =>
        ticket.categories.some(
          (category) => category.name === selectedCategoryId
        )
      );
    }

    // Filter by date range if provided
    if (fromDate || toDate) {
      filteredTickets = filteredTickets.filter((ticket) => {
        const eventDate = new Date(ticket.event.eventDate);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && to) {
          return eventDate >= from && eventDate <= to;
        }
        if (from) {
          return eventDate >= from;
        }
        if (to) {
          return eventDate <= to;
        }
        return true;
      });
    }

    onFilterChange(filteredTickets);
  };

  const swapOrSell = createListCollection({
    items: [
      { label: "Swap", value: "1" },
      { label: "Sell", value: "2" },
    ],
  });

  const handleReset = () => {
    setSelectedCategoryId("");
    setFromDate("");
    setToDate("");
    onFilterChange(tickets); // Show all tickets
  };

  return (
    <Card.Root
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="lg"
      bg="white"
    >
      <Card.Header>
        <Card.Title>Filter Tickets</Card.Title>
      </Card.Header>
      <Card.Body>
        <Stack spacing="4">
          {/* Offer Type Filter */}
          <SelectRoot collection={swapOrSell} size="sm">
            <SelectLabel>Offer Type</SelectLabel>
            <SelectTrigger clearable>
              <SelectValueText placeholder="Select offer Type" />
            </SelectTrigger>
            <SelectContent>
              {swapOrSell.items.map((swapOrSell) => (
                <SelectItem
                  item={swapOrSell}
                  key={swapOrSell.value}
                  onClick={() => setOfferType(swapOrSell.value)}
                >
                  {swapOrSell.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          {/* Category Filter */}
          <SelectRoot collection={categories} size="sm">
            <SelectLabel>Category</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.items?.length > 0 ? (
                categories.items.map((category) => (
                  <SelectItem
                    item={category}
                    key={category.value}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem
                  item={{ label: "No categories available", value: "" }}
                  disabled
                >
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </SelectRoot>

          {/* Date Range Filters */}
          <Field label="From Date">
            <Input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Field>
          <Field label="To Date">
            <Input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Field>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Stack direction="row" spacing="4" w="full">
          <Button
            colorScheme="blue"
            onClick={handleFilter}
            isDisabled={!selectedCategoryId && !fromDate && !toDate}
            flex="1"
          >
            Apply Filters
          </Button>
          <Button colorScheme="gray" onClick={handleReset} flex="1">
            Reset Filters
          </Button>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
};

export default FilterComponent;
