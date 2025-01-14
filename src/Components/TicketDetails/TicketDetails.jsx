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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}. ${month}. ${year}. ${hours}:${minutes}`;
  };

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
      } catch (err) {
        setError(err.message);
        toaster.create({
          title: "Error fetching ticket",
          description: err.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [params.slug]);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/tickets",
          { credentials: "include" }
        );
        const data = await response.json();

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
      } catch (error) {
        toaster.create({
          title: "Failed to fetch my tickets",
          type: "error",
        });
      }
    };
    fetchMyTickets();
  }, []);

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
                                  ticket.interestedInCategories[0]?.colorHexCode
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
                                      label: "No categories available",
                                      value: "",
                                    }}
                                    disabled
                                  >
                                    No categories available
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </SelectRoot>
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
