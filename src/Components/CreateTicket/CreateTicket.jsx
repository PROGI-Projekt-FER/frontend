import React, { useEffect, useState } from "react";
import { Button, Card, Input, Stack, Center, Flex } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Toaster, toaster } from "../ui/toaster";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { createListCollection } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreateTicket = () => {

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checking session storage...");
    const user = localStorage.getItem("loggedInUser");
    console.log(user);
    if (!user) {
      toaster.create({
        title: "You must be logged in to create tickets.",
        type: "error",
      });
      navigate("/");
    }
  }, [navigate]);

  const [eventName, setEventName] = useState("");
  const [artist, setArtist] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [offerType, setOfferType] = useState("");
  const [price, setPrice] = useState("");
  const [swapCategoryId, setSwapCategoryId] = useState("");
  const [categories, setCategories] = useState(
    createListCollection({ items: [] })
  );

  const swapOrSell = createListCollection({
    items: [
      { label: "Swap", value: "1" },
      { label: "Sell", value: "2" },
    ],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/categories"
        );
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
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!eventName) {
      return toaster.create({
        title: "Event Name is required.",
        type: "error",
      });
    }
    if (categoryId === "1" && !artist) {
      return toaster.create({
        title: "Artist Name is required for Music Events.",
        type: "error",
      });
    }
    if (!categoryId) {
      return toaster.create({ title: "Category is required.", type: "error" });
    }
    if (!timestamp) {
      return toaster.create({
        title: "Event Time is required.",
        type: "error",
      });
    }
    if (!address) {
      return toaster.create({ title: "Address is required.", type: "error" });
    }
    if (!city) {
      return toaster.create({ title: "City is required.", type: "error" });
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
      event: {
        title: eventName,
        description,
        eventDate: timestamp,
        venue: {
          name: address,
          capacity: 2500,
          location: {
            country: "",
            city,
            address,
          },
        },
        eventEntity: {
          name: artist,
          type: "string",
        },
      },
      status: offerType === "1" ? "SWAP" : "SELL",
      description,
      price: offerType === "2" ? parseFloat(price) : 0,
      categoryIds: [parseInt(categoryId)],
      interestedInCategoryIds:
        offerType === "1" ? [parseInt(swapCategoryId)] : [],
    };

    try {
      const response = await fetch(
        "https://ticketswap-backend.onrender.com/api/tickets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toaster.create({
          title: "Ticket created successfully",
          type: "success",
        });
      } else {
        toaster.create({ title: "Error while creating ticket", type: "error" });
      }
    } catch (error) {
      alert("An error occurred while creating the ticket.");
    }
  };

  return (
    <>
      <Toaster />
      <Center h="100vh">
        <Card.Root width="xl" p="4" borderRadius="md">
          <Card.Header>
            <Card.Title>Create Ticket</Card.Title>
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
                        onClick={() => setCategoryId(category.value)}
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

              {categoryId === "1" && (
                <Field label="Artist">
                  <Input
                    placeholder="Enter artist name"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                  />
                </Field>
              )}

              <Field label="Description">
                <Input
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field label="Event time">
                <Input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
              </Field>
              <Flex gap="4">
                <Field label="Address" flex="1">
                  <Input
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Field>

                <Field label="City" flex="1">
                  <Input
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field>
              </Flex>

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
                <Field label="Price">
                  <Input
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Field>
              )}
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
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
