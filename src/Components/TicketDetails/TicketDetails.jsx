import { Center, Flex, Spinner, Text, Button, Card } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster, toaster } from "../ui/toaster";

const placeholderTicketSwap = {
    event: {
        title: "music event",
        description: "description",
        eventDate: "yesterday",
        venue: {
            capacity: 2500,
            location: {
                country: "country",
                city: "city",
                address: "address",
            },
        },
        eventEntity: {
            name: "artist",
        },
    },
    status: "SWAP",
    description: "a music event",
    category: "music",
    price: 0
}

const placeholderTicketSell = {
    event: {
        title: "music event",
        description: "description",
        eventDate: "next week",
        venue: {
            capacity: 2500,
            location: {
                country: "country",
                city: "city",
                address: "address",
            },
        },
        eventEntity: {
            name: "artist",
        },
    },
    status: "SELL",
    description: "a music event",
    category: "music",
    price: 1000
}

export default function TicketDetails () {
    const params = useParams();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setTicket(placeholderTicketSwap);
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

    console.log(ticket.status);

    if (ticket.status === "SWAP") {
        return (
            <Card.Root>
                <Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Event name
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.event.title}
                        </Card.Body>
                    </Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Category
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.category}
                        </Card.Body>
                    </Flex>
                </Flex>

                <Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Artist
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.event.eventEntity.name}
                        </Card.Body>
                    </Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Description
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.description}
                        </Card.Body>
                    </Flex>
                </Flex>

                <Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Event time
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.event.eventDate}
                        </Card.Body>
                    </Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Adress
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            <Text>
                                {ticket.event.venue.location.country}
                            </Text>
                            <Text>
                                {ticket.event.venue.location.city}
                            </Text>
                            <Text>
                                {ticket.event.venue.location.address}
                            </Text>
                        </Card.Body>
                    </Flex>
                </Flex>

                <Button width={"10%"} alignSelf={"center"} variant={"solid"} colorPalette={"green"}>Swap</Button>
            </Card.Root>
        )
    }

    if (ticket.status === "SELL") {
        return (
            <Card.Root>
                <Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Event name
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.event.title}
                        </Card.Body>
                    </Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Category
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.category}
                        </Card.Body>
                    </Flex>
                </Flex>

                <Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Artist
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.event.eventEntity.name}
                        </Card.Body>
                    </Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Description
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.description}
                        </Card.Body>
                    </Flex>
                </Flex>

                <Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Event time
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            {ticket.event.eventDate}
                        </Card.Body>
                    </Flex>
                    <Flex direction={"column"} width={"50%"}>
                        <Card.Header alignItems={"center"} fontWeight={"bold"}>
                            Adress
                        </Card.Header>
                        <Card.Body alignItems={"center"}>
                            <Text>
                                {ticket.event.venue.location.country}
                            </Text>
                            <Text>
                                {ticket.event.venue.location.city}
                            </Text>
                            <Text>
                                {ticket.event.venue.location.address}
                            </Text>
                        </Card.Body>
                    </Flex>
                </Flex>
                <Card.Header alignItems={"center"} fontWeight={"bold"}>
                    Price
                </Card.Header>
                <Card.Body alignItems={"center"}>
                    {ticket.price}
                </Card.Body>
                <Button width={"10%"} alignSelf={"center"}>Sell</Button>
            </Card.Root>
        )
    }
}