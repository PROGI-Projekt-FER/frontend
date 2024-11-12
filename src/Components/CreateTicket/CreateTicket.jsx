import React, { useState } from "react";
import { Button, Card, Input, Stack, Center, Flex } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Toaster, toaster } from "../ui/toaster"

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

import { createListCollection } from "@chakra-ui/react";

const CreateTicket = () => {
  const [eventName, setEventName] = useState("");
  const [artist, setArtist] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [offerType, setOfferType] = useState("1");
  const [price, setPrice] = useState("");
  const [swapCategoryId, setSwapCategoryId] = useState("");

  const categories = createListCollection({
    items: [
      { label: "Concerts & Music Events", value: "1" },
      { label: "Sports & Competitions", value: "2" },
      { label: "Theater & Performing Arts", value: "3" },
      { label: "Conferences & Seminars", value: "4" },
      { label: "Movies & Cinema Screenings", value: "5" },
    ],
  });

  const swapOrSell = createListCollection({
    items: [
      { label: "Swap", value: "1" },
      { label: "Sell", value: "2" },
    ],
  });

  const handleSubmit = async () => {
    console.log("submit")
    if (!eventName) {
        return toaster.create({
          title: "Event Name is required.",
          type: "error",
        });
      }
      if (!artist) {
        return toaster.create({
          title: "Artist Name is required.",
          type: "error",
        });
      }
      if (!categoryId) {
        return toaster.create({
          title: "Category is required.",
          type: "error",
        });
      }
      if (!timestamp) {
        return toaster.create({
          title: "Event Time is required.",
          type: "error",
        });
      }
      if (!address) {
        return toaster.create({
          title: "Address is required.",
          type: "error",
        });
      }
      if (!city) {
        return toaster.create({
          title: "City is required.",
          type: "error",
        });
      }
      if (offerType === "1" && !swapCategoryId) {
        return toaster.create({
          title: "Swap Category is required.",
          type: "error",
        });
      }
      if (offerType === "2" && (!price || isNaN(parseFloat(price)))) {
        return toaster.create({
          title: "Valid Price is required.",
          type: "error",
        });
      }
  
    const payload = {
      id: 0,
      event: {
        id: 0,
        title: eventName,
        description: "",
        eventDate: timestamp,
        venue: {
          id: 0,
          name: address,
          capacity: 0,
          location: {
            country: "",
            city: city,
            address: address,
          },
        },
        eventEntity: {
          id: 0,
          name: artist,
          type: "string",
        },
      },
      status: offerType === "1" ? "SWAP" : "SELL",
      description: "",
      price: offerType === "2" ? parseFloat(price) : 0,
      categoryIds: [parseInt(categoryId)],
      interestedInCategoryIds: offerType === "1" ? [parseInt(swapCategoryId)] : [],
    };
  
    try {
      const response = await fetch("/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Ticket created successfully!");
      } else {
        alert("Failed to create ticket.");
      }
    } catch (error) {
      alert("An error occurred while creating the ticket.");
    }
  };  
  

  return (
    <>
    <Toaster />

    <Center h="100vh">
      <Card.Root width="lg" p="4" borderRadius="md">
        <Card.Header>
          <Card.Title>Create Ticket</Card.Title>
          <Card.Description>
            Fill in the form below to create a new ticket
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field label="Event Name">
              <Input
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </Field>
            <Field label="Artist">
              <Input
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </Field>
            <SelectRoot collection={categories} size="sm">
              <SelectLabel>Category</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.items.map((category) => (
                  <SelectItem
                    item={category}
                    key={category.value}
                    onClick={() => setCategoryId(category.value)}
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
            <Field label="Event time">
              <Input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
            </Field>
            <Field label="Address">
              <Input
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>

            <Field label="City">
              <Input
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field>
            <SelectRoot collection={swapOrSell} size="sm">
              <SelectLabel>Offer Type</SelectLabel>
              <SelectTrigger>
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

            {offerType === "1" && (
              <SelectRoot collection={categories} size="sm">
                <SelectLabel>Swap Category</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select category for swap" />
                </SelectTrigger>
                <SelectContent>
                  {categories.items.map((category) => (
                    <SelectItem
                      item={category}
                      key={category.value}
                      onClick={() => setSwapCategoryId(category.value)}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}

            {offerType === "2" && (
              <Input
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}
          </Stack>

        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button variant="solid" colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </Card.Footer>
      </Card.Root>
    </Center>
    </>
  );
};

export default CreateTicket;
