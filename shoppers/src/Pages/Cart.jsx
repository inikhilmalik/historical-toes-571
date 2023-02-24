import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { Grid, GridItem, Box, Flex, Text, Input, Select, Button, Spinner } from '@chakra-ui/react'
import CartCard from "../Components/CartCard";
import Navbar from "../Components/Navbar";
import { AuthContext } from "../ContextApi/AuthContext";
import { Navigate } from "react-router-dom";



const getData = () => {
  return axios.get(`https://long-blue-goshawk-suit.cyclic.app/cart`)
}

function Cart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {isAuth}=useContext(AuthContext);
  let Total = 0;

  const fetched = () => {
    setLoading(true);
    getData()
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetched();
  }, [])

  const handleRemove = (id) => {
    axios.delete(`https://long-blue-goshawk-suit.cyclic.app/cart/${id}`)
      .then(() => fetched())
      .catch(() => fetched())
  }

  useEffect(() => {
    if (searchQuery) {
      // setLoading(true)
      let params = searchQuery ? { q: searchQuery } : {}
      axios.get(`https://long-blue-goshawk-suit.cyclic.app/cart?_sort=price&_order=${order}`, {
        params
      })
        .then((res) => setData(res.data))
        .catch((err) => setError(err))
    }
    else if (order) {
      setLoading(true)
      axios.get(`https://long-blue-goshawk-suit.cyclic.app/cart?_sort=price&_order=${order}`)
        .then((res) => setData(res.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false))
    }
  }, [order, searchQuery])

  
  data.map((it) => {
    Total += it.price;
  })


  if(loading)
  {
    return <Spinner mt={40} />
  }
  if(error)
  {
    return <h1>Something Went Wrong</h1>
  }

  if(!isAuth)
  {
    return <Navigate to="/login" />
  }
  console.log(data)
  return (
    <Box m="auto" width={"92%"} mt={2} >
      <Flex justifyContent={"space-between"} width={"99%"} >
        <Box >
          <Grid templateColumns='repeat(3, 1fr)'   >
            {
              data.map((item) => (
                <GridItem key={item.id} >
                  <CartCard  handleRemove={handleRemove} id={item.id} image={item.image} title={item.title} price={item.price} />
                </GridItem>
              ))
            }

          </Grid>
        </Box>
        <Box border="1px solid black" height={"100%"} width="20%" mt={3} p="5px 15px" >
          <Box >
            <Text borderBottom={"1px solid black"} fontSize={25} fontWeight="700" >ORDER SUMMARY</Text>
          </Box>
          <Flex justifyContent={"space-between"} mt={4} >
            <Text fontSize={20} fontWeight="400" >SUBTOTAL </Text>
            <Text fontSize={20} fontWeight="400" >Rs. {Total} </Text>
          </Flex>
          <Flex justifyContent={"space-between"}  >
            <Text fontSize={20} fontWeight="400" >DELIVERY </Text>
            <Text fontSize={20} fontWeight="400" >Rs. 40 </Text>
          </Flex>
          <Flex borderTop={"1px solid black"} borderBottom={"1px solid black"} justifyContent={"space-between"} mt={8} >
            <Text fontSize={20} fontWeight="400" >TOTAL </Text>
            <Text fontSize={20} fontWeight="400" >Rs. {Total?Total+40:0} </Text>
          </Flex>
          <Button  border={"1px solid black"} borderRadius="0px" mt={2} width="100%" background={"black"} color="white" >CHECKOUT</Button>
        </Box>
      </Flex>

    </Box >
  );
}

export default Cart;