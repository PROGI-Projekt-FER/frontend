import {
  Center,
  Flex,
  Spinner,
  Text,
  Button,
  Card,
  Box,
  Heading,
  Badge,
  Image,
} from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toaster } from "../ui/toaster";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot,
} from "../ui/dialog";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";
import { createListCollection } from "@chakra-ui/react";

export default function TicketDetails() {
  const params = useParams();

  const [ticket, setTicket] = useState(null);
  const [myTickets, setMyTickets] = useState(null);
  const [requestingTicketID, setRequestingTicketID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [artistImage, setArtistImage] = useState(null);

  const [myTicketsRaw, setMyTicketsRaw] = useState(null);
  const [isMyTicket, setIsMyTicket] = useState(false);

  const [shouldAttemptSwap, setShouldAttemptSwap] = useState(true);

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}. ${month}. ${year}. ${hours}:${minutes}`;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserPrivileges = async () => {
      setLoading(true);
      const user = localStorage.getItem("loggedInUser");
      if (user) {
        setLoading(false);
        setIsLoggedIn(true);
      }
    };
    checkUserPrivileges();
  }, [navigate]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(
          `https://ticketswap-backend.onrender.com/api/tickets/${params.slug}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ticket");
        }

        const data = await response.json();
        setTicket(data);

        const eventDate = new Date(data.event.eventDate);
        const currentDate = new Date();
        const diffDays = (eventDate - currentDate) / (1000 * 60 * 60 * 24);

        if (diffDays <= 5) {
          const weatherResponse = await fetch(
            `https://ticketswap-backend.onrender.com/api/tickets/${data.id}/weather`
          );

          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            setWeather(weatherData);
          }
        }

        if (data.event.eventEntity.artistId) {
          const response = await fetch(
            `https://ticketswap-backend.onrender.com/api/tickets/artist/${data.event.eventEntity.artistId}`
          );
          if (!response.ok) throw new Error("Failed to fetch artist image");

          const data2 = await response.json();
          setArtistImage(data2.imageUrl || null);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [params.slug]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchMyTickets = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/tickets",
          { credentials: "include" }
        );
        const data = await response.json();

        setMyTicketsRaw(data);

        const filteredTransactions = data.filter(
          (ticket) => ticket.status === "SWAP"
        );

        const myTicketsList = filteredTransactions.map((ticket) => ({
          label:
            ticket.event.title +
            " - " +
            formatEventDate(ticket.event.eventDate),
          category: ticket.categories[0],
          value: ticket.id.toString(),
        }));
        setMyTickets(createListCollection({ items: myTicketsList }));
      } catch (error) {}
    };
    fetchMyTickets();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!ticket || !isLoggedIn || !myTicketsRaw) {
      return;
    }
    setLoading(true);

    const checkIfMyTicket = async () => {
      console.log(myTicketsRaw);
      try {
        const myTicketIds = myTicketsRaw.map((ticket) => ticket.id);

        setIsMyTicket(myTicketIds.includes(ticket.id));
        setLoading(false);
      } catch (error) {
        toaster.create({
          title: error.toString(),
          type: "error",
        });
      }
    };

    checkIfMyTicket();
  }, [ticket, isLoggedIn, myTicketsRaw]);

  const handleSellConfirm = async () => {
    try {
      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/tickets/${ticket.id}/buy`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete the action. Please try again.");
      }

      toaster.create({
        title: "Success",
        description: "Action completed successfully.",
        type: "success",
      });
      setOpen(false);
    } catch (err) {
      setOpen(false);

      toaster.create({
        title: "Error",
        description: err.message,
        type: "error",
      });
    }
  };

  const handleSwapConfirm = async () => {
    try {
      const requestBody = {
        requestingTicketId: requestingTicketID,
        receivingTicketId: ticket.id,
        shouldAttemptSwap: shouldAttemptSwap,
      };

      const response = await fetch(
        `https://ticketswap-backend.onrender.com/api/request`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate swap. Please try again.");
      }

      toaster.create({
        title: "Success",
        description: "Swap request initiated successfully.",
        type: "success",
      });
      setOpen(false);
    } catch (err) {
      setOpen(false);
      toaster.create({
        title: "Error",
        description: err.message,
        type: "error",
      });
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

  if (!ticket) {
    return <Text>Ticket doesn't exist</Text>;
  }

  const renderWeatherDetails = () => {
    if (!weather) return null;

    return (
      <Flex
        direction="column"
        alignItems="center"
        bg="blue.100"
        p="4"
        borderRadius="md"
        boxShadow="md"
        mt="4"
      >
        <Heading size="md">Weather Forecast</Heading>
        <Flex alignItems="center" mt="2">
          <Image
            src={`http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
            alt={weather.weatherDescription}
            boxSize="50px"
          />
          <Text fontSize="lg" ml="2">
            {weather.weather}, {weather.temp.toFixed(1)}°C
          </Text>
        </Flex>
        <Text fontSize="sm" color="gray.600">
          {weather.weatherDescription}
        </Text>
      </Flex>
    );
  };

  const renderTicketDetails = (status) => {
    const buttonText = status === "SWAP" ? "Swap" : "Buy";

    return (
      <>
        <Toaster />
        <Center h="86vh">
          <Card.Root
            bg={"none"}
            marginTop={"10px"}
            border={"none"}
            gap={"10px"}
          >
            <Box
              width="700px"
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              p="6"
              boxShadow="md"
              bg="white"
              alignItems={"center"}
              alignSelf={"center"}
            >
              <Heading textAlign={"center"} size={"4xl"}>
                {ticket.event.title}
              </Heading>
            </Box>

            <Box
              width="700px"
              borderWidth="1px"
              borderRadius="4xl"
              overflow="hidden"
              p="6"
              boxShadow="md"
              bg="white"
              alignItems={"center"}
              alignSelf={"center"}
            >
              <Flex gap={"25px"} flexDirection={"column"}>
                <Flex justifyContent={"space-between"}>
                  <Text fontWeight={"bold"} fontSize={"md"}>
                    {ticket.event.eventEntity.name}
                  </Text>
                  <Badge
                    bgColor={ticket.categories[0]?.colorHexCode}
                    color="white"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="sm"
                  >
                    {ticket.categories[0]?.name}
                  </Badge>
                </Flex>

                <Flex justifyContent={"space-between"}>
                  <Flex
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                    direction={"column"}
                    gap={"10px"}
                  >
                    <Flex alignItems="center">
                      <MdLocationOn size={"30px"} />
                      <Text fontSize={"lg"} marginLeft="8px">
                        {ticket.event.venue.location.address},{" "}
                        {ticket.event.venue.location.city},{" "}
                        {ticket.event.venue.location.country}
                      </Text>
                    </Flex>
                    <Flex alignItems="center">
                      <MdCalendarToday size={"30px"} />
                      <Text fontSize={"lg"} marginLeft="8px">
                        {formatEventDate(ticket.event.eventDate)}
                      </Text>
                    </Flex>
                  </Flex>
                  {artistImage && (
                    <img
                      height={"70px"}
                      width={"70px"}
                      src={artistImage}
                      alt="Artist"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid black",
                      }}
                    />
                  )}
                </Flex>

                {renderWeatherDetails()}

                {ticket.description && (
                  <Flex flexDirection={"column"}>
                    <Heading>Description</Heading>
                    <Text
                      bg={"blue.800"}
                      borderRadius={"lg"}
                      padding={"5px"}
                      color={"white"}
                      width={"fit-content"}
                    >
                      {ticket.description}
                    </Text>
                  </Flex>
                )}

                {status === "SWAP" ? (
                  <Flex justifyContent={"center"}>
                    <Text fontSize={"lg"} fontWeight={"bold"}>
                      User is looking to swap for a ticket in this category:{" "}
                      <Badge
                        bgColor={ticket.interestedInCategories[0]?.colorHexCode}
                        color="white"
                        px="2"
                        py="1"
                        borderRadius="md"
                        fontSize="sm"
                      >
                        {ticket.interestedInCategories[0]?.name}
                      </Badge>
                    </Text>
                  </Flex>
                ) : (
                  <Flex justifyContent={"center"}>
                    <Text fontSize={"4xl"} fontWeight={"bold"}>
                      {`${ticket.price}€`}
                    </Text>
                  </Flex>
                )}

                <Flex justifyContent={"space-between"}>
                  <Card.Root border={"none"} width={"40%"}>
                    <Card.Header paddingLeft={"0"}>
                      <Heading>Posted by</Heading>
                    </Card.Header>
                    <Card.Body padding={"0"}>
                      {ticket.postedByUser.username}
                    </Card.Body>
                  </Card.Root>
                  {!isLoggedIn && (
                    <Button
                      width={"20%"}
                      alignSelf={"center"}
                      variant={"solid"}
                      colorPalette={"gray"}
                      onClick={() =>
                        toaster.create({
                          title: "Please log in to perform this action",
                          type: "error",
                        })
                      }
                    >
                      {buttonText}
                    </Button>
                  )}
                  {isLoggedIn && !isMyTicket && (
                    <DialogRoot>
                      <DialogTrigger asChild>
                        <Button
                          width={"20%"}
                          alignSelf={"center"}
                          variant={"solid"}
                          colorPalette={"gray"}
                        >
                          {buttonText}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {ticket.status === "SWAP"
                              ? "Confirm Swap"
                              : "Confirm Purchase"}
                          </DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                          {ticket.status === "SWAP" ? (
                            <Box>
                              <Text>
                                Are you sure you want to initiate a swap? This
                                user is looking for a ticket in category{" "}
                                <Badge
                                  bgColor={
                                    ticket.interestedInCategories[0]
                                      ?.colorHexCode
                                  }
                                  color="white"
                                  px="2"
                                  py="1"
                                  borderRadius="md"
                                  fontSize="sm"
                                >
                                  {ticket.interestedInCategories[0]?.name}
                                </Badge>
                                .
                              </Text>
                              <SelectRoot
                                collection={myTickets}
                                size="sm"
                                marginTop={"10px"}
                              >
                                <SelectLabel>
                                  Select your ticket you want to swap
                                </SelectLabel>
                                <SelectTrigger>
                                  <SelectValueText placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent zIndex={1500}>
                                  {myTickets?.items?.length > 0 ? (
                                    myTickets.items.map((ticket) => (
                                      <SelectItem
                                        item={ticket}
                                        key={ticket.value}
                                        onClick={() =>
                                          setRequestingTicketID(ticket.value)
                                        }
                                      >
                                        <Flex direction={"column"}>
                                          <Badge
                                            width={"fit-content"}
                                            bgColor={
                                              ticket.category?.colorHexCode
                                            }
                                            color="white"
                                            px="2"
                                            py="1"
                                            borderRadius="md"
                                            fontSize="sm"
                                          >
                                            {ticket.category?.name}
                                          </Badge>
                                          {ticket.label}
                                        </Flex>
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem
                                      item={{
                                        label:
                                          "No tickets for swapping available",
                                        value: "",
                                      }}
                                      disabled
                                    >
                                      No tickets for swapping available{" "}
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </SelectRoot>
                              <Checkbox
                                mt={4}
                                checked={shouldAttemptSwap}
                                onCheckedChange={(e) =>
                                  setShouldAttemptSwap(!!e.checked)
                                }
                              >
                                Enable Cycle
                              </Checkbox>
                            </Box>
                          ) : (
                            <Text>
                              Are you sure you want to purchase this ticket for{" "}
                              {ticket.price}€?
                            </Text>
                          )}
                        </DialogBody>
                        <DialogFooter>
                          <DialogActionTrigger asChild>
                            <Button variant="solid" colorPalette="red">
                              Cancel
                            </Button>
                          </DialogActionTrigger>
                          <DialogActionTrigger asChild>
                            <Button
                              variant="solid"
                              colorPalette="green"
                              onClick={
                                ticket.status === "SWAP"
                                  ? handleSwapConfirm
                                  : handleSellConfirm
                              }
                            >
                              Confirm
                            </Button>
                          </DialogActionTrigger>
                        </DialogFooter>
                        <DialogCloseTrigger />
                      </DialogContent>
                    </DialogRoot>
                  )}

                  <Card.Root border={"none"} width={"40%"}>
                    <Card.Header textAlign={"right"} paddingRight={"0"}>
                      <Heading>Posted at</Heading>
                    </Card.Header>
                    <Card.Body textAlign={"right"} padding={"0"}>
                      {formatEventDate(ticket.postedAt)}
                    </Card.Body>
                  </Card.Root>
                </Flex>
              </Flex>
            </Box>
          </Card.Root>
        </Center>
      </>
    );
  };

  return renderTicketDetails(ticket.status);
}
