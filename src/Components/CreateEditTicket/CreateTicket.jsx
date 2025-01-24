import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Input,
  Stack,
  Center,
  Flex,
  Spinner,
  Text,
  List,
  ListItem,
  Box,
  Separator,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import { InputGroup } from "../ui/input-group";
import debounce from "lodash.debounce";
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
import { MdSearch } from "react-icons/md";

const CreateTicket = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserPrivileges = async () => {
      setLoading(true);
      const user = localStorage.getItem("loggedInUser");
      if (user) {
        setLoading(false);
        setIsLoggedIn(true);
      } else {
        toaster.create({
          title: "You must be logged in to access this page",
          type: "error",
          duration: 6000,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/", { replace: true });
      }
    };
    checkUserPrivileges();
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [eventName, setEventName] = useState("");
  const [artist, setArtist] = useState("");
  const [artistId, setArtistId] = useState("");
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

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [artistSelectionOpen, setArtistSelectionOpen] = useState(false);
  const searchArtist = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/tickets/autocomplete/artist?query=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      setResults([]);
    }
  };

  const debouncedFetchArtists = useCallback(
    debounce((query) => searchArtist(query), 1000),
    []
  );

  const handleSearchChange = (e) => {
    setArtistSelectionOpen(true);
    const query = e.target.value;
    setArtist(query);
    setSearchTerm(query);
  };

  useEffect(() => {
    debouncedFetchArtists(searchTerm);
  }, [searchTerm, debouncedFetchArtists]);

  const [artistImage, setArtistImage] = useState(null);

  const getArtistImage = async (artistId) => {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/tickets/artist/${artistId}`
      );
      if (!response.ok) throw new Error("Failed to fetch artist image");

      const data = await response.json();
      setArtistImage(data.imageUrl || null);
    } catch (error) {
      console.error("Error fetching artist image:", error);
      setArtistImage(null);
    }
  };

  const handleSelectArtist = (selection) => {
    console.log(selection);

    let newArtistId = selection[Object.keys(selection)[0]];

    setArtist(Object.keys(selection)[0]);
    setArtistId(newArtistId);

    getArtistImage(newArtistId);

    setArtistSelectionOpen(false);
  };

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
          artistId: artistId,
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
          credentials: "include",
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
        window.location.href = "/browse-tickets";
      } else {
        toaster.create({ title: "Error while creating ticket", type: "error" });
      }
    } catch (error) {
      alert("An error occurred while creating the ticket.");
    }
  };

  if (loading) {
    return (
      <>
        <Toaster />

        <Center h="88vh">
          <Spinner size="xl" />
        </Center>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Center minH="92vh" mt="5" mb="5">
        <Card.Root width="xl" p="4" borderRadius="md">
          <Card.Header>
            <Flex justifyContent={"space-between"} height={"70px"}>
              <Card.Title>Create Ticket</Card.Title>
              {artistImage && (
                <img
                  height={"70px"}
                  width={"70px"}
                  src={artistImage}
                  alt="Artist"
                  style={{ borderRadius: "12px", border: "2px solid black" }}
                />
              )}
            </Flex>
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
                    categories.items.slice(0, 5).map((category) => (
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
                  <InputGroup flex="1" startElement={<MdSearch />} width="full">
                    <Input
                      placeholder="Enter artist name"
                      value={artist}
                      onChange={handleSearchChange}
                    />
                  </InputGroup>
                </Field>
              )}
              {Array.isArray(results) &&
                results.length > 0 &&
                artistSelectionOpen && (
                  <Box
                    zIndex={20}
                    borderWidth="1px"
                    borderRadius="md"
                    boxShadow="md"
                    p={3}
                    bg="white"
                    width="full"
                    maxHeight="200px"
                    overflowY="auto"
                  >
                    {results.slice(0, 5).map((result, index) => {
                      const key = Object.keys(result)[0];
                      return (
                        <>
                          <Box
                            key={`${key}-${index}`}
                            p={3}
                            borderRadius="md"
                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                            onClick={() => handleSelectArtist(result)}
                          >
                            <Text>{key}</Text>
                          </Box>
                          <Separator />
                        </>
                      );
                    })}
                  </Box>
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
                    {categories.items.slice(0, 5).map((category) => (
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
