import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";

// Base URL
import { config } from "../../config";

const columns = [
  {
    title: "Name",
    field: "name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    title: "Price",
    field: "price",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    title: "Category",
    field: "category",
    lookup: {
      "5e9ee50b7ba4852a24f88063": "Formals",
      "5e9ee5167ba4852a24f88064": "Casual",
      "5e9ee51e7ba4852a24f88065": "Sports",
    },
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    title: "Description",
    field: "description",
    options: {
      filter: true,
      sort: false,
    },
  },
];

export default function Products() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const { baseUrl } = config;
  const token = localStorage.getItem("jwt_token");
  const userId = localStorage.getItem("user_id");

  const fetchData = async () => {
    const { baseUrl } = config;
    try {
      const productResponse = await axios.get(`${baseUrl}/products`);
      const data = productResponse.data.map(product => {
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category._id,
          categoryName: product.category.name,
          description: product.description,
        };
      });
      setProducts(data);
      setLoading(false);
      console.log(productResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const onAdd = async (data, resolve) => {
    const { baseUrl } = config;
    try {
      const res = await axios.post(
        `${baseUrl}/product/create/${userId}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      setProducts([
        ...products,
        {
          id: res.data.data._id,
          name: res.data.data.name,
          price: res.data.data.price,
          category: res.data.data.category,
          description: res.data.data.description,
        },
      ]);
      resolve();
    } catch (err) {
      console.log(err);
      resolve();
    }
  };

  const onUpdate = async (data, resolve) => {
    const productId = data.id;
    delete data.id;
    try {
      const res = await axios.put(
        `${baseUrl}/product/${productId}/${userId}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      const oldProducts = products.filter(
        product => product.id !== res.data._id,
      );
      const newProducts = [
        ...oldProducts,
        {
          id: res.data._id,
          name: res.data.name,
          price: res.data.price,
          category: res.data.category,
          description: res.data.description
        },
      ];
      setProducts(newProducts);
    } catch (err) {
      console.log(err);
    }
    resolve();
  };

  const onDelete = async (data, resolve) => {
    const { baseUrl } = config;
    try {
      await axios.delete(`${baseUrl}/product/${data.id}/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setProducts(prevState =>
        prevState.filter(product => product.id !== data.id),
      );
      resolve();
    } catch (err) {
      console.log(err);
      resolve();
    }
  };

  return (
    <>
      <PageTitle title="Products" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {loading ? (
            <Loading />
          ) : (
            <Table
              title="Product List"
              columns={columns}
              data={products}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
