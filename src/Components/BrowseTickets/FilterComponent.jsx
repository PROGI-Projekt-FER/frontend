import React, { useState } from "react";
import { Box, Stack, Button } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

const FilterComponent = ({ tickets, categories, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFilter = () => {
    if (selectedCategory) {
      const filteredTickets = tickets.filter((ticket) =>
        ticket.categories.some((category) => category.name === selectedCategory)
      );
      onFilterChange(filteredTickets);
    }
  };

  const handleReset = () => {
    setSelectedCategory("");
    onFilterChange(tickets); // Show all tickets
  };

  return (
    <Box border="1px solid" borderColor="gray.200" p="4" borderRadius="md">
      <Stack spacing="4">
        <SelectRoot>
          <SelectLabel>Category</SelectLabel>
          <SelectTrigger>
            <SelectValueText placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem
                  item={category}
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
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

        <Stack direction="row" spacing="4">
          <Button
            colorScheme="blue"
            onClick={handleFilter}
            isDisabled={!selectedCategory}
          >
            Apply Filters
          </Button>
          <Button colorScheme="gray" onClick={handleReset}>
            Reset Filters
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FilterComponent;
