import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Input,
  Card,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
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

const FilterComponent = ({ categories, onFilterChange }) => {
  const [categoriesFilter, setCategoriesFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [offerTypes, setOfferTypes] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleApplyFilters = () => {
    onFilterChange({
      categories: categoriesFilter,
      offerTypes,
      startDate,
      endDate,
      priceMin,
      priceMax,
    });
  };

  const handleReset = () => {
    setCategoriesFilter("");
    setStartDate("");
    setEndDate("");
    setOfferTypes("");
    setPriceMin("");
    setPriceMax("");
    onFilterChange({});
  };

  const swapOrSell = createListCollection({
    items: [
      { label: "Swap", value: "SWAP" },
      { label: "Sell", value: "SELL" },
    ],
  });

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
          <Flex align="center">
            <SelectRoot
              collection={swapOrSell}
              size="sm"
              onValueChange={(item) => setOfferTypes(item.value || "")}
            >
              <SelectLabel>Offer Type</SelectLabel>
              <SelectTrigger clearable>
                <SelectValueText placeholder="Select offer Type" />
              </SelectTrigger>
              <SelectContent>
                {swapOrSell.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </Flex>

          <Flex align="center">
            <SelectRoot
              collection={categories}
              size="sm"
              onValueChange={(item) => setCategoriesFilter(item.value || "")}
            >
              <SelectLabel>Category</SelectLabel>
              <SelectTrigger clearable>
                <SelectValueText placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.items?.length > 0 ? (
                  categories.items.map((category) => (
                    <SelectItem item={category} key={category.value}>
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
          </Flex>

          {/* Date Range Filters */}
          <Flex align="center">
            <Field label="From Date">
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            {startDate && (
              <IconButton
                ml="2"
                size="sm"
                icon={<MdClose />}
                onClick={() => setStartDate("")}
                aria-label="Clear from date"
              />
            )}
          </Flex>
          <Flex align="center">
            <Field label="To Date">
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
            {endDate && (
              <IconButton
                ml="2"
                size="sm"
                icon={<MdClose />}
                onClick={() => setEndDate("")}
                aria-label="Clear to date"
              />
            )}
          </Flex>

          {/* Price Range Filters */}
          <Flex align="center" gap="4">
            <Field label="Min Price">
              <Input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Enter minimum price"
              />
            </Field>
            <Field label="Max Price">
              <Input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Enter maximum price"
              />
            </Field>
          </Flex>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Stack direction="row" spacing="4" w="full">
          <Button colorScheme="gray" onClick={handleReset} flex="1">
            Reset Filters
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleApplyFilters}
            isDisabled={
              !categoriesFilter &&
              !startDate &&
              !endDate &&
              !offerTypes &&
              !priceMin &&
              !priceMax
            }
            flex="1"
          >
            Apply Filters
          </Button>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
};

export default FilterComponent;
