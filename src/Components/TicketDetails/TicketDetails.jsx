'use client'
import { Center, Flex, Spinner, Text, Button, Card, Box, Heading, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster, toaster } from "../ui/toaster";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";

export default function TicketDetails () {
    const params = useParams();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const getCategoryColor = (categoryId) => {
        switch (categoryId) {
          case 1:
            return "blue.500";
          case 4:
            return "green.500";
          case 5:
            return "purple.500";
          case 6:
            return "orange.500";
          case 7:
            return "red.500";
          default:
            return "gray.500";
        }
      };

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

    if (loading) {
        return (
        <>
            <Toaster />
      
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        </>
        );
    }

    if (!ticket) {
        return(
            <Text>Ticket doesn't exist</Text>
        )
    }

    console.log(ticket)

    if (ticket.status === "SWAP") {
        return (
            <>
                <Card.Root bg={"none"} marginTop={"10px"} border={"none"} gap={"10px"}>
                <Box
                  width="500px"
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
                            <Text fontWeight={"bold"}>
                                {ticket.event.eventEntity.name}
                            </Text>
                            <Badge
                            bgColor={getCategoryColor(ticket.categories[0]?.id)}
                            color="white"
                            px="2"
                            py="1"
                            borderRadius="md"
                            fontSize="sm"
                            >
                                {ticket.categories[0]?.name}
                            </Badge>
                        </Flex>

                        <Flex textAlign={"center"}>
                            <MdLocationOn size={"50px"}/>
                            <Text fontSize={"3xl"} width={"full"}>
                            {ticket.event.venue.location.address},{" "}
                            {ticket.event.venue.location.city},{" "}
                            {ticket.event.venue.location.country}
                            </Text>
                        </Flex>

                        <Flex textAlign={"center"}>
                            <MdCalendarToday size={"50px"}/>
                                <Text fontSize={"3xl"} width={"full"}>
                                {formatEventDate(ticket.event.eventDate)}
                            </Text>
                        </Flex>

                        <Flex flexDirection={"column"}>
                            <Heading>
                                {ticket.description ? "Description" : ""}
                            </Heading>
                            <Text bg={"blue.800"} borderRadius={"lg"} padding={"5px"} color={"white"} width={"fit-content"}>
                                {ticket.description}
                            </Text>
                        </Flex>

                        <Flex justifyContent={"space-between"}>
                            <Card.Root border={"none"} width={"40%"}>
                                <Card.Header paddingLeft={"0"}>
                                    <Heading>
                                        Posted by
                                    </Heading>
                                </Card.Header>
                                <Card.Body >
                                    {ticket.postedByUser.username}
                                </Card.Body>
                            </Card.Root>
                            <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                                <PopoverTrigger asChild>
                                    <Button width={"20% "} alignSelf={"center"} variant={"solid"} colorPalette={"gray"}>Swap</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverBody>
                                        <Heading size={"md"} textAlign={"center"} marginBottom={"10px"}>
                                            Are you sure you want to swap?
                                        </Heading>
                                        <Flex justifyContent={"space-around"}>
                                            <Button alignSelf={"center"} onClick={() => setOpen(false)} variant={"solid"} colorPalette={"green"}>Confirm</Button>
                                            <Button alignSelf={"center"} onClick={() => setOpen(false)} variant={"solid"} colorPalette={"red"}>Cancel</Button>
                                        </Flex>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                            <Card.Root border={"none"} width={"40%"}>
                                <Card.Header textAlign={"right"} paddingRight={"0"}>
                                    <Heading>
                                        Posted at
                                    </Heading>
                                </Card.Header>
                                <Card.Body textAlign={"right"}>
                                    {formatEventDate(ticket.postedAt)}
                                </Card.Body>
                            </Card.Root>
                        </Flex>
                    </Flex>

                </Box>
                </Card.Root>
            </>
        )
    }

    if (ticket.status === "SELL") {
        return (
            <>
                <Card.Root bg={"none"} marginTop={"10px"} border={"none"} gap={"10px"}>
                <Box
                  width="500px"
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
                    <Flex gap={"5px"} flexDirection={"column"}>
                        <Flex justifyContent={"space-between"}>
                            <Text fontWeight={"bold"}>
                                {ticket.event.eventEntity.name}
                            </Text>
                            <Badge
                            bgColor={getCategoryColor(ticket.categories[0]?.id)}
                            color="white"
                            px="2"
                            py="1"
                            borderRadius="md"
                            fontSize="sm"
                            >
                                {ticket.categories[0]?.name}
                            </Badge>
                        </Flex>

                        <Flex justifyContent={"space-around"}>
                            <Text fontSize={"8xl"} fontWeight={"bold"}>
                                {`${ticket.price}€`}
                            </Text>
                        </Flex>

                        <Flex textAlign={"center"}>
                            <MdLocationOn size={"50px"}/>
                            <Text fontSize={"3xl"} width={"full"}>
                            {ticket.event.venue.location.address},{" "}
                            {ticket.event.venue.location.city},{" "}
                            {ticket.event.venue.location.country}
                            </Text>
                        </Flex>

                        <Flex textAlign={"center"}>
                            <MdCalendarToday size={"50px"}/>
                                <Text fontSize={"3xl"} width={"full"}>
                                {formatEventDate(ticket.event.eventDate)}
                            </Text>
                        </Flex>

                        <Flex flexDirection={"column"}>
                            <Heading>
                                {ticket.description ? "Description" : ""}
                            </Heading>
                            <Text bg={ticket.description ? "blue.800" : ""} borderRadius={"lg"} padding={"5px"} color={"white"} width={"fit-content"}>
                                {ticket.description}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex justifyContent={"space-between"}>
                            <Card.Root border={"none"} width={"40%"}>
                                <Card.Header paddingLeft={"0"}>
                                    <Heading>
                                        Posted by
                                    </Heading>
                                </Card.Header>
                                <Card.Body >
                                    {ticket.postedByUser.username}
                                </Card.Body>
                            </Card.Root>
                            <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                                <PopoverTrigger asChild>
                                    <Button width={"20% "} alignSelf={"center"} variant={"solid"} colorPalette={"gray"}>Buy</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverBody>
                                        <Heading size={"md"} textAlign={"center"} marginBottom={"10px"}>
                                            Are you sure you want to buy?
                                        </Heading>
                                        <Flex justifyContent={"space-around"}>
                                            <Button alignSelf={"center"} onClick={() => setOpen(false)} variant={"solid"} colorPalette={"green"}>Confirm</Button>
                                            <Button alignSelf={"center"} onClick={() => setOpen(false)} variant={"solid"} colorPalette={"red"}>Cancel</Button>
                                        </Flex>
                                    </PopoverBody>
                                </PopoverContent>
                            </PopoverRoot>
                            <Card.Root border={"none"} width={"40%"}>
                                <Card.Header textAlign={"right"} paddingRight={"0"}>
                                    <Heading>
                                        Posted at
                                    </Heading>
                                </Card.Header>
                                <Card.Body textAlign={"right"}>
                                    {formatEventDate(ticket.postedAt)}
                                </Card.Body>
                            </Card.Root>
                        </Flex>

                </Box>
                </Card.Root>
            </>
        )
    }
}